import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_, tag) => {
      const Component = ({ children, ...props }) => {
        const { variants, initial, animate, whileInView, viewport, transition, whileHover, ...rest } = props
        return React.createElement(tag, rest, children)
      }
      return Component
    }
  })
}))

import Resume from './Resume'

describe('Resume', () => {
  it('renders section heading', () => {
    render(<Resume />)
    expect(screen.getByRole('heading', { name: /resume/i })).toBeInTheDocument()
  })

  it('renders download PDF link', () => {
    render(<Resume />)
    const link = screen.getByRole('link', { name: /download pdf/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/resume.pdf')
  })

  it('renders experience and education headings', () => {
    render(<Resume />)
    expect(screen.getByText(/experience/i)).toBeInTheDocument()
    expect(screen.getByText(/education/i)).toBeInTheDocument()
  })
})
