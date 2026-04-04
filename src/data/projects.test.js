import { describe, it, expect } from 'vitest'
import { projects } from './projects'
import { skills } from './skills'
import { resume } from './resume'

describe('projects data', () => {
  it('is an array with at least one item', () => {
    expect(Array.isArray(projects)).toBe(true)
    expect(projects.length).toBeGreaterThan(0)
  })

  it('each project has required fields', () => {
    projects.forEach((p) => {
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('title')
      expect(p).toHaveProperty('description')
      expect(Array.isArray(p.tags)).toBe(true)
      expect(p).toHaveProperty('github')
      expect(p).toHaveProperty('featured')
    })
  })
})

describe('skills data', () => {
  it('has at least one category', () => {
    expect(Object.keys(skills).length).toBeGreaterThan(0)
  })

  it('each category is an array of strings', () => {
    Object.values(skills).forEach((category) => {
      expect(Array.isArray(category)).toBe(true)
      category.forEach((skill) => expect(typeof skill).toBe('string'))
    })
  })
})

describe('resume data', () => {
  it('has experience and education arrays', () => {
    expect(Array.isArray(resume.experience)).toBe(true)
    expect(Array.isArray(resume.education)).toBe(true)
  })
})
