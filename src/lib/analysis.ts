import { z } from 'zod'
import type { DogAnalysis } from '../types.js'

export const dogAnalysisContentSchema = z.object({
  breedEstimate: z.object({
    breed: z.string().min(1).max(100),
    confidence: z.enum(['low', 'medium', 'high']),
    explanation: z.string().min(1).max(240),
    typicalCharacteristics: z.array(z.string().min(1).max(120)).min(1).max(4),
    typicalBehaviours: z.array(z.string().min(1).max(120)).min(1).max(4),
  }),
  visibleSignals: z.array(z.object({
    signal: z.string().min(1).max(80),
    confidence: z.enum(['low', 'medium', 'high']),
    explanation: z.string().min(1).max(240),
  })).min(1).max(8),
  possibleInterpretation: z.string().min(1).max(500),
  uncertainties: z.array(z.string().min(1).max(240)).min(1).max(6),
  recommendedAction: z.string().min(1).max(400),
  safetyNote: z.string().min(1).max(400),
})

export const dogAnalysisSchema = dogAnalysisContentSchema.extend({
  source: z.enum(['gemini', 'on-device', 'fallback', 'demo']).optional(),
})

const prohibited = [/(definitely|certainly) (friendly|aggressive|safe|dangerous)/i, /won['’]?t bite/i, /safe to approach/i, /you can approach/i]
export const hasUnsafeCertainty = (analysis: DogAnalysis) => prohibited.some((rule) => rule.test(JSON.stringify(analysis)))

export const safeFallback: DogAnalysis = {
  breedEstimate: {
    breed: 'Breed unclear',
    confidence: 'low',
    explanation: 'The visible features are not clear enough to suggest a breed from this image.',
    typicalCharacteristics: ['Physical characteristics vary widely when a breed or mix cannot be identified.'],
    typicalBehaviours: ['Behaviour cannot be inferred from appearance or breed alone.'],
  },
  visibleSignals: [{ signal: 'Visible body position', confidence: 'low', explanation: 'Some body-language cues are visible, but they cannot be interpreted reliably enough from this response.' }],
  possibleInterpretation: 'A single image cannot determine how a dog feels or what it may do next.',
  uncertainties: ['Context and behaviour over time matter.', 'Parts of the dog or surrounding situation may not be visible.'],
  recommendedAction: 'Give the unfamiliar dog space and let the owner guide any interaction.',
  safetyNote: 'Do not approach an unfamiliar dog based solely on an image interpretation.',
  source: 'fallback',
}

export const demoAnalysis: DogAnalysis = {
  breedEstimate: {
    breed: 'Labrador Retriever–type dog',
    confidence: 'medium',
    explanation: 'The broad head, short coat, and overall build resemble a Labrador, though mixes can look similar.',
    typicalCharacteristics: ['Medium-to-large, sturdy build', 'Short, dense coat', 'Broad head and tapered tail'],
    typicalBehaviours: ['Often enjoys retrieving and carrying objects', 'May be energetic and motivated by play', 'Commonly benefits from regular activity and training'],
  },
  visibleSignals: [
    { signal: 'Relatively loose posture', confidence: 'medium', explanation: 'The visible body shape does not appear rigid in this sample image.' },
    { signal: 'Open mouth', confidence: 'medium', explanation: 'The mouth appears open, though a still image cannot explain why.' },
    { signal: 'Ears visible and raised', confidence: 'medium', explanation: 'The ears appear raised and directed toward something nearby.' },
  ],
  possibleInterpretation: 'Together, these visible cues may be consistent with an alert and relatively relaxed dog, but the image is only one moment.',
  uncertainties: ['A photo cannot establish mood or predict behaviour.', 'Movement, sound, environment, and what happened before are unknown.'],
  recommendedAction: 'Keep an appropriate distance and let the owner decide whether an interaction is suitable.',
  safetyNote: 'Never approach an unfamiliar dog based solely on an image interpretation.',
  source: 'demo',
}
