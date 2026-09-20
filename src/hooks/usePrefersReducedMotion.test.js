import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

let listeners
let matches

beforeEach(() => {
  listeners = []
  matches = false
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches,
    addEventListener: (_, handler) => listeners.push(handler),
    removeEventListener: vi.fn(),
  })))
})

describe('usePrefersReducedMotion', () => {
  it('returns false when the media query does not match', () => {
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when the media query matches at mount', () => {
    matches = true
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })

  it('updates when the media query change event fires', () => {
    const { result } = renderHook(() => usePrefersReducedMotion())
    act(() => {
      listeners.forEach((handler) => handler({ matches: true }))
    })
    expect(result.current).toBe(true)
  })
})
