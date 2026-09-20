import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import useInView from './useInView'

let ioCallback
let observeSpy
let disconnectSpy

beforeEach(() => {
  observeSpy = vi.fn()
  disconnectSpy = vi.fn()
  vi.stubGlobal('IntersectionObserver', vi.fn(function (cb) {
    ioCallback = cb
    return { observe: observeSpy, disconnect: disconnectSpy, unobserve: vi.fn() }
  }))
})

function Probe() {
  const [ref, inView] = useInView()
  return <div ref={ref} data-testid="probe">{inView ? 'in-view' : 'out-of-view'}</div>
}

describe('useInView', () => {
  it('starts out of view and observes its node', () => {
    render(<Probe />)
    expect(screen.getByTestId('probe')).toHaveTextContent('out-of-view')
    expect(observeSpy).toHaveBeenCalledTimes(1)
  })

  it('flips to in-view when the observer reports an intersecting entry', () => {
    render(<Probe />)
    act(() => {
      ioCallback([{ isIntersecting: true }])
    })
    expect(screen.getByTestId('probe')).toHaveTextContent('in-view')
  })

  it('disconnects the observer on unmount', () => {
    const { unmount } = render(<Probe />)
    unmount()
    expect(disconnectSpy).toHaveBeenCalledTimes(1)
  })
})
