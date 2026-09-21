# Pixel/Retro-Game Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current indigo/purple SaaS theme with a full 16-bit pixel/retro-game theme: every section gets a full-bleed animated parallax "driving through a landscape" background (from the Craftpix asset packs already in `src/assets/backgrounds/`), with text readable inside a retro RPG-style "dialog box" panel.

**Architecture:** A reusable `<ParallaxScene>` (rAF-driven, `IntersectionObserver`-gated, `transform`-only) sits behind each section as `-z-10`. A reusable `<DialogPanel>` wraps each section's real content on top of the scene. All color/typography changes flow through existing Tailwind theme tokens (`bg`, `surface`, `accent`, `border`, `text`) so component class names mostly don't change — only the token *values* do.

**Tech Stack:** React 19, Vite, Tailwind CSS 3.4, Framer Motion, Vitest + Testing Library (unit), Playwright (new — visual regression).

**Spec:** `docs/superpowers/specs/2026-09-20-pixel-retro-redesign-design.md`

## Global Constraints

- Max 2 font families total: `"Press Start 2P"` (display/headings only) + `"Pixelify Sans"` (body, nav, buttons, `font-mono` utility repointed to the same family — no third family).
- `border-radius: 0` on every button, card, panel, and nav surface.
- Parallax animation only writes `transform: translateX(...)` — never `top`/`left`/`width`.
- `prefers-reduced-motion: reduce` must stop the parallax loop; the scene still renders, just static.
- Parallax animation must not run while its section is off-screen (`IntersectionObserver`-gated).
- Dialog panel background/text combo must be ≥ 4.5:1 contrast (WCAG AA), independent of scene brightness.
- Existing Vitest coverage thresholds (`lines/functions/branches/statements: 80`, set in `vite.config.js`) must still pass after every task.
- No existing test file's assertions may be broken by a purely visual (color/radius/font) change — see the per-task "Existing tests" note.

---

## File structure

**New:**
- `src/hooks/useInView.js` + `useInView.test.js`
- `src/hooks/usePrefersReducedMotion.js` + `usePrefersReducedMotion.test.js`
- `src/components/parallax/ParallaxScene.jsx` + `ParallaxScene.test.jsx`
- `src/components/ui/DialogPanel.jsx` + `DialogPanel.test.jsx`
- `src/assets/backgrounds/index.js` + `index.test.js`
- `playwright.config.js`
- `e2e/visual.spec.js`

**Modified:**
- `tailwind.config.js` — palette + fonts
- `src/index.css` — font import, pixel utilities, base color values
- `src/components/Navbar.jsx`, `Hero.jsx`, `About.jsx`, `Skills.jsx`, `Projects.jsx`, `ProjectModal.jsx`, `Resume.jsx`, `Contact.jsx`
- `package.json` — Playwright devDependency + `test:e2e` script

**Not touched (confirmed dead code):** `src/components/ProjectCard.jsx` is not imported anywhere — `Projects.jsx` uses its own inline `TreeCard`. Left as-is; out of scope for a redesign plan (unrelated dead-code removal). `src/App.css` is never imported by `main.jsx` — also untouched.

---

### Task 1: Tailwind pixel palette and fonts

**Files:**
- Modify: `tailwind.config.js:6-25`

**Interfaces:**
- Produces: Tailwind tokens `bg`, `surface.DEFAULT`, `surface.raised`, `accent.DEFAULT`, `accent.secondary`, `border`, `text.primary`, `text.muted` (same names as before, new pixel values), plus new `fontFamily.display`. Every later task's `className` strings assume these values.

- [ ] **Step 1: Replace the colors and fontFamily blocks**

Replace lines 6-25 of `tailwind.config.js` with:

```js
      colors: {
        bg: '#0d0f14',
        surface: {
          DEFAULT: '#12141c',
          raised: '#1a1d28',
        },
        accent: {
          DEFAULT: '#f2b632',
          secondary: '#5f9a4a',
        },
        border: '#e8dfc7',
        text: {
          primary: '#f4f1e6',
          muted: '#b9b2a0',
        },
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'cursive'],
        sans: ['"Pixelify Sans"', 'sans-serif'],
        mono: ['"Pixelify Sans"', 'sans-serif'],
      },
```

Rationale for the palette: `accent` (gold `#f2b632`) is the arcade-gold CTA/link/focus color from the spec, contrast-checked at ~11:1 against the new `surface` navy. `accent.secondary` (moss `#5f9a4a`) replaces the old purple for tags/badges — pulled from the scene foliage. `border` (`#e8dfc7`, parchment) is the pixel border/frame color used on every panel and button. `text.primary`/`text.muted` are cream/parchment tones (~17:1 and ~10:1 contrast against `surface`), softer than pure white to read as "retro game text" rather than harsh white-on-black.

`font-mono` is repointed to the same `Pixelify Sans` family (not a third font) so the many existing `font-mono` utility classes across components keep working without every one needing a rename.

- [ ] **Step 2: Verify the build still compiles**

Run: `npm run build`
Expected: build succeeds (Tailwind regenerates utilities from the new token values; no component changes yet, so the site still renders — just with new colors bleeding through immediately in places like `:focus-visible`, which is expected and fixed in Task 2).

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "feat: swap Tailwind theme tokens to the pixel/retro-game palette"
```

---

### Task 2: Pixel fonts, focus ring, and reusable pixel utilities in `index.css`

**Files:**
- Modify: `src/index.css:1`, `src/index.css:9-11`, `src/index.css:39-42`, `src/index.css:45-61`

**Interfaces:**
- Produces: `.pixelated` (crisp-scaling utility, consumed by `ParallaxScene` in Task 6), `.pixel-border` (consumed by `DialogPanel` in Task 7 and by every restyled button/card).

- [ ] **Step 1: Swap the Google Fonts import**

Replace line 1:

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@400;500;600;700&display=swap');
```

- [ ] **Step 2: Update the base html background/text color**

Replace lines 9-11 (inside `html { ... }`):

