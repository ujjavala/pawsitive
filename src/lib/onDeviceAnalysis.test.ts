import { afterEach, describe, expect, it, vi } from 'vitest'
import { demoAnalysis } from './analysis'
import { analyzeOnDevice, getOnDeviceAvailability, OnDeviceAnalysisError } from './onDeviceAnalysis'

const originalLanguageModel = Object.getOwnPropertyDescriptor(globalThis, 'LanguageModel')

const setLanguageModel = (factory?: object) => {
  Object.defineProperty(globalThis, 'LanguageModel', { configurable: true, value: factory })
}

const responseContent = () => {
  const { source, ...content } = demoAnalysis
  void source
  return content
}

afterEach(() => {
  if (originalLanguageModel) Object.defineProperty(globalThis, 'LanguageModel', originalLanguageModel)
  else Reflect.deleteProperty(globalThis, 'LanguageModel')
  vi.restoreAllMocks()
})

describe('on-device dog analysis', () => {
  it('reports unavailable when the browser API is absent', async () => {
    setLanguageModel()
    await expect(getOnDeviceAvailability()).resolves.toBe('unavailable')
  })

  it('analyses an image with structured output and destroys the session', async () => {
    const destroy = vi.fn()
    const prompt = vi.fn().mockResolvedValue(JSON.stringify(responseContent()))
    const create = vi.fn().mockResolvedValue({ prompt, destroy })
    const availability = vi.fn().mockResolvedValue('available')
    setLanguageModel({ availability, create })

    const file = new File(['dog'], 'dog.jpg', { type: 'image/jpeg' })
    const result = await analyzeOnDevice(file)

    expect(result).toMatchObject({ source: 'on-device', possibleInterpretation: demoAnalysis.possibleInterpretation })
    expect(availability).toHaveBeenCalledWith(expect.objectContaining({
      expectedInputs: [{ type: 'text', languages: ['en'] }, { type: 'image' }],
    }))
    expect(prompt).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ role: 'user' }),
    ]), expect.objectContaining({ responseConstraint: expect.any(Object) }))
    expect(destroy).toHaveBeenCalledOnce()
  })

  it('surfaces model download progress', async () => {
    const onDownloadProgress = vi.fn()
    setLanguageModel({
      availability: vi.fn().mockResolvedValue('downloadable'),
      create: vi.fn().mockImplementation(async (options) => {
        options.monitor({ addEventListener: (_type: string, listener: (event: { loaded: number }) => void) => listener({ loaded: 0.42 }) })
        return { prompt: vi.fn().mockResolvedValue(JSON.stringify(responseContent())), destroy: vi.fn() }
      }),
    })

    await analyzeOnDevice(new File(['dog'], 'dog.jpg', { type: 'image/jpeg' }), { onDownloadProgress })

    expect(onDownloadProgress).toHaveBeenCalledWith(42)
  })

  it('rejects unsafe model certainty', async () => {
    const unsafe = { ...responseContent(), possibleInterpretation: 'This dog is definitely friendly.' }
    setLanguageModel({
      availability: vi.fn().mockResolvedValue('available'),
      create: vi.fn().mockResolvedValue({ prompt: vi.fn().mockResolvedValue(JSON.stringify(unsafe)), destroy: vi.fn() }),
    })

    await expect(analyzeOnDevice(new File(['dog'], 'dog.jpg', { type: 'image/jpeg' })))
      .rejects.toMatchObject({ code: 'invalid-response' } satisfies Partial<OnDeviceAnalysisError>)
  })
})
