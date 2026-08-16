export type Perspective = 'person' | 'owner'
export type PipMood = 'idle' | 'calm' | 'happy' | 'curious' | 'confused' | 'celebrating'
export type DogCue = 'whole-body' | 'loose-stiff' | 'sample-loose' | 'tail' | 'bark' | 'focus' | 'space' | 'choice' | 'passing' | 'approach' | 'leave' | 'excited' | 'stress' | 'consent'

export interface QuizOption { id: string; label: string; teaching?: string }
export interface ScenarioOption extends QuizOption { feedback: string }
export interface Lesson {
  id: string
  perspective: Perspective
  module: string
  title: string
  description: string
  durationMinutes: number
  situation: string
  cue: DogCue
  what: string
  why: string
  how: string
  takeaway: string
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
  cue: DogCue
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate'
  options: ScenarioOption[]
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
  breedEstimate: {
    breed: string
    confidence: 'low' | 'medium' | 'high'
    explanation: string
    typicalCharacteristics: string[]
    typicalBehaviours: string[]
  }
  visibleSignals: DogSignal[]
  possibleInterpretation: string
  uncertainties: string[]
  recommendedAction: string
  safetyNote: string
  source?: 'gemini' | 'on-device' | 'fallback' | 'demo'
}

export interface OnboardingAnswers {
  comfort: number
  situations: string[]
  goal: string
}
