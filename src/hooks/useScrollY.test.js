import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useScrollY from './useScrollY'

describe('useScrollY', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 })
    // Run rAF callbacks synchronously so scroll updates are testable
    vi.stubGlobal('requestAnimationFrame', (cb) => { cb(); return 0 })
  })

  it('returns 0 initially', () => {
    const { result } = renderHook(() => useScrollY())
    expect(result.current).toBe(0)
  })

  it('updates when window is scrolled', () => {
    const { result } = renderHook(() => useScrollY())
    act(() => {
      Object.defineProperty(window, 'scrollY', { writable: true, value: 120 })
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(120)
  })
})
