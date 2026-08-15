import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import { dogAnalysisContentSchema, hasUnsafeCertainty } from '../src/lib/analysis.js'
import { dogAnalysisInstruction } from '../src/lib/analysisPrompt.js'

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
      contents: [{ inlineData: { data, mimeType: image.type } }, { text: dogAnalysisInstruction }],
      config: { responseMimeType: 'application/json', responseJsonSchema: z.toJSONSchema(dogAnalysisContentSchema) },
    })
    const parsed = dogAnalysisContentSchema.safeParse(JSON.parse(response.text ?? '{}'))
    if (!parsed.success || hasUnsafeCertainty(parsed.data)) return Response.json({ error: 'unsafe_model_response' }, { status: 502 })
    return Response.json({ ...parsed.data, source: 'gemini' })
  } catch (error) {
    const errorCode = classifyGeminiError(error)
    const rawMessage = error && typeof error === 'object' && 'message' in error ? String(error.message) : ''
    const safeMessage = rawMessage.replace(/AIza[\w-]+/g, '[redacted]').slice(0, 500)
    const messageSuffix = safeMessage ? `: ${safeMessage}` : ''
    console.error(`[Gemini] ${errorCode}${messageSuffix}`)
    return Response.json({ error: errorCode }, { status: 502 })
  }
}
