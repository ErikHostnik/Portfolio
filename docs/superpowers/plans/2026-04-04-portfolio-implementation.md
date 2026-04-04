# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark, premium single-page portfolio in React + Vite that showcases projects, CV, skills, and contact info for universal company audiences.

**Architecture:** Single-page React app with anchor-based smooth-scroll navigation. All content (projects, skills, resume) lives in static JS data files under `src/data/`. Framer Motion handles scroll-triggered animations and hover effects. EmailJS provides contact form delivery with no backend.

**Tech Stack:** React 18 (JSX), Vite 5, Tailwind CSS 3, Framer Motion 11, react-icons 5, @emailjs/browser 3, Vitest + React Testing Library (tests)

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | Font imports (Google Fonts), root mount |
| `vite.config.js` | Vite + Vitest config |
| `tailwind.config.js` | Custom color tokens, font family |
| `src/index.css` | Base styles, noise texture, smooth scroll, orb animations |
| `src/main.jsx` | React DOM root |
| `src/App.jsx` | Assembles all sections in order |
| `src/data/projects.js` | Manually curated project cards array |
| `src/data/skills.js` | Skills grouped by category |
| `src/data/resume.js` | Experience + education arrays |
| `src/hooks/useScrollY.js` | Returns current window scrollY value |
| `src/components/Navbar.jsx` | Fixed nav, blur, scroll-aware bg, anchor links |
| `src/components/Hero.jsx` | Full-viewport hero, animated text, orb bg, CTAs |
| `src/components/About.jsx` | Two-column bio section |
| `src/components/ProjectCard.jsx` | Single project card with hover glow |
| `src/components/Projects.jsx` | Bento grid of ProjectCards |
| `src/components/Skills.jsx` | Grouped skill pills with stagger reveal |
| `src/components/Resume.jsx` | Inline CV timeline + sticky download button |
| `src/components/Contact.jsx` | EmailJS form + social links |
| `src/test/setup.js` | Testing Library jest-dom matchers setup |
| `src/assets/resume.pdf` | User's actual CV file (user provides) |
| `.env.example` | EmailJS key template |

---

## Task 1: Scaffold Project

**Files:**
- Create: `portfolio/` (Vite scaffold)
- Modify: `vite.config.js`
- Create: `src/test/setup.js`

- [ ] **Step 1: Scaffold Vite + React app**

Run in `C:\Users\erikh\Desktop\Projects\Portfolio`:
```bash
npm create vite@latest . -- --template react
```
When prompted "Current directory is not empty. Remove existing files and continue?" — choose **Yes** (only the docs folder exists, it will be preserved in git).

Expected output:
```
Scaffolding project in .../Portfolio...
Done.
```

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install framer-motion react-icons @emailjs/browser
```

Expected: installs 3 packages, no peer dep warnings.

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 4: Configure Vitest in vite.config.js**

Replace the entire file content:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

- [ ] **Step 5: Create test setup file**

Create `src/test/setup.js`:
```js
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Add test script to package.json**

Open `package.json` and add to the `"scripts"` block:
```json
"test": "vitest",
"test:run": "vitest run",
"coverage": "vitest run --coverage"
```

- [ ] **Step 7: Verify scaffold runs**

```bash
npm run dev
```

