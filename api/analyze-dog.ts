import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'

const schema = z.object({
  visibleSignals: z.array(z.object({ signal: z.string(), confidence: z.enum(['low', 'medium', 'high']), explanation: z.string() })).min(1).max(8),
  possibleInterpretation: z.string(),
  uncertainties: z.array(z.string()).min(1).max(6),
  recommendedAction: z.string(),
  safetyNote: z.string(),
})
const unsafe = [/(definitely|certainly) (friendly|aggressive|safe|dangerous)/i, /won['’]?t bite/i, /safe to approach/i, /you can approach/i]
const instruction = `You are an educational assistant helping people understand visible dog body-language cues. Analyse only observable visual signals. Never diagnose emotion, predict behaviour, or state that a dog is safe, friendly, aggressive, dangerous, will not bite, or can be approached. Use cautious language such as appears, may indicate, and can be consistent with. Explain that a single image is insufficient. Give conservative guidance prioritising space. Return JSON matching the supplied schema.`
// Stable multimodal generateContent models verified at https://ai.google.dev/gemini-api/docs/models on 2026-08-15.
const supportedModels = [
  { id: 'gemini-3.7-flash', label: 'Gemini 3.7 Flash' },
  { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash' },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
  { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite' },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite' },
] as const
const supportedModelIds = new Set<string>(supportedModels.map((model) => model.id))
const configuredModel = () => supportedModelIds.has(process.env.GEMINI_MODEL ?? '') ? process.env.GEMINI_MODEL as string : 'gemini-3.5-flash-lite'

function classifyGeminiError(error: unknown) {
  const details = error && typeof error === 'object' ? error as { status?: number; code?: number; message?: string } : {}
  const status = details.status ?? details.code
  const message = details.message?.toLowerCase() ?? ''
  if (status === 401 || status === 403 || message.includes('api key')) return 'invalid_api_key'
  if (status === 429 || message.includes('quota') || message.includes('rate limit')) return 'quota_exceeded'
  if (status === 404 || message.includes('model') && message.includes('not found')) return 'model_unavailable'
  return 'analysis_failed'
}

export default async function handler(request: Request) {
  if (request.method === 'GET') return Response.json({ configured: Boolean(process.env.GEMINI_API_KEY), model: configuredModel(), models: supportedModels })
  if (request.method !== 'POST') return Response.json({ error: 'method_not_allowed' }, { status: 405 })
  try {
    const key = process.env.GEMINI_API_KEY
    if (!key) return Response.json({ error: 'analysis_unavailable' }, { status: 503 })
    const form = await request.formData()
    const image = form.get('image')
    const requestedModel = form.get('model')
    const model = typeof requestedModel === 'string' && supportedModelIds.has(requestedModel) ? requestedModel : configuredModel()
    if (!(image instanceof File)) return Response.json({ error: 'image_required' }, { status: 400 })
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type) || image.size > 5_000_000) return Response.json({ error: 'invalid_image' }, { status: 400 })
    const data = Buffer.from(await image.arrayBuffer()).toString('base64')
    const ai = new GoogleGenAI({ apiKey: key })
    const response = await ai.models.generateContent({
      model,
      contents: [{ inlineData: { data, mimeType: image.type } }, { text: instruction }],
      config: { responseMimeType: 'application/json', responseJsonSchema: z.toJSONSchema(schema) },
    })
    const parsed = schema.safeParse(JSON.parse(response.text ?? '{}'))
    if (!parsed.success || unsafe.some((rule) => rule.test(JSON.stringify(parsed.data)))) return Response.json({ error: 'unsafe_model_response' }, { status: 502 })
    return Response.json({ ...parsed.data, source: 'gemini' })
  } catch (error) {
    const errorCode = classifyGeminiError(error)
    const rawMessage = error && typeof error === 'object' && 'message' in error ? String(error.message) : ''
    const safeMessage = rawMessage.replace(/AIza[\w-]+/g, '[redacted]').slice(0, 500)
    console.error(`[Gemini] ${errorCode}${safeMessage ? `: ${safeMessage}` : ''}`)
    return Response.json({ error: errorCode }, { status: 502 })
  }
}
