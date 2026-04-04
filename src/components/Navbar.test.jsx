import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, className }) => (
      <header className={className}>{children}</header>
    ),
  },
}))

describe('Navbar', () => {
  it('renders logo initials', () => {
    render(<Navbar />)
    expect(screen.getByText('EH')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /skills/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })
})