Expected: Vite dev server starts at `http://localhost:5173`. Open in browser — see default Vite + React page. Kill with `Ctrl+C`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React project with Vitest"
```

---

## Task 2: Tailwind + Global Styles

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `src/index.css`
- Modify: `index.html`

- [ ] **Step 1: Initialize Tailwind**

```bash
npx tailwindcss init -p
```

Expected: creates `tailwind.config.js` and `postcss.config.js`.

- [ ] **Step 2: Configure Tailwind with custom theme**

Replace `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: {
          DEFAULT: '#111111',
          raised: '#1a1a1a',
        },
        accent: {
          DEFAULT: '#6366f1',
          secondary: '#a855f7',
        },
        border: '#27272a',
        text: {
          primary: '#f4f4f5',
          muted: '#71717a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Write global CSS**

Replace entire `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    background-color: #0a0a0a;
    color: #f4f4f5;
  }

  body {
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* Noise texture overlay */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.035;
    pointer-events: none;
    z-index: 9999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  ::selection {
    background-color: #6366f1;
    color: #f4f4f5;
  }

  :focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }
}

@layer utilities {
  .gradient-text {
    background: linear-gradient(135deg, #6366f1, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-glow {
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .card-glow:hover {
    border-color: #6366f1;
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
  }
}

/* Hero gradient orbs */
@keyframes orb-float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-24px) scale(1.04); }
}

.orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
  opacity: 0.18;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: #6366f1;
  top: -100px;
  left: -100px;
  animation: orb-float 9s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: #a855f7;
  bottom: -50px;
  right: -80px;
  animation: orb-float 12s ease-in-out infinite reverse;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: #6366f1;
  top: 40%;
  right: 25%;
  animation: orb-float 15s ease-in-out infinite;
  opacity: 0.08;
}
```

- [ ] **Step 4: Verify Tailwind works**

Replace `src/App.jsx` with a quick smoke test:
```jsx
function App() {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">
      <h1 className="text-4xl font-bold gradient-text">Portfolio</h1>
    </div>
  )
}
export default App
```

Run `npm run dev`. You should see a centered "Portfolio" with an indigo-to-purple gradient on a near-black background.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: configure Tailwind with dark theme tokens and global styles"
```

---

## Task 3: Data Layer

**Files:**
- Create: `src/data/projects.js`
- Create: `src/data/skills.js`
- Create: `src/data/resume.js`
- Create: `src/data/projects.test.js`

- [ ] **Step 1: Write failing data validation test**

Create `src/data/projects.test.js`:
```js
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
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './projects'`

- [ ] **Step 3: Create projects data**

Create `src/data/projects.js`:
```js
export const projects = [
  {
    id: 1,
    title: 'Movie & Game Rating App',
    description:
      'A full-stack app for rating and reviewing movies and games. Features user authentication, a personal dashboard, and a curated content feed.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    github: 'https://github.com/yourusername/movie-game-rating-app',
    demo: null,
    featured: true,
  },
  {
    id: 2,
    title: 'Project Two',
    description:
      'Short description of what it does and why it matters to end users or the business.',
    tags: ['React', 'TypeScript', 'PostgreSQL'],
    github: 'https://github.com/yourusername/project-two',
    demo: 'https://project-two.vercel.app',
    featured: true,
  },
  {
    id: 3,
    title: 'Project Three',
    description:
      'Short description of what it does and why it matters to end users or the business.',
    tags: ['Python', 'FastAPI', 'Redis'],
    github: 'https://github.com/yourusername/project-three',
    demo: null,
    featured: false,
  },
  {
    id: 4,
    title: 'Project Four',
    description:
      'Short description of what it does and why it matters to end users or the business.',
    tags: ['React', 'Vite', 'Tailwind CSS'],
    github: 'https://github.com/yourusername/project-four',
    demo: 'https://project-four.vercel.app',
    featured: false,
  },
]
```

> **Note:** Replace `yourusername` and all project details with your real data.

- [ ] **Step 4: Create skills data**

Create `src/data/skills.js`:
```js
export const skills = {
  Languages: ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS'],
  Frameworks: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion'],
  Databases: ['MongoDB', 'PostgreSQL', 'Redis'],
  Tools: ['Git', 'GitHub', 'Vite', 'Docker', 'VS Code', 'Figma'],
}
```

> **Note:** Update these to reflect your actual skills.

- [ ] **Step 5: Create resume data**

Create `src/data/resume.js`:
```js
export const resume = {
  experience: [
    {
      id: 1,
      role: 'Your Job Title',
      company: 'Company Name',
      period: 'Jan 2024 – Present',
      description:
        'Brief summary of your responsibilities and key achievements. Focus on impact and technologies used.',
    },
    {
      id: 2,
      role: 'Previous Role',
      company: 'Previous Company',
      period: 'Jun 2022 – Dec 2023',
      description:
        'Brief summary of your responsibilities and key achievements.',
    },
  ],
  education: [
    {
      id: 1,
      degree: 'Your Degree',
      institution: 'Your University / School',
      period: '2019 – 2023',
      description: 'Brief description, relevant coursework, or achievements.',
    },
  ],
}
```

> **Note:** Replace with your actual experience and education.

- [ ] **Step 6: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all 5 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add static data layer for projects, skills, and resume"
```

---

## Task 4: useScrollY Hook

**Files:**
- Create: `src/hooks/useScrollY.js`
- Create: `src/hooks/useScrollY.test.js`

- [ ] **Step 1: Write failing hook test**

Create `src/hooks/useScrollY.test.js`:
```js
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useScrollY from './useScrollY'

describe('useScrollY', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 })
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
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './useScrollY'`

- [ ] **Step 3: Implement the hook**

Create `src/hooks/useScrollY.js`:
```js
import { useState, useEffect } from 'react'

export default function useScrollY() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollY
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useScrollY hook"
```

---

## Task 5: Navbar Component

**Files:**
- Create: `src/components/Navbar.jsx`
- Create: `src/components/Navbar.test.jsx`

- [ ] **Step 1: Write failing Navbar test**

Create `src/components/Navbar.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders logo initials', () => {
    render(<Navbar />)
    expect(screen.getByText('EH')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /skills/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })
})
```

> **Note:** Replace `'EH'` with your actual initials.

- [ ] **Step 2: Run test — verify it fails**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './Navbar'`

- [ ] **Step 3: Implement Navbar**

Create `src/components/Navbar.jsx`:
```jsx
import { motion } from 'framer-motion'
import useScrollY from '../hooks/useScrollY'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const scrollY = useScrollY()
  const scrolled = scrollY > 40

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="text-lg font-bold gradient-text tracking-tight"
        >
          EH
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  )
}
```

> **Note:** Replace `'EH'` with your actual initials.

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Navbar component"
```

