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

import Skills from './Skills'
import { skills } from '../data/skills'

describe('Skills', () => {
  it('renders section heading', () => {
    render(<Skills />)
    expect(screen.getByRole('heading', { name: /skills/i })).toBeInTheDocument()
  })

  it('renders every skill category', () => {
    render(<Skills />)
    Object.keys(skills).forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument()
    })
  })

  it('renders every skill item', () => {
    render(<Skills />)
    Object.values(skills).flat().forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument()
    })
  })
})
