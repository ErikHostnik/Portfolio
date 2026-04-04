import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

// Mock all child components to avoid their dependencies in this smoke test
vi.mock('./components/Navbar', () => ({ default: () => <header id="navbar-mock" /> }))
vi.mock('./components/Hero', () => ({ default: () => <section id="hero" /> }))
vi.mock('./components/About', () => ({ default: () => <section id="about" /> }))
vi.mock('./components/Projects', () => ({ default: () => <section id="projects" /> }))
vi.mock('./components/Skills', () => ({ default: () => <section id="skills" /> }))
vi.mock('./components/Resume', () => ({ default: () => <section id="resume" /> }))
vi.mock('./components/Contact', () => ({ default: () => <section id="contact" /> }))

import App from './App'

describe('App', () => {
  it('renders all major section ids', () => {
    const { container } = render(<App />)
    expect(container.querySelector('#hero')).toBeInTheDocument()
    expect(container.querySelector('#about')).toBeInTheDocument()
    expect(container.querySelector('#projects')).toBeInTheDocument()
    expect(container.querySelector('#skills')).toBeInTheDocument()
    expect(container.querySelector('#resume')).toBeInTheDocument()
    expect(container.querySelector('#contact')).toBeInTheDocument()
  })
})