---

## Task 6: Hero Component

**Files:**
- Create: `src/components/Hero.jsx`
- Create: `src/components/Hero.test.jsx`

- [ ] **Step 1: Write failing Hero test**

Create `src/components/Hero.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from './Hero'

describe('Hero', () => {
  it('renders the developer name', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders View Projects CTA', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /view projects/i })).toBeInTheDocument()
  })

  it('renders Download CV CTA', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /download cv/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './Hero'`

- [ ] **Step 3: Implement Hero**

Create `src/components/Hero.jsx`:
```jsx
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-accent font-mono text-sm mb-4 tracking-widest uppercase"
          >
            Available for hire
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-text-primary leading-tight mb-6"
          >
            Hi, I'm{' '}
            <span className="gradient-text">Your Name</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-text-muted max-w-2xl mb-4 leading-relaxed"
          >
            Full-stack developer building clean, performant, and thoughtful
            digital products.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-base text-text-muted max-w-xl mb-10"
          >
            I care about the details — from system architecture down to pixel-perfect
            interfaces. Let's build something great.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200"
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              download
              className="px-6 py-3 border border-border text-text-primary font-medium rounded-lg hover:border-accent hover:text-accent transition-colors duration-200"
            >
              Download CV
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

> **Note:** Replace `'Your Name'` and the tagline with your real name and a brief personal description.

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Hero component with animated text reveal and gradient orbs"
```

---

## Task 7: About Component

**Files:**
- Create: `src/components/About.jsx`
- Create: `src/components/About.test.jsx`

- [ ] **Step 1: Write failing About test**

Create `src/components/About.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './About'`

- [ ] **Step 3: Implement About**

Create `src/components/About.jsx`:
```jsx
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {/* Text */}
          <div>
            <motion.p
              variants={fadeInUp}
              className="text-accent font-mono text-sm tracking-widest uppercase mb-3"
            >
              About Me
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-text-primary mb-8"
            >
              About Me
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              data-testid="about-bio"
              className="space-y-4 text-text-muted leading-relaxed"
            >
              <p>
                I'm a full-stack developer with a passion for building products that are
                as thoughtful under the hood as they are on the surface. I care about
                clean architecture, performance, and the small details that make
                interfaces feel great.
              </p>
              <p>
                Whether I'm designing a database schema, building a React component, or
                deploying to production — I bring the same level of attention and
                craft to every layer.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new technologies, contributing
                to open source, or picking apart how great products are built.
              </p>
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            variants={fadeInUp}
            className="flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Gradient backdrop */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-secondary/20 blur-2xl" />
              {/* Photo placeholder — replace with your actual photo */}
              <div className="relative w-full h-full rounded-2xl border border-border bg-surface flex items-center justify-center overflow-hidden">
                <span className="text-6xl font-bold gradient-text">EH</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

> **Note:** Replace the bio paragraphs with your real story. Replace the initials placeholder with an `<img>` tag pointing to your photo when you have one.

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add About section"
```

