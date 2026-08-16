import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { demoAnalysis } from '../lib/analysis'
import UnderstandDog from './UnderstandDog'

const originalLanguageModel = Object.getOwnPropertyDescriptor(globalThis, 'LanguageModel')
const originalCreateObjectUrl = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')
const originalRevokeObjectUrl = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL')

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ configured: false }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })))
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:dog') })
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() })
})

afterEach(() => {
  if (originalLanguageModel) Object.defineProperty(globalThis, 'LanguageModel', originalLanguageModel)
  else Reflect.deleteProperty(globalThis, 'LanguageModel')
  if (originalCreateObjectUrl) Object.defineProperty(URL, 'createObjectURL', originalCreateObjectUrl)
  else Reflect.deleteProperty(URL, 'createObjectURL')
  if (originalRevokeObjectUrl) Object.defineProperty(URL, 'revokeObjectURL', originalRevokeObjectUrl)
  else Reflect.deleteProperty(URL, 'revokeObjectURL')
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Understand This Dog', () => {
  it('shows the possible breed below the dog photo', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><UnderstandDog/></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: /try the labelled demo photo/i }))

    const breed = screen.getByText(demoAnalysis.breedEstimate.breed)
    expect(breed).toBeInTheDocument()
    expect(breed.closest('.breed-estimate')).toBeInTheDocument()
    expect(screen.getByText('Typical characteristics')).toBeInTheDocument()
    expect(screen.getByText('Possible breed behaviours')).toBeInTheDocument()
    expect(screen.getByText(demoAnalysis.breedEstimate.typicalBehaviours[0])).toBeInTheDocument()
  })

  it('uses private on-device analysis when the server has no key', async () => {
    const { source, ...content } = demoAnalysis
    void source
    Object.defineProperty(globalThis, 'LanguageModel', {
      configurable: true,
      value: {
        availability: vi.fn().mockResolvedValue('available'),
        create: vi.fn().mockResolvedValue({
          prompt: vi.fn().mockResolvedValue(JSON.stringify(content)),
          destroy: vi.fn(),
        }),
      },
    })
    const user = userEvent.setup()
    const { container } = render(<MemoryRouter><UnderstandDog/></MemoryRouter>)
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/analyze-dog', expect.any(Object)))

    const input = container.querySelector<HTMLInputElement>('input[type="file"]')
    expect(input).not.toBeNull()
    await user.upload(input!, new File(['dog'], 'dog.jpg', { type: 'image/jpeg' }))
    await user.click(screen.getByRole('button', { name: /help me understand/i }))

    expect(await screen.findByText(/analysed privately on this device/i)).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
