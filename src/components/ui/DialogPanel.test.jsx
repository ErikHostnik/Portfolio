import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DialogPanel from './DialogPanel'

describe('DialogPanel', () => {
  it('renders its children', () => {
    render(<DialogPanel><p>Hello</p></DialogPanel>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('merges a custom className with its base panel styling', () => {
    render(<DialogPanel className="custom-class"><p>Hi</p></DialogPanel>)
    expect(screen.getByText('Hi').parentElement).toHaveClass('custom-class')
    expect(screen.getByText('Hi').parentElement).toHaveClass('pixel-border')
  })

  it('keeps the bg-surface/90 panel background the contrast rationale in Task 1 was computed against', () => {
    render(<DialogPanel><p>Contrast guard</p></DialogPanel>)
    expect(screen.getByText('Contrast guard').parentElement).toHaveClass('bg-surface/90')
  })
})
