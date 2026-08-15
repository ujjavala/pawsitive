import { describe, expect, it } from 'vitest'
import { demoAnalysis, dogAnalysisSchema, hasUnsafeCertainty, safeFallback } from './analysis'

describe('dog analysis safety', () => {
  it('validates seeded responses', () => {
    expect(dogAnalysisSchema.safeParse(demoAnalysis).success).toBe(true)
    expect(dogAnalysisSchema.safeParse(safeFallback).success).toBe(true)
  })

  it.each(['This dog is definitely friendly.', 'This dog won’t bite.', 'You can approach this dog.', 'It is safe to approach.'])('rejects unsafe certainty: %s', (possibleInterpretation) => {
    expect(hasUnsafeCertainty({ ...demoAnalysis, possibleInterpretation })).toBe(true)
  })

  it('allows cautious educational language', () => {
    expect(hasUnsafeCertainty(demoAnalysis)).toBe(false)
  })
})
