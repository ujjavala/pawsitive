import { beforeEach, describe, expect, it } from 'vitest'
import { useAppStore } from './useAppStore'

const resetStore = () => useAppStore.setState({ onboardingComplete: false, answers: null, confidence: 50, completedLessons: [], completedScenarios: [], soundEnabled: true, reducedMotion: false })

describe('progress store', () => {
  beforeEach(() => { localStorage.clear(); resetStore() })

  it('sets confidence from onboarding', () => {
    useAppStore.getState().setOnboarding({ comfort: 20, situations: ['Dog barking'], goal: 'Feel safer' })
    expect(useAppStore.getState().confidence).toBe(20)
  })

  it('awards a lesson only once', () => {
    useAppStore.getState().completeLesson('dogs-communicate')
    useAppStore.getState().completeLesson('dogs-communicate')
    expect(useAppStore.getState().confidence).toBe(55)
    expect(useAppStore.getState().completedLessons).toEqual(['dogs-communicate'])
  })

  it('does not penalise an incorrect scenario', () => {
    useAppStore.getState().completeScenario('loose-dog', false)
    expect(useAppStore.getState().confidence).toBe(50)
    expect(useAppStore.getState().completedScenarios).toContain('loose-dog')
  })

  it('clamps confidence at 100', () => {
    useAppStore.setState({ confidence: 98 })
    useAppStore.getState().completeLesson('barking')
    expect(useAppStore.getState().confidence).toBe(100)
  })
})