```css
    background-color: #0d0f14;
    color: #f4f1e6;
```

- [ ] **Step 3: Update the focus ring to the pixel accent**

Replace lines 39-42:

```css
  :focus-visible {
    outline: 3px solid #f2b632;
    outline-offset: 2px;
  }
```

- [ ] **Step 4: Add pixel utilities alongside the existing `.gradient-text`/`.card-glow` rules**

Insert immediately before the closing `}` of the `@layer utilities` block (after the existing `.card-glow:hover` rule, still inside `@layer utilities`, lines 45-61):

```css
  .pixelated {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }

  .pixel-border {
    border: 3px solid #e8dfc7;
    box-shadow:
      inset 0 0 0 2px #0d0f14,
      4px 4px 0 0 rgba(0, 0, 0, 0.45);
  }

  .pixel-border-active:active {
    transform: translateY(2px);
    box-shadow:
      inset 0 0 0 2px #0d0f14,
      2px 2px 0 0 rgba(0, 0, 0, 0.45);
  }
```

Leave `.gradient-text`, `.card-glow`, `.orb*` rules untouched for now — they're still referenced by components until Tasks 9/11/12/14 migrate away from them; Task 16 deletes them once zero references remain.

- [ ] **Step 5: Manual check**

Run: `npm run dev`, open the site. Expected: page background/text now reads dark-navy/cream, focus ring is gold, nothing else visibly different yet (fonts don't apply until component classes reference `font-display`/`font-sans` in later tasks — Tailwind's default `font-sans` utility already picks up the new `Pixelify Sans` value immediately, so body copy should already look different).

- [ ] **Step 6: Commit**

```bash
git add src/index.css
git commit -m "feat: load pixel fonts and add pixel-border/pixelated utilities"
```

---

### Task 3: Parallax scene asset registry

**Files:**
- Create: `src/assets/backgrounds/index.js`
- Test: `src/assets/backgrounds/index.test.js`

**Interfaces:**
- Produces: `scenes: { hero, about, skills, projects, resume, contact }`, each an ordered `string[]` of image URLs (back-to-front), imported by every section task from Task 9 onward as `import { scenes } from '../assets/backgrounds'`.

- [ ] **Step 1: Write the failing test**

```js
// src/assets/backgrounds/index.test.js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/assets/backgrounds/index.test.js`
Expected: FAIL — `Cannot find module './index'`.

- [ ] **Step 3: Write the registry**

```js
// src/assets/backgrounds/index.js
import heroLayer1 from './nature_1/1.png'
import heroLayer2 from './nature_1/2.png'
import heroLayer3 from './nature_1/3.png'
import heroLayer5 from './nature_1/5.png'
import heroLayer6 from './nature_1/6.png'
import heroLayer7 from './nature_1/7.png'
import heroLayer8 from './nature_1/8.png'
import heroLayer10 from './nature_1/10.png'

import aboutLayer1 from './nature_5/1.png'
import aboutLayer2 from './nature_5/2.png'
import aboutLayer3 from './nature_5/3.png'
import aboutLayer4 from './nature_5/4.png'
import aboutLayer5 from './nature_5/5.png'

import skillsLayer1 from './nature_2/1.png'
import skillsLayer2 from './nature_2/2.png'
import skillsLayer3 from './nature_2/3.png'
import skillsLayer4 from './nature_2/4.png'

import projectsLayer1 from './nature_3/1.png'
import projectsLayer2 from './nature_3/2.png'
import projectsLayer3 from './nature_3/3.png'
import projectsLayer4 from './nature_3/4.png'

import resumeLayer1 from './nature_6/1.png'
import resumeLayer2 from './nature_6/2.png'
import resumeLayer3 from './nature_6/3.png'

import contactLayer1 from './nature_4/1.png'
import contactLayer2 from './nature_4/2.png'
import contactLayer3 from './nature_4/3.png'
import contactLayer4 from './nature_4/4.png'

export const scenes = {
  hero: [heroLayer1, heroLayer2, heroLayer3, heroLayer5, heroLayer6, heroLayer7, heroLayer8, heroLayer10],
  about: [aboutLayer1, aboutLayer2, aboutLayer3, aboutLayer4, aboutLayer5],
  skills: [skillsLayer1, skillsLayer2, skillsLayer3, skillsLayer4],
  projects: [projectsLayer1, projectsLayer2, projectsLayer3, projectsLayer4],
  resume: [resumeLayer1, resumeLayer2, resumeLayer3],
  contact: [contactLayer1, contactLayer2, contactLayer3, contactLayer4],
}
```

Note: Vitest runs through Vite's transform pipeline, so `.png` imports resolve to URL strings in tests too — no mocking needed.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/assets/backgrounds/index.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/assets/backgrounds/index.js src/assets/backgrounds/index.test.js
git commit -m "feat: add parallax scene asset registry mapping sections to layers"
```

---

### Task 4: `useInView` hook

**Files:**
- Create: `src/hooks/useInView.js`
- Test: `src/hooks/useInView.test.jsx`
- Modify: `src/test/setup.js`

**Interfaces:**
- Produces: `useInView(options?: IntersectionObserverInit) => [ref: RefObject, inView: boolean]`. Consumed by `ParallaxScene` (Task 6).

- [ ] **Step 1: Write the failing test**

```jsx
// src/hooks/useInView.test.jsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useInView.test.jsx`
Expected: FAIL — `Cannot find module './useInView'`.

- [ ] **Step 3: Write the implementation**

