import { describe, it, expect } from 'vitest'
import { scenes } from './index'

describe('scenes registry', () => {
  it('exposes exactly the 6 sections used in the redesign', () => {
    expect(Object.keys(scenes).sort()).toEqual(
      ['about', 'contact', 'hero', 'projects', 'resume', 'skills'].sort()
    )
  })

  it('matches the layer counts documented in the design spec', () => {
    expect(scenes.hero).toHaveLength(8)
    expect(scenes.about).toHaveLength(5)
    expect(scenes.skills).toHaveLength(4)
    expect(scenes.projects).toHaveLength(4)
    expect(scenes.resume).toHaveLength(3)
    expect(scenes.contact).toHaveLength(4)
  })

  it('every layer is a non-empty string (Vite-resolved asset URL)', () => {
    Object.values(scenes).flat().forEach((layer) => {
      expect(typeof layer).toBe('string')
      expect(layer.length).toBeGreaterThan(0)
    })
  })
})
