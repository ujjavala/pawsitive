import { describe, expect, it } from 'vitest'
import { achievements, lessons, scenarios, signals } from './content'

describe('seeded learning content', () => {
  it('ships the complete MVP content set', () => {
    expect(lessons.filter((lesson) => lesson.perspective === 'person')).toHaveLength(10)
    expect(lessons.filter((lesson) => lesson.perspective === 'owner')).toHaveLength(6)
    expect(scenarios).toHaveLength(8)
    expect(signals).toHaveLength(8)
    expect(achievements).toHaveLength(5)
  })

  it('uses unique IDs and valid answer keys', () => {
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(lessons.length)
    expect(new Set(scenarios.map((scenario) => scenario.id)).size).toBe(scenarios.length)
    for (const item of [...lessons, ...scenarios]) expect(item.options.some((option) => option.id === item.answer)).toBe(true)
  })

  it('links paired perspectives in both directions', () => {
    for (const scenario of scenarios.filter((item) => item.pairedScenarioId)) {
      const pair = scenarios.find((item) => item.id === scenario.pairedScenarioId)
      expect(pair?.pairedScenarioId).toBe(scenario.id)
      expect(pair?.perspective).not.toBe(scenario.perspective)
    }
  })
})