```js
// src/hooks/useInView.js
import { useEffect, useRef, useState } from 'react'

export default function useInView(options) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
    }, options)

    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return [ref, inView]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useInView.test.jsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Add a global `IntersectionObserver` stub to the test environment**

`jsdom` (Vitest's `environment: 'jsdom'`) does not implement `IntersectionObserver` at all — it's simply undefined on the global object. `useInView.test.jsx` works around this locally with its own `vi.stubGlobal`, but Tasks 9-14 render full section components (`Hero`, `About`, etc.) that mount `<ParallaxScene>` — and therefore call `useInView` — for real, without mocking it. Without a default global stub, every one of those existing test files (`Hero.test.jsx`, `About.test.jsx`, `Skills.test.jsx`, `Projects.test.jsx`, `Resume.test.jsx`, `Contact.test.jsx`) will crash with `ReferenceError: IntersectionObserver is not defined` the moment their task lands. Add this to `src/test/setup.js`:

```js
// src/test/setup.js
import '@testing-library/jest-dom'

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = MockIntersectionObserver
}
```

This stub never fires (`observe` is a no-op), so `useInView` reports `inView: false` by default in any test that doesn't override it — exactly what `useInView.test.jsx`'s own `beforeEach` already does via `vi.stubGlobal`, which takes precedence within that file. Sections render statically (no rAF loop starts, since `ParallaxScene` gates on `inView`) in every other test file, which is what those files' existing assertions need.

- [ ] **Step 6: Run the full suite to confirm nothing else broke**

Run: `npx vitest run`
Expected: all existing test files still pass (this stub is additive-only; no existing test touches `IntersectionObserver`).

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useInView.js src/hooks/useInView.test.jsx src/test/setup.js
git commit -m "add useInView hook for IntersectionObserver-gated animation"
```

---

### Task 5: `usePrefersReducedMotion` hook

**Files:**
- Create: `src/hooks/usePrefersReducedMotion.js`
- Test: `src/hooks/usePrefersReducedMotion.test.js`
- Modify: `src/test/setup.js`

**Interfaces:**
- Produces: `usePrefersReducedMotion() => boolean`. Consumed by `ParallaxScene` (Task 6).

- [ ] **Step 1: Write the failing test**

```js
// src/hooks/usePrefersReducedMotion.test.js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/usePrefersReducedMotion.test.js`
Expected: FAIL — `Cannot find module './usePrefersReducedMotion'`.

- [ ] **Step 3: Write the implementation**

```js
// src/hooks/usePrefersReducedMotion.js
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export default function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const handleChange = (e) => setPrefersReduced(e.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return prefersReduced
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/usePrefersReducedMotion.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Add a global `matchMedia` stub to the test environment**

`jsdom` does not implement `window.matchMedia`. Same reasoning as Task 4's `IntersectionObserver` stub: `usePrefersReducedMotion.test.js` mocks it locally, but Tasks 9-14's section components mount `<ParallaxScene>` (which calls `usePrefersReducedMotion`) without mocking it, so every existing section test file needs a default global to not crash. Add this to `src/test/setup.js`, alongside the `IntersectionObserver` stub added in Task 4:

```js
// src/test/setup.js
import '@testing-library/jest-dom'

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = MockIntersectionObserver
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })
}
```

Defaulting `matches: false` means `prefers-reduced-motion` reads as "not set" in every test that doesn't override it — sections render with their rAF loop eligible to start (gated only by `inView`, which the Task 4 stub defaults to `false` anyway), matching what the unmodified section test assertions expect (they check rendered text/links, not animation state).

- [ ] **Step 6: Run the full suite to confirm nothing else broke**

Run: `npx vitest run`
Expected: all existing test files still pass.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/usePrefersReducedMotion.js src/hooks/usePrefersReducedMotion.test.js src/test/setup.js
git commit -m "add usePrefersReducedMotion hook"
```

---

### Task 6: `<ParallaxScene>` component

**Files:**
- Create: `src/components/parallax/ParallaxScene.jsx`
- Test: `src/components/parallax/ParallaxScene.test.jsx`

**Interfaces:**
- Consumes: `useInView() => [ref, inView]` (Task 4), `usePrefersReducedMotion() => boolean` (Task 5).
- Produces: `<ParallaxScene layers={string[]} speeds?={number[]} className?={string} />`. Consumed by every section task (9-14) as `<ParallaxScene layers={scenes.hero} />` etc.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/parallax/ParallaxScene.test.jsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/parallax/ParallaxScene.test.jsx`
Expected: FAIL — `Cannot find module './ParallaxScene'`.

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/parallax/ParallaxScene.jsx
import { useEffect, useRef } from 'react'
import useInView from '../../hooks/useInView'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

const BASE_SPEED = 8 // px/sec, farthest layer
const SPEED_STEP = 10 // px/sec added per layer toward the foreground

function defaultSpeeds(count) {
  return Array.from({ length: count }, (_, i) => BASE_SPEED + i * SPEED_STEP)
}

export default function ParallaxScene({ layers, speeds, className = '' }) {
  const [containerRef, inView] = useInView({ threshold: 0 })
  const prefersReducedMotion = usePrefersReducedMotion()
  const trackRefs = useRef([])
  const offsets = useRef(layers.map(() => 0))
  const frameRef = useRef(null)
  const lastTimeRef = useRef(null)

  const resolvedSpeeds = speeds ?? defaultSpeeds(layers.length)

  useEffect(() => {
    if (!inView || prefersReducedMotion) {
      return undefined
    }

    const tick = (time) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time
      const deltaSeconds = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      layers.forEach((_, i) => {
        const node = trackRefs.current[i]
        const width = node?.offsetWidth || 0
        if (!node || width === 0) return
        offsets.current[i] = (offsets.current[i] + resolvedSpeeds[i] * deltaSeconds) % (width / 2)
        node.style.transform = `translateX(-${offsets.current[i]}px)`
      })

      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      lastTimeRef.current = null
    }
  }, [inView, prefersReducedMotion, layers, resolvedSpeeds])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {layers.map((src, i) => (
        <div
          key={src}
          ref={(node) => { trackRefs.current[i] = node }}
          className="absolute inset-y-0 left-0 h-full w-[200%] flex"
        >
          <img src={src} alt="" className="pixelated h-full w-1/2 object-cover" draggable={false} />
          <img src={src} alt="" className="pixelated h-full w-1/2 object-cover" draggable={false} />
        </div>
      ))}
    </div>
  )
}
```

