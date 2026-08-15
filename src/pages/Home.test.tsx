import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Home from './Home'

describe('landing page', () => {
  it('communicates the purpose and offers both journeys', () => {
    render(<MemoryRouter><Home/></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /feel safer around dogs/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /start/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /dog owner/i })).toBeInTheDocument()
  })
})
