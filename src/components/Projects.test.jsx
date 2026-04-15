import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_, tag) => {
      const Component = ({ children, ...props }) => {
        const { variants, initial, animate, whileInView, viewport, transition, whileHover, exit, custom, ...rest } = props
        return React.createElement(tag, rest, children)
      }
      return Component
    }
  }),
  AnimatePresence: ({ children }) => children ?? null,
}))

import Projects from './Projects'
import { projects } from '../data/projects'

describe('Projects', () => {
  it('renders section heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { level: 2, name: /^projects$/i })).toBeInTheDocument()
  })

  it('renders all project titles', () => {
    render(<Projects />)
    projects.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument()
    })
  })

  it('renders project cards as interactive buttons', () => {
    render(<Projects />)
    projects.forEach((p) => {
      expect(screen.getByRole('button', { name: new RegExp(p.title, 'i') })).toBeInTheDocument()
    })
  })
})
