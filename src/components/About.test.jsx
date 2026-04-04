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

import About from './About'

describe('About', () => {
  it('renders section heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument()
  })

  it('renders bio text', () => {
    render(<About />)
    expect(screen.getByTestId('about-bio')).toBeInTheDocument()
  })
})
