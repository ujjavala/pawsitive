export type Perspective = 'person' | 'owner'
export type PipMood = 'idle' | 'calm' | 'happy' | 'curious' | 'confused' | 'celebrating'

export interface QuizOption { id: string; label: string }
export interface Lesson {
  id: string
  perspective: Perspective
  module: string
  title: string
  description: string
  durationMinutes: number
  situation: string
  observations: string[]
  meaning: string
  action: string
  options: QuizOption[]
  answer: string
  explanation: string
}

export interface Scenario {
  id: string
  perspective: Perspective
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate'
  options: QuizOption[]
  answer: string
  explanation: string
  safetyNote?: string
  pairedScenarioId?: string
}

export interface Signal { id: string; name: string; description: string; tone: string }
export interface Achievement { id: string; icon: string; title: string; description: string }

export interface DogSignal {
  signal: string
  confidence: 'low' | 'medium' | 'high'
  explanation: string
}
export interface DogAnalysis {
  visibleSignals: DogSignal[]
  possibleInterpretation: string
  uncertainties: string[]
  recommendedAction: string
  safetyNote: string
  source?: 'gemini' | 'fallback' | 'demo'
}

export interface OnboardingAnswers {
  comfort: number
  situations: string[]
  goal: string
}
