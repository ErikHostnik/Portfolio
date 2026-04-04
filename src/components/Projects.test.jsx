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

import Projects from './Projects'
import { projects } from '../data/projects'

describe('Projects', () => {
  it('renders section heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
  })

  it('renders all project titles', () => {
    render(<Projects />)
    projects.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument()
    })
  })

  it('renders GitHub links for each project', () => {
    render(<Projects />)
    const githubLinks = screen.getAllByRole('link', { name: /github/i })
    expect(githubLinks.length).toBe(projects.length)
  })
})