---

## Task 8: ProjectCard + Projects

**Files:**
- Create: `src/components/ProjectCard.jsx`
- Create: `src/components/Projects.jsx`
- Create: `src/components/Projects.test.jsx`

- [ ] **Step 1: Write failing Projects test**

Create `src/components/Projects.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Projects from './Projects'
import { projects } from '../data/projects'

describe('Projects', () => {
  it('renders section heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
  })

  it('renders all project titles', () => {
    render(<Projects />)
    projects.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument()
    })
  })

  it('renders GitHub links for each project', () => {
    render(<Projects />)
    const githubLinks = screen.getAllByRole('link', { name: /github/i })
    expect(githubLinks.length).toBe(projects.length)
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './Projects'`

- [ ] **Step 3: Implement ProjectCard**

Create `src/components/ProjectCard.jsx`:
```jsx
import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'

export default function ProjectCard({ project, className = '' }) {
  return (
    <motion.article
      className={`relative bg-surface border border-border rounded-xl p-6 card-glow flex flex-col gap-4 ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <FiGithub className="w-4 h-4" />
          GitHub
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Live Demo"
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
          >
            <FiExternalLink className="w-4 h-4" />
            Live Demo
          </a>
        )}
      </div>
    </motion.article>
  )
}
```

- [ ] **Step 4: Implement Projects**

Create `src/components/Projects.jsx`:
```jsx
import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.p
            variants={fadeInUp}
            className="text-accent font-mono text-sm tracking-widest uppercase mb-3"
          >
            Work
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-text-primary mb-12"
          >
            Projects
          </motion.h2>

          {/* Bento grid */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                className={project.featured ? 'md:col-span-2' : ''}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add ProjectCard and Projects bento grid"
```

---

## Task 9: Skills Component

**Files:**
- Create: `src/components/Skills.jsx`
- Create: `src/components/Skills.test.jsx`

- [ ] **Step 1: Write failing Skills test**

Create `src/components/Skills.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './Skills'`

- [ ] **Step 3: Implement Skills**

Create `src/components/Skills.jsx`:
```jsx
import { motion } from 'framer-motion'
import { skills } from '../data/skills'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const pillVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-accent font-mono text-sm tracking-widest uppercase mb-3"
          >
            Stack
          </motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-4xl md:text-5xl font-bold text-text-primary mb-12"
          >
            Skills
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
                  {category}
                </h3>
                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {items.map((skill) => (
                    <motion.span
                      key={skill}
                      variants={pillVariants}
                      className="text-sm font-mono text-text-primary bg-surface border border-border px-3 py-1.5 rounded-lg hover:border-accent hover:text-accent transition-colors duration-200 cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Skills section with staggered pill reveal"
```

---

## Task 10: Resume Component

**Files:**
- Create: `src/components/Resume.jsx`
- Create: `src/components/Resume.test.jsx`
- Add: `public/resume.pdf` (user provides actual file)

- [ ] **Step 1: Place your PDF**

Copy your CV PDF into the `public/` folder and name it `resume.pdf`:
```
public/resume.pdf
```

If you don't have it yet, create a placeholder: `echo "" > public/resume.pdf` — you can replace it later.

- [ ] **Step 2: Write failing Resume test**

Create `src/components/Resume.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Resume from './Resume'

describe('Resume', () => {
  it('renders section heading', () => {
    render(<Resume />)
    expect(screen.getByRole('heading', { name: /resume/i })).toBeInTheDocument()
  })

  it('renders download PDF link', () => {
    render(<Resume />)
    const link = screen.getByRole('link', { name: /download pdf/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/resume.pdf')
  })

  it('renders experience and education headings', () => {
    render(<Resume />)
    expect(screen.getByText(/experience/i)).toBeInTheDocument()
    expect(screen.getByText(/education/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test — verify it fails**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './Resume'`

- [ ] **Step 4: Implement Resume**

Create `src/components/Resume.jsx`:
```jsx
import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'
import { resume } from '../data/resume'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

function TimelineItem({ role, company, period, description }) {
  return (
    <div className="relative pl-6 border-l border-border pb-10 last:pb-0">
      {/* Dot */}
      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-accent" />
      <p className="text-xs font-mono text-text-muted mb-1">{period}</p>
      <h4 className="text-base font-semibold text-text-primary">{role}</h4>
      <p className="text-sm text-accent mb-2">{company}</p>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  )
}

export default function Resume() {
  return (
    <section id="resume" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {/* Header row */}
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <motion.p
                variants={fadeInUp}
                className="text-accent font-mono text-sm tracking-widest uppercase mb-3"
              >
                CV
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold text-text-primary"
              >
                Resume
              </motion.h2>
            </div>
            <motion.a
              variants={fadeInUp}
              href="/resume.pdf"
              download
              className="flex items-center gap-2 px-5 py-2.5 border border-border text-text-primary rounded-lg hover:border-accent hover:text-accent transition-colors duration-200 text-sm font-medium"
            >
              <FiDownload className="w-4 h-4" />
              Download PDF
            </motion.a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Experience */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-8">
                Experience
              </h3>
              <div>
                {resume.experience.map((item) => (
                  <TimelineItem key={item.id} {...item} />
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-8">
                Education
              </h3>
              <div>
                {resume.education.map((item) => (
                  <TimelineItem
                    key={item.id}
                    role={item.degree}
                    company={item.institution}
                    period={item.period}
                    description={item.description}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Resume section with inline timeline and PDF download"
```

---

## Task 11: Contact Component

**Files:**
- Create: `src/components/Contact.jsx`
- Create: `src/components/Contact.test.jsx`
- Create: `.env.example`

- [ ] **Step 1: Create .env.example**

Create `.env.example` at the project root:
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Also create `.env.local` (your actual values — this file is gitignored by Vite automatically):
```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

> **Setup:** Go to https://www.emailjs.com, create a free account, add an email service, create a template, and copy the IDs into `.env.local`. The template should reference `{{name}}`, `{{email}}`, and `{{message}}` variables.

- [ ] **Step 2: Write failing Contact test**

Create `src/components/Contact.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Contact from './Contact'

describe('Contact', () => {
  it('renders section heading', () => {
    render(<Contact />)
    expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument()
  })

  it('renders name, email, and message inputs', () => {
    render(<Contact />)
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/your message/i)).toBeInTheDocument()
  })

  it('renders a submit button', () => {
    render(<Contact />)
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test — verify it fails**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './Contact'`

- [ ] **Step 4: Implement Contact**

Create `src/components/Contact.jsx`:
```jsx
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FiGithub, FiLinkedin, FiMail, FiSend } from 'react-icons/fi'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/yourusername',
    icon: FiGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/yourusername',
    icon: FiLinkedin,
  },
  {
    label: 'Email',
    href: 'mailto:your@email.com',
    icon: FiMail,
  },
]

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('sending')

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      )
      .then(() => {
        setStatus('sent')
        formRef.current.reset()
      })
      .catch(() => {
        setStatus('error')
      })
  }

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.p
            variants={fadeInUp}
            className="text-accent font-mono text-sm tracking-widest uppercase mb-3"
          >
            Contact
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-text-primary mb-4"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-text-muted max-w-lg mb-12"
          >
            I'm open to new opportunities, collaborations, or just a good
            conversation. Drop me a message and I'll get back to you.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Form */}
            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              variants={fadeInUp}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors text-sm"
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors text-sm"
              />
              <textarea
                name="message"
                placeholder="Your message"
                required
                rows={5}
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors text-sm resize-none"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 disabled:opacity-60 transition-colors duration-200 text-sm"
              >
                <FiSend className="w-4 h-4" />
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              {status === 'sent' && (
                <p className="text-sm text-green-400">Message sent successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-400">
                  Something went wrong. Please try again or email directly.
                </p>
              )}
            </motion.form>

            {/* Social links */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <p className="text-text-muted text-sm">Or reach me directly:</p>
              <div className="space-y-4">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-text-muted hover:text-text-primary transition-colors group"
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-surface group-hover:border-accent group-hover:text-accent transition-colors">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-sm font-medium">{label}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer tagline */}
          <motion.div
            variants={fadeInUp}
            className="mt-24 pt-8 border-t border-border text-center"
          >
            <p className="text-text-muted text-sm">
              Designed & built by{' '}
              <span className="gradient-text font-medium">Your Name</span>
              {' '}· {new Date().getFullYear()}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

> **Note:** Replace `yourusername`, `your@email.com`, and `Your Name` with your real links and name.

- [ ] **Step 5: Run tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add .env.example src/components/Contact.jsx src/components/Contact.test.jsx
git commit -m "feat: add Contact section with EmailJS form and social links"
```

---

## Task 12: App Assembly

**Files:**
- Modify: `src/App.jsx`
- Create: `src/App.test.jsx`

- [ ] **Step 1: Write failing App smoke test**

Create `src/App.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders all major sections', () => {
    render(<App />)
    expect(document.getElementById('hero')).toBeInTheDocument()
    expect(document.getElementById('about')).toBeInTheDocument()
    expect(document.getElementById('projects')).toBeInTheDocument()
    expect(document.getElementById('skills')).toBeInTheDocument()
    expect(document.getElementById('resume')).toBeInTheDocument()
    expect(document.getElementById('contact')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm run test:run
```

Expected: FAIL — sections not found (App.jsx still has scaffold code).

- [ ] **Step 3: Implement App**

Replace `src/App.jsx`:
```jsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Resume from './components/Resume'
import Contact from './components/Contact'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Resume />
        <Contact />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Run all tests — verify they pass**

```bash
npm run test:run
```

Expected: all tests across all files PASS.

- [ ] **Step 5: Run dev server and visually review**

```bash
npm run dev
```

Open `http://localhost:5173`. Walk through each section:
- Navbar is fixed, blurs on scroll, links scroll to sections
- Hero has animated text and gradient orbs in background
- About, Projects, Skills, Resume, Contact all appear on scroll
- Project cards have hover glow effect
- Download CV button links to `/resume.pdf`

Kill with `Ctrl+C` when done.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: assemble all sections into App, portfolio complete"
```

---

## Task 13: Deployment Prep

**Files:**
- Modify: `package.json` (verify build script)
- Create: `vercel.json`

- [ ] **Step 1: Verify production build**

```bash
npm run build
```

Expected: `dist/` folder created, no TypeScript or build errors. Output will show bundle sizes.

- [ ] **Step 2: Preview the production build locally**

```bash
npm run preview
```

Open `http://localhost:4173`. Verify everything looks correct in the production build. Kill with `Ctrl+C`.

- [ ] **Step 3: Create vercel.json for SPA routing**

Create `vercel.json` at the project root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 4: Push to GitHub**

Create a new repo on GitHub called `portfolio` (go to github.com/new), then:
```bash
git remote add origin https://github.com/yourusername/portfolio.git
git branch -M main
git push -u origin main
```

> **Note:** Replace `yourusername` with your actual GitHub username.

- [ ] **Step 5: Deploy to Vercel**

1. Go to https://vercel.com/new
2. Import the `portfolio` GitHub repo
3. Framework preset will auto-detect as **Vite**
4. Add environment variables under **Environment Variables**:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
5. Click **Deploy**

Your portfolio will be live at `https://portfolio-yourusername.vercel.app`.

- [ ] **Step 6: Final commit**

```bash
git add vercel.json
git commit -m "chore: add Vercel SPA rewrite config"
git push
```

---

## Personalisation Checklist

After completing all tasks, go through every `> Note:` in this plan and replace placeholder content with your real information:

- [ ] `Navbar.jsx` — your initials
- [ ] `Hero.jsx` — your name, tagline, and bio summary
- [ ] `About.jsx` — your bio text, initials (or real photo)
- [ ] `src/data/projects.js` — all your real projects with correct GitHub URLs
- [ ] `src/data/skills.js` — your actual tech stack
- [ ] `src/data/resume.js` — your real work history and education
- [ ] `Contact.jsx` — your GitHub URL, LinkedIn URL, email address, footer name
- [ ] `public/resume.pdf` — your actual CV PDF
- [ ] `.env.local` — real EmailJS credentials
