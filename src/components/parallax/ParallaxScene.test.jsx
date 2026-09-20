import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ParallaxScene from './ParallaxScene'

vi.mock('../../hooks/useInView', () => ({
  default: () => [{ current: null }, true],
}))

let reducedMotion
vi.mock('../../hooks/usePrefersReducedMotion', () => ({
  default: () => reducedMotion,
}))

beforeEach(() => {
  reducedMotion = false
})

const layers = ['/sky.png', '/mountains.png', '/trees.png']

describe('ParallaxScene', () => {
  it('renders two stitched image copies per layer', () => {
    render(<ParallaxScene layers={layers} />)
    const images = screen.getAllByRole('presentation', { hidden: true })
    expect(images).toHaveLength(layers.length * 2)
  })

  it('does not start a requestAnimationFrame loop when prefers-reduced-motion is set', () => {
    reducedMotion = true
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame')
    render(<ParallaxScene layers={layers} />)
    expect(rafSpy).not.toHaveBeenCalled()
    rafSpy.mockRestore()
  })

  it('starts a requestAnimationFrame loop when in view and motion is allowed', () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1)
    render(<ParallaxScene layers={layers} />)
    expect(rafSpy).toHaveBeenCalled()
    rafSpy.mockRestore()
  })
})