Each layer track is 200% wide (two side-by-side copies of the same image); the loop offsets `translateX` up to half the track's width (one image-width) and wraps, so the seam between the two copies is never visible — the standard infinite-scroll-background technique from the spec.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/parallax/ParallaxScene.test.jsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/parallax/ParallaxScene.jsx src/components/parallax/ParallaxScene.test.jsx
git commit -m "add ParallaxScene component for driving-through-landscape backgrounds"
```

---

### Task 7: `<DialogPanel>` component

**Files:**
- Create: `src/components/ui/DialogPanel.jsx`
- Test: `src/components/ui/DialogPanel.test.jsx`

**Interfaces:**
- Produces: `<DialogPanel className?={string}>{children}</DialogPanel>`. Consumed by every section task (9-14).

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/ui/DialogPanel.test.jsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/DialogPanel.test.jsx`
Expected: FAIL — `Cannot find module './DialogPanel'`.

- [ ] **Step 3: Write the implementation**

```jsx
// src/components/ui/DialogPanel.jsx
export default function DialogPanel({ children, className = '' }) {
  return (
    <div className={`relative bg-surface/90 pixel-border rounded-none px-6 py-8 md:px-10 md:py-12 ${className}`}>
      {children}
    </div>
  )
}
```

`bg-surface/90` composites the near-black navy panel at 90% opacity over the scene — solid enough that contrast is guaranteed against the panel color itself (see Task 1's rationale), independent of how bright the parallax art behind it is.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/DialogPanel.test.jsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/DialogPanel.jsx src/components/ui/DialogPanel.test.jsx
git commit -m "add DialogPanel component for readable text over parallax scenes"
```

---

### Task 8: Navbar restyle

**Files:**
- Modify: `src/components/Navbar.jsx` (full file)

**Interfaces:**
- Consumes: nothing new (no `ParallaxScene`/`DialogPanel` — navbar is a fixed HUD bar, not a section).

- [ ] **Step 1: Replace the file**

```jsx
// src/components/Navbar.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
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
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-surface/95 border-b-[3px] border-border'
          : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="text-lg font-display text-accent tracking-tight">
          EH
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted hover:text-accent transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-muted hover:text-accent transition-colors p-1"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-surface/95 border-b-[3px] border-border overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMobile}
                    className="block text-text-muted hover:text-accent transition-colors py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
```

Changes: `gradient-text` → `font-display text-accent` (flat gold pixel logo, no gradient-clip — gradients don't fit the hard-edged pixel aesthetic), `rounded-*`/`backdrop-blur` dropped (flat pixel HUD bar, no blur), hover states now shift to `text-accent` (color change, not opacity) per the spec's "hover states must look designed" rule.

**Existing tests:** `Navbar.test.jsx` checks logo text `'EH'` (unchanged), nav link accessible names (unchanged), and the mobile toggle's `aria-label="Open menu"` (unchanged) — no test changes needed.

- [ ] **Step 2: Run the existing test suite for this file**

Run: `npx vitest run src/components/Navbar.test.jsx`
Expected: PASS (3 tests, unmodified).

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "restyle Navbar as a pixel HUD bar"
```

---

### Task 9: Hero — parallax scene + dialog panel

**Files:**
- Modify: `src/components/Hero.jsx` (full file)

**Interfaces:**
- Consumes: `ParallaxScene` (Task 6), `DialogPanel` (Task 7), `scenes.hero` (Task 3).

- [ ] **Step 1: Replace the file**

```jsx
// src/components/Hero.jsx
import { motion } from 'framer-motion'
import ParallaxScene from './parallax/ParallaxScene'
import DialogPanel from './ui/DialogPanel'
import { scenes } from '../assets/backgrounds'

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
      <ParallaxScene layers={scenes.hero} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <DialogPanel className="max-w-3xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={itemVariants}
              className="text-accent font-sans text-sm mb-4 tracking-widest uppercase"
            >
              Available for hire
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="font-display text-3xl md:text-5xl text-text-primary leading-tight mb-6"
            >
              Hi, I'm{' '}
              <span className="text-accent">Erik Hostnik</span>
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
                className="px-6 py-3 bg-accent text-bg font-semibold pixel-border pixel-border-active transition-colors duration-200 hover:bg-accent-secondary"
              >
                View Projects
              </a>
              <a
                href="/resume.pdf"
                download
                className="px-6 py-3 bg-surface text-text-primary font-semibold pixel-border pixel-border-active hover:text-accent transition-colors duration-200"
              >
                Download CV
              </a>
            </motion.div>
          </motion.div>
        </DialogPanel>
      </div>
    </section>
  )
}
```

Changes: the two `.orb` divs and their wrapping `<div className="absolute inset-0 pointer-events-none">` are gone, replaced by `<ParallaxScene layers={scenes.hero} />`. `gradient-text` → `text-accent`. `h1` now uses `font-display` at a smaller size (`text-3xl md:text-5xl` vs the old `text-5xl md:text-7xl`) — `"Press Start 2P"` is much wider per character than Inter, so the same pixel size reads far larger; this keeps the name on one/two lines instead of overflowing. Buttons drop `rounded-lg` for `pixel-border pixel-border-active`.

**Existing tests:** `Hero.test.jsx` checks for an `h1` (still present), a link named `/view projects/i` and one named `/download cv/i` (both text unchanged) — no test changes needed.

- [ ] **Step 2: Run the existing test suite for this file**

Run: `npx vitest run src/components/Hero.test.jsx`
Expected: PASS (3 tests, unmodified).

- [ ] **Step 3: Manual check**

Run `npm run dev`, open `/`. Expected: Hero shows the nature_1 parallax scene scrolling behind a dark dialog panel with gold-accented pixel-styled text and buttons.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "give Hero a parallax scene and dialog panel"
```

---

### Task 10: About — parallax scene + dialog panel

**Files:**
- Modify: `src/components/About.jsx` (full file)

**Interfaces:**
- Consumes: `ParallaxScene`, `DialogPanel`, `scenes.about`.

- [ ] **Step 1: Replace the file**

```jsx
// src/components/About.jsx
import { motion } from 'framer-motion'
import ParallaxScene from './parallax/ParallaxScene'
import DialogPanel from './ui/DialogPanel'
import { scenes } from '../assets/backgrounds'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      <ParallaxScene layers={scenes.about} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <DialogPanel>
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
                className="text-accent font-sans text-sm tracking-widest uppercase mb-3"
              >
                Who I Am
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="font-display text-2xl md:text-3xl text-text-primary mb-8"
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
                <div className="relative w-full h-full pixel-border bg-surface flex items-center justify-center overflow-hidden">
                  <span className="text-6xl font-display text-accent">EH</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </DialogPanel>
      </div>
    </section>
  )
}
```

Changes: gradient backdrop `blur-2xl` div removed (no soft glows in a flat pixel theme), photo placeholder box gets `pixel-border` instead of `rounded-2xl border border-border`, initials use `font-display text-accent` instead of `gradient-text`. `h2` sizes down (`text-2xl md:text-3xl`) for the same wide-glyph reason as Hero's `h1`.

**Existing tests:** `About.test.jsx` checks heading name `/about me/i` and `data-testid="about-bio"` — both preserved exactly — no test changes needed.

- [ ] **Step 2: Run the existing test suite for this file**

Run: `npx vitest run src/components/About.test.jsx`
Expected: PASS (2 tests, unmodified).

- [ ] **Step 3: Commit**

```bash
git add src/components/About.jsx
git commit -m "give About a parallax scene and dialog panel"
```

---

### Task 11: Skills — parallax scene + dialog panel

**Files:**
- Modify: `src/components/Skills.jsx` (full file)

**Interfaces:**
- Consumes: `ParallaxScene`, `DialogPanel`, `scenes.skills`.

- [ ] **Step 1: Replace the file**

```jsx
// src/components/Skills.jsx
import { motion } from 'framer-motion'
import { skills } from '../data/skills'
import ParallaxScene from './parallax/ParallaxScene'
import DialogPanel from './ui/DialogPanel'
import { scenes } from '../assets/backgrounds'

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
    <section id="skills" className="relative py-24 md:py-32 overflow-hidden">
      <ParallaxScene layers={scenes.skills} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <DialogPanel>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-accent font-sans text-sm tracking-widest uppercase mb-3"
            >
              Stack
            </motion.p>
            <motion.h2
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="font-display text-2xl md:text-3xl text-text-primary mb-12"
            >
              Skills
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xs font-sans text-text-muted uppercase tracking-widest mb-4">
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
                        className="text-sm font-sans text-text-primary bg-surface border-2 border-border px-3 py-1.5 hover:border-accent hover:text-accent transition-colors duration-200 cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </DialogPanel>
      </div>
    </section>
  )
}
```

Changes: `font-mono` → `font-sans` (same physical font per Task 1, but `font-sans` is the semantically correct utility now that `mono` and `sans` are aliases — kept for clarity), skill pills drop `rounded-lg` for a flat `border-2 border-border` (thinner than the 3px `pixel-border` utility since these are small inline pills, not full panels — still flat/square).

**Existing tests:** `Skills.test.jsx` checks heading `/skills/i`, every category name, every skill item by text — all unchanged — no test changes needed.

- [ ] **Step 2: Run the existing test suite for this file**

Run: `npx vitest run src/components/Skills.test.jsx`
Expected: PASS (3 tests, unmodified).

- [ ] **Step 3: Commit**

```bash
git add src/components/Skills.jsx
git commit -m "give Skills a parallax scene and dialog panel"
```

---

### Task 12: Projects + ProjectModal — parallax scene, dialog panel, token colors

**Files:**
- Modify: `src/components/Projects.jsx` (full file)
- Modify: `src/components/ProjectModal.jsx` (full file)

**Interfaces:**
- Consumes: `ParallaxScene`, `DialogPanel`, `scenes.projects`.

- [ ] **Step 1: Replace `Projects.jsx`**

```jsx
// src/components/Projects.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGlobe, FiCpu, FiDatabase, FiCode, FiZap, FiChevronRight } from 'react-icons/fi'
import { projects } from '../data/projects'
import ProjectModal from './ProjectModal'
import ParallaxScene from './parallax/ParallaxScene'
import DialogPanel from './ui/DialogPanel'
import { scenes } from '../assets/backgrounds'

