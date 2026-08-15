import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { lessons, scenarios } from '../data/content'
import type { OnboardingAnswers } from '../types'

interface AppState {
  onboardingComplete: boolean
  answers: OnboardingAnswers | null
  confidence: number
  completedLessons: string[]
  completedScenarios: string[]
  soundEnabled: boolean
  reducedMotion: boolean
  setOnboarding: (answers: OnboardingAnswers) => void
  completeLesson: (id: string) => void
  completeScenario: (id: string, correct: boolean) => void
  setSoundEnabled: (enabled: boolean) => void
  setReducedMotion: (enabled: boolean) => void
  reset: () => void
}

const initial = { onboardingComplete: false, answers: null, confidence: 50, completedLessons: [], completedScenarios: [], soundEnabled: true, reducedMotion: false }
const clamp = (value: number) => Math.min(100, Math.max(0, value))

export const useAppStore = create<AppState>()(persist((set) => ({
  ...initial,
  setOnboarding: (answers) => set({ onboardingComplete: true, answers, confidence: answers.comfort }),
  completeLesson: (id) => set((state) => state.completedLessons.includes(id) ? state : ({ completedLessons: [...state.completedLessons, id], confidence: clamp(state.confidence + 5) })),
  completeScenario: (id, correct) => set((state) => state.completedScenarios.includes(id) ? state : ({ completedScenarios: [...state.completedScenarios, id], confidence: correct ? clamp(state.confidence + 5) : state.confidence })),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  reset: () => set(initial),
}), { name: 'pawsitive-progress', version: 1, storage: createJSONStorage(() => localStorage), partialize: (state) => ({ onboardingComplete: state.onboardingComplete, answers: state.answers, confidence: state.confidence, completedLessons: state.completedLessons, completedScenarios: state.completedScenarios, soundEnabled: state.soundEnabled, reducedMotion: state.reducedMotion }) }))

export const selectPersonLessons = () => lessons.filter((lesson) => lesson.perspective === 'person')
export const selectOwnerLessons = () => lessons.filter((lesson) => lesson.perspective === 'owner')
export const selectNextLesson = (completed: string[], perspective: 'person' | 'owner' = 'person') => lessons.find((lesson) => lesson.perspective === perspective && !completed.includes(lesson.id))
export const totalActivities = lessons.length + scenarios.length
