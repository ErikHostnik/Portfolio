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

import Hero from './Hero'

describe('Hero', () => {
  it('renders the developer name heading', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders View Projects CTA', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /view projects/i })).toBeInTheDocument()
  })

  it('renders Download CV CTA', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /download cv/i })).toBeInTheDocument()
  })
})
