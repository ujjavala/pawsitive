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

export default async function handler(request: Request) {
  if (request.method !== 'POST') return Response.json({ error: 'method_not_allowed' }, { status: 405 })
  try {
    const key = process.env.GEMINI_API_KEY
    if (!key) return Response.json({ error: 'analysis_unavailable' }, { status: 503 })
    const form = await request.formData()
    const image = form.get('image')
    if (!(image instanceof File)) return Response.json({ error: 'image_required' }, { status: 400 })
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type) || image.size > 5_000_000) return Response.json({ error: 'invalid_image' }, { status: 400 })
    const data = Buffer.from(await image.arrayBuffer()).toString('base64')
    const ai = new GoogleGenAI({ apiKey: key })
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [{ inlineData: { data, mimeType: image.type } }, { text: instruction }],
      config: { responseMimeType: 'application/json', responseJsonSchema: z.toJSONSchema(schema) },
    })
    const parsed = schema.safeParse(JSON.parse(response.text ?? '{}'))
    if (!parsed.success || unsafe.some((rule) => rule.test(JSON.stringify(parsed.data)))) return Response.json({ error: 'unsafe_model_response' }, { status: 502 })
    return Response.json({ ...parsed.data, source: 'gemini' })
  } catch {
    return Response.json({ error: 'analysis_failed' }, { status: 502 })
  }
}