const CATEGORY_ICONS = {
  'Full Stack': FiGlobe,
  Embedded: FiCpu,
  Backend: FiDatabase,
  Frontend: FiCode,
}

function getIcon(category) {
  return CATEGORY_ICONS[category] ?? FiZap
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

function TreeNode({ project, index, onOpen }) {
  const isRight = index % 2 === 0
  const Icon = getIcon(project.category)
  const hasSubProjects = project.subProjects && project.subProjects.length > 0

  return (
    <motion.div
      className="relative flex items-center w-full"
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {/* ── Left slot ── */}
      <div className="flex-1 flex justify-end pr-6 md:pr-10">
        {!isRight ? (
          <TreeCard project={project} onOpen={onOpen} side="left" hasSubProjects={hasSubProjects} Icon={Icon} />
        ) : (
          <div className="w-full" />
        )}
      </div>

      {/* ── Central node ── */}
      <div className="flex-shrink-0 w-10 h-10 bg-surface border-2 border-accent flex items-center justify-center z-10">
        <Icon className="w-4 h-4 text-accent" />
      </div>

      {/* ── Right slot ── */}
      <div className="flex-1 flex justify-start pl-6 md:pl-10">
        {isRight ? (
          <TreeCard project={project} onOpen={onOpen} side="right" hasSubProjects={hasSubProjects} Icon={Icon} />
        ) : (
          <div className="w-full" />
        )}
      </div>
    </motion.div>
  )
}

function TreeCard({ project, onOpen, side, hasSubProjects }) {
  const isLeft = side === 'left'

  return (
    <motion.button
      onClick={() => onOpen(project)}
      className="group relative w-full max-w-sm text-left bg-surface pixel-border pixel-border-active p-5 cursor-pointer focus:outline-none hover:border-accent transition-colors duration-300"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      aria-label={`Open ${project.title} details`}
    >
      {/* Connector line to central path */}
      <span
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 h-0.5 w-6 md:w-10 bg-accent/60 ${isLeft ? '-right-6 md:-right-10' : '-left-6 md:-left-10'}`}
      />

      {/* Category badge */}
      <span className="inline-flex items-center gap-1 text-[10px] font-sans text-accent bg-bg px-2 py-0.5 border border-border mb-3">
        {project.category}
      </span>

      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <FiChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200" />
      </div>

      {/* Description */}
      <p className="text-xs text-text-muted leading-relaxed mb-3 line-clamp-2">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-sans text-accent-secondary bg-bg px-1.5 py-0.5"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 4 && (
          <span className="text-[10px] font-sans text-text-muted px-1.5 py-0.5">
            +{project.tags.length - 4}
          </span>
        )}
      </div>

      {/* Sub-project indicator */}
      {hasSubProjects && (
        <div className="flex items-center gap-1.5 pt-2.5 border-t border-border/40">
          <div className="flex gap-0.5">
            {project.subProjects.slice(0, 4).map((_, i) => (
              <span
                key={i}
                className="w-1 h-3 bg-accent/50 group-hover:bg-accent transition-colors"
                style={{ transitionDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
          <span className="text-[10px] font-sans text-text-muted">
            {project.subProjects.length} sub-project{project.subProjects.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </motion.button>
  )
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section id="projects" className="relative py-24 md:py-32 overflow-hidden">
      <ParallaxScene layers={scenes.projects} />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <DialogPanel>
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="mb-20"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-accent font-sans text-xs tracking-widest uppercase mb-3"
            >
              Work
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-2xl md:text-3xl text-text-primary"
            >
              Projects
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-text-muted mt-4 max-w-md"
            >
              Click any project to explore details, links, and sub-projects.
            </motion.p>
          </motion.div>

          {/* Tree */}
          <div className="relative">
            {/* Start node */}
            <motion.div
              className="flex justify-center mb-10"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-10 h-10 bg-accent flex items-center justify-center z-10">
                <FiZap className="w-4 h-4 text-bg" />
              </div>
            </motion.div>

            {/* Vertical path line */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 bg-accent/40"
              style={{ height: '100%' }}
            />

            {/* Project nodes */}
            <div className="space-y-14">
              {projects.map((project, index) => (
                <TreeNode
                  key={project.id}
                  project={project}
                  index={index}
                  onOpen={setSelectedProject}
                />
              ))}
            </div>

            {/* End node */}
            <motion.div
              className="flex justify-center mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="w-3 h-3 bg-accent/40 border border-accent/60" />
            </motion.div>
          </div>
        </DialogPanel>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
```

Changes: every hardcoded hex (`#6366f1`, `#111111`, `#27272a`, `#a855f7`, `#71717a`, `#f4f4f5`) is replaced with the Tailwind tokens (`accent`, `surface`, `border`, `accent-secondary`, `text-muted`, `text-primary`). All `rounded-*` and glow `shadow-[0_0_...]` classes removed in favor of flat `pixel-border`/plain borders. `font-mono` → `font-sans`.

- [ ] **Step 2: Replace `ProjectModal.jsx`**

```jsx
// src/components/ProjectModal.jsx
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiGithub, FiExternalLink } from 'react-icons/fi'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 28, stiffness: 380 } },
  exit: { opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.18 } },
}

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const hasSubProjects = project.subProjects && project.subProjects.length > 0

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-bg/85"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-surface pixel-border"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="h-1 w-full bg-accent" />

        <div className="p-6 md:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-text-muted hover:text-accent hover:bg-bg transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Category badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-sans text-accent bg-bg px-2.5 py-1 border border-border mb-4">
            {project.category}
          </span>

          {/* Title */}
          <h2
            id="modal-title"
            className="font-display text-xl md:text-2xl text-text-primary mb-3"
          >
            {project.title}
          </h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-sans text-accent-secondary bg-bg px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Long description */}
          <p className="text-text-muted leading-relaxed mb-6">
            {project.longDescription || project.description}
          </p>

          {/* Links */}
          {(project.github || project.demo) && (
            <div className="flex items-center gap-4 pb-6 border-b border-border/40">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
                >
                  <FiGithub className="w-4 h-4" />
                  View on GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
                >
                  <FiExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          )}

          {/* Sub-projects */}
          {hasSubProjects && (
            <div className="mt-6">
              <h3 className="text-xs font-sans text-text-muted uppercase tracking-widest mb-4">
                {project.subProjects.length} sub-project{project.subProjects.length !== 1 ? 's' : ''}
              </h3>
              <div className="space-y-3">
                {project.subProjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="group relative bg-bg border border-border/40 p-4 hover:border-accent transition-colors duration-200"
                  >
                    <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-accent/40 group-hover:bg-accent transition-colors" />

                    <div className="pl-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-sm font-semibold text-text-primary">
                          {sub.title}
                        </h4>
                        {sub.github && (
                          <a
                            href={sub.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-muted hover:text-accent transition-colors flex-shrink-0"
                            aria-label={`${sub.title} on GitHub`}
                          >
                            <FiGithub className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed mb-2.5">
                        {sub.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-sans text-accent bg-bg px-1.5 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-1 w-full bg-accent/40" />
      </motion.div>
    </motion.div>
  )
}
```

**Existing tests:** `Projects.test.jsx` checks the `h2` named `/^projects$/i`, every project title by text, and every project rendered as a `button` named after its title — all preserved (`TreeCard` is still a `motion.button`, `aria-label` unchanged) — no test changes needed. `ProjectModal` has no dedicated test file.

- [ ] **Step 3: Run the existing test suite for this file**

Run: `npx vitest run src/components/Projects.test.jsx`
Expected: PASS (3 tests, unmodified).

- [ ] **Step 4: Commit**

```bash
git add src/components/Projects.jsx src/components/ProjectModal.jsx
git commit -m "give Projects a parallax scene and migrate hardcoded colors to pixel tokens"
```

---

### Task 13: Resume — parallax scene + dialog panel

**Files:**
- Modify: `src/components/Resume.jsx` (full file)

**Interfaces:**
- Consumes: `ParallaxScene`, `DialogPanel`, `scenes.resume`.

- [ ] **Step 1: Replace the file**

```jsx
// src/components/Resume.jsx
import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'
import { resume } from '../data/resume'
import ParallaxScene from './parallax/ParallaxScene'
import DialogPanel from './ui/DialogPanel'
import { scenes } from '../assets/backgrounds'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

function TimelineItem({ role, company, period, description }) {
  return (
    <div className="relative pl-6 border-l-2 border-border/40 pb-10 last:pb-0">
      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-accent" />
      <p className="text-xs font-sans text-text-muted mb-1">{period}</p>
      <h4 className="text-base font-semibold text-text-primary">{role}</h4>
      <p className="text-sm text-accent mb-2">{company}</p>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  )
}

export default function Resume() {
  return (
    <section id="resume" className="relative py-24 md:py-32 overflow-hidden">
      <ParallaxScene layers={scenes.resume} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <DialogPanel>
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
                  className="text-accent font-sans text-sm tracking-widest uppercase mb-3"
                >
                  CV
                </motion.p>
                <motion.h2
                  variants={fadeInUp}
                  className="font-display text-2xl md:text-3xl text-text-primary"
                >
                  Resume
                </motion.h2>
              </div>
              <motion.a
                variants={fadeInUp}
                href="/resume.pdf"
                download
                className="flex items-center gap-2 px-5 py-2.5 bg-surface pixel-border pixel-border-active text-text-primary hover:text-accent transition-colors duration-200 text-sm font-medium"
              >
                <FiDownload className="w-4 h-4" />
                Download PDF
              </motion.a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Experience */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-xs font-sans text-text-muted uppercase tracking-widest mb-8">
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
                <h3 className="text-xs font-sans text-text-muted uppercase tracking-widest mb-8">
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
        </DialogPanel>
      </div>
    </section>
  )
}
```

**Existing tests:** `Resume.test.jsx` checks heading `/resume/i`, the download link's name and `href="/resume.pdf"` (unchanged), and texts `/experience/i`/`/education/i` — no test changes needed.

- [ ] **Step 2: Run the existing test suite for this file**

Run: `npx vitest run src/components/Resume.test.jsx`
Expected: PASS (3 tests, unmodified).

- [ ] **Step 3: Commit**

```bash
git add src/components/Resume.jsx
git commit -m "give Resume a parallax scene and dialog panel"
```

---

### Task 14: Contact — parallax scene + dialog panel

**Files:**
- Modify: `src/components/Contact.jsx` (full file)

**Interfaces:**
- Consumes: `ParallaxScene`, `DialogPanel`, `scenes.contact`.

- [ ] **Step 1: Replace the file**

```jsx
// src/components/Contact.jsx
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FiGithub, FiLinkedin, FiMail, FiSend } from 'react-icons/fi'
import ParallaxScene from './parallax/ParallaxScene'
import DialogPanel from './ui/DialogPanel'
import { scenes } from '../assets/backgrounds'

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
  const [status, setStatus] = useState('idle')

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
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
      <ParallaxScene layers={scenes.contact} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <DialogPanel>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.p
              variants={fadeInUp}
              className="text-accent font-sans text-sm tracking-widest uppercase mb-3"
            >
              Contact
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="font-display text-2xl md:text-3xl text-text-primary mb-4"
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
                <div>
                  <label htmlFor="contact-name" className="sr-only">Your name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    className="w-full bg-bg border-2 border-border px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">Your email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    required
                    className="w-full bg-bg border-2 border-border px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">Your message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Your message"
                    required
                    rows={5}
                    className="w-full bg-bg border-2 border-border px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending' || status === 'sent'}
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-bg font-semibold pixel-border pixel-border-active hover:bg-accent-secondary disabled:opacity-60 transition-colors duration-200 text-sm"
                >
                  <FiSend className="w-4 h-4" />
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'sent' && (
                  <p className="text-sm text-accent-secondary">Message sent successfully!</p>
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
                      className="flex items-center gap-3 text-text-muted hover:text-accent transition-colors group"
                    >
                      <span className="w-10 h-10 flex items-center justify-center border-2 border-border bg-bg group-hover:border-accent transition-colors">
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
              className="mt-24 pt-8 border-t border-border/40 text-center"
            >
              <p className="text-text-muted text-sm">
                Designed & built by{' '}
                <span className="text-accent font-semibold">Your Name</span>
                {' '}· {new Date().getFullYear()}
              </p>
            </motion.div>
          </motion.div>
        </DialogPanel>
      </div>
    </section>
  )
}
```

Changes: `gradient-text` → `text-accent font-semibold` (last `gradient-text` usage in the codebase — after this task zero components reference it). Form fields drop `rounded-lg` for flat `border-2 border-border`, submit button gets `pixel-border pixel-border-active`.

**Existing tests:** `Contact.test.jsx` checks heading `/get in touch/i`, placeholder texts, and submit button name `/send message/i` — all unchanged — no test changes needed.

- [ ] **Step 2: Run the existing test suite for this file**

Run: `npx vitest run src/components/Contact.test.jsx`
Expected: PASS (3 tests, unmodified).

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.jsx
git commit -m "give Contact a parallax scene and dialog panel"
```

---

### Task 15: Playwright visual regression

Playwright is not yet installed in this repo (no `playwright.config.*`, no `@playwright/test` dependency, no `e2e/` directory) — this task bootstraps it for real, scoped to exactly what `web/testing.md` asks for: Hero and About at 320/768/1024/1440, plus a reduced-motion check.

**Files:**
- Modify: `package.json` (add devDependency + script)
- Create: `playwright.config.js`
- Create: `e2e/visual.spec.js`

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Add the `test:e2e` script**

Add to `package.json` `scripts` (alongside the existing `test`/`test:run` entries):

```json
    "test:e2e": "playwright test",
```

- [ ] **Step 3: Write the Playwright config**

```js
// playwright.config.js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

- [ ] **Step 4: Write the visual regression spec**

```js
// e2e/visual.spec.js
import { test, expect } from '@playwright/test'

const breakpoints = [
  { name: '320', width: 320, height: 640 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
]

for (const bp of breakpoints) {
  test(`hero renders readable text over the parallax scene at ${bp.name}px`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page).toHaveScreenshot(`hero-${bp.name}.png`)
  })

  test(`about renders readable text over the parallax scene at ${bp.name}px`, async ({ page }) => {
    await page.setViewportSize({ width: bp.width, height: bp.height })
    await page.goto('/#about')
    await expect(page.getByRole('heading', { name: /about me/i })).toBeVisible()
    await expect(page).toHaveScreenshot(`about-${bp.name}.png`)
  })
}

test('parallax scene stays static when the user prefers reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const heroScene = page.locator('#hero [aria-hidden="true"]').first()
  await expect(heroScene).toBeVisible()
  // Wait out Hero's one-time Framer Motion entrance stagger (worst case ~1.5s:
  // delayChildren 0.2s + 4x staggerChildren 0.15s + itemVariants duration 0.7s)
  // before comparing — otherwise the comparison window overlaps the mount
  // animation, which is unrelated to (and not covered by) the parallax scene's
  // own reduced-motion gating.
  await page.waitForTimeout(2000)
  const before = await heroScene.screenshot()
  await page.waitForTimeout(500)
  const after = await heroScene.screenshot()
  expect(Buffer.compare(before, after)).toBe(0)
})
```

- [ ] **Step 5: Generate baseline screenshots and run the suite**

```bash
npx playwright test --update-snapshots
npx playwright test
```

Expected: all 9 tests pass (8 breakpoint tests + 1 reduced-motion test); baseline `.png` snapshots are written under `e2e/visual.spec.js-snapshots/` and should be committed as the regression baseline.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json playwright.config.js e2e/
git commit -m "add Playwright visual regression for Hero/About across breakpoints"
```

---

### Task 16: Dead-CSS cleanup and full verification

**Files:**
- Modify: `src/index.css` (remove now-unused rules)

**Interfaces:**
- None — this task only removes code, using the confirmed absence of references from Tasks 8-14.

- [ ] **Step 1: Confirm zero remaining references to the old utilities**

```bash
grep -rn "gradient-text\|card-glow\|\borb\b\|orb-1\|orb-2\|orb-3" src/components
```

Expected: no output (Task 9 removed the only `.orb` usage; Tasks 8/9/10/14 removed all four `.gradient-text` usages; `.card-glow` was only ever used by the dead `ProjectCard.jsx`, untouched by this plan, so it stays referenced there — **do not delete `.card-glow`**, since `ProjectCard.jsx` still compiles against it even though nothing renders it).

- [ ] **Step 2: Delete the `.gradient-text` rule and the orb keyframes/classes**

In `src/index.css`, delete the `.gradient-text` block from `@layer utilities` and delete the entire `/* Hero gradient orbs */` section (the `@keyframes orb-float` and `.orb`, `.orb-1`, `.orb-2`, `.orb-3` rules) at the end of the file. Leave `.card-glow` in place per Step 1.

- [ ] **Step 3: Run full verification**

```bash
npm run lint
npm run test:run -- --coverage
npm run build
```

Expected: lint passes with no errors, all Vitest suites pass with coverage ≥ 80% lines/functions/branches/statements, and the production build completes without errors or warnings about missing assets.

If coverage has dropped below 80% because of the new `ParallaxScene`/`DialogPanel`/hook files, add the missing branch coverage (e.g. a test for the `speeds` prop override on `ParallaxScene`, or a test for `DialogPanel` with no `className` prop) before proceeding — do not lower the threshold.

- [ ] **Step 4: Manual smoke test in the browser**

```bash
npm run dev
```

Open `http://localhost:5173`, scroll through every section. Confirm: each section's parallax scene scrolls smoothly (~60fps, no jank), text stays legible inside every dialog panel, focus-visible outlines are gold and pixel-styled when tabbing through links/buttons, and toggling the OS "reduce motion" setting (or `prefers-reduced-motion` in DevTools' Rendering tab) freezes all six parallax scenes without breaking layout.

- [ ] **Step 5: Final commit**

```bash
git add src/index.css
git commit -m "remove unused gradient-text and orb CSS after pixel redesign migration"
```

---

## Self-review notes

- **Spec coverage:** §2 asset mapping → Task 3; §3 `ParallaxScene` → Tasks 4-6; §4 `DialogPanel` → Task 7; §5 typography/palette/components → Tasks 1-2 (tokens) + Tasks 8-14 (application); §6 accessibility/perf → built into Tasks 2 (focus ring), 6 (transform-only + gating), 16 (manual reduced-motion + contrast smoke check); §7 testing → Tasks 4-7 (unit), 15 (visual regression + reduced-motion), 16 (coverage gate); §8 out-of-scope items (nature_7/8, audio, mobile variants) are simply never referenced by any task, consistent with being excluded.
- **Placeholder scan:** no TBD/TODO markers; every code block is complete, runnable code; every step names its exact command and expected result.
- **Type/prop consistency:** `ParallaxScene`'s `layers`/`speeds`/`className` prop names are identical in the Task 6 definition and every Task 9-14 call site (`<ParallaxScene layers={scenes.X} />`, no task ever passes `speeds`, which is correct since it's optional with a spec-mandated depth-based default). `DialogPanel`'s `className`/`children` are identical everywhere it's used. `scenes` keys (`hero`, `about`, `skills`, `projects`, `resume`, `contact`) match exactly between Task 3's registry and every section task's import.
