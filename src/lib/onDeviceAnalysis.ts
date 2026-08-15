import { z } from 'zod'
import type { DogAnalysis } from '../types'
import { dogAnalysisContentSchema, hasUnsafeCertainty } from './analysis'
import { dogAnalysisInstruction } from './analysisPrompt'

export type OnDeviceAvailability = 'unavailable' | 'downloadable' | 'downloading' | 'available'

type ExpectedModality = { type: 'text'; languages: string[] } | { type: 'image' }
type SessionOptions = {
  expectedInputs: ExpectedModality[]
  expectedOutputs: { type: 'text'; languages: string[] }[]
}
type LanguageModelMonitor = {
  addEventListener(type: 'downloadprogress', listener: (event: Event & { loaded: number }) => void): void
}
type LanguageModelSession = {
  prompt(
    input: Array<{ role: 'user'; content: Array<{ type: 'text'; value: string } | { type: 'image'; value: Blob }> }>,
    options: { responseConstraint: object; signal?: AbortSignal },
  ): Promise<string>
  destroy(): void
}
type LanguageModelFactory = {
  availability(options: SessionOptions): Promise<OnDeviceAvailability>
  create(options: SessionOptions & {
    initialPrompts: Array<{ role: 'system'; content: string }>
    signal?: AbortSignal
    monitor?: (monitor: LanguageModelMonitor) => void
  }): Promise<LanguageModelSession>
}

type OnDeviceOptions = {
  signal?: AbortSignal
  onAvailabilityChange?: (availability: OnDeviceAvailability) => void
  onDownloadProgress?: (progress: number) => void
}

const sessionOptions: SessionOptions = {
  expectedInputs: [{ type: 'text', languages: ['en'] }, { type: 'image' }],
  expectedOutputs: [{ type: 'text', languages: ['en'] }],
}

const getFactory = () => (globalThis as typeof globalThis & { LanguageModel?: LanguageModelFactory }).LanguageModel

export class OnDeviceAnalysisError extends Error {
  readonly code: 'unavailable' | 'invalid-response'

  constructor(code: 'unavailable' | 'invalid-response') {
    super(code)
    this.name = 'OnDeviceAnalysisError'
    this.code = code
  }
}

export async function getOnDeviceAvailability(): Promise<OnDeviceAvailability> {
  const factory = getFactory()
  if (!factory) return 'unavailable'
  try {
    return await factory.availability(sessionOptions)
  } catch {
    return 'unavailable'
  }
}

export async function analyzeOnDevice(image: File, options: OnDeviceOptions = {}): Promise<DogAnalysis> {
  const factory = getFactory()
  if (!factory) throw new OnDeviceAnalysisError('unavailable')

  const availability = await factory.availability(sessionOptions)
  options.onAvailabilityChange?.(availability)
  if (availability === 'unavailable') throw new OnDeviceAnalysisError('unavailable')

  const session = await factory.create({
    ...sessionOptions,
    initialPrompts: [{ role: 'system', content: dogAnalysisInstruction }],
    signal: options.signal,
    monitor(monitor) {
      monitor.addEventListener('downloadprogress', (event) => {
        options.onDownloadProgress?.(Math.round(Math.min(1, Math.max(0, event.loaded)) * 100))
      })
    },
  })

  try {
    const response = await session.prompt([
      {
        role: 'user',
        content: [
          { type: 'text', value: 'Analyse this dog photo using only visible body-language signals. Return the requested structured result.' },
          { type: 'image', value: image },
        ],
      },
    ], {
      responseConstraint: z.toJSONSchema(dogAnalysisContentSchema),
      signal: options.signal,
    })
    const parsed = dogAnalysisContentSchema.safeParse(JSON.parse(response))
    if (!parsed.success || hasUnsafeCertainty(parsed.data)) throw new OnDeviceAnalysisError('invalid-response')
    return { ...parsed.data, source: 'on-device' }
  } catch (error) {
    if (error instanceof OnDeviceAnalysisError || error instanceof DOMException && error.name === 'AbortError') throw error
    throw new OnDeviceAnalysisError('invalid-response')
  } finally {
    session.destroy()
  }
}
