# Portfolio Website — Design Spec
**Date:** 2026-04-04  
**Status:** Approved

---

## Overview

A personal developer portfolio website targeting universal audiences (frontend, backend, full-stack, any company). The goal is a single destination where companies can learn everything about the developer — projects, CV, skills, and contact — through a visually premium, dark-themed single-page application.

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | React (JSX, JavaScript) |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Navigation | Smooth-scroll (anchor links, no routing) |
| Icons | react-icons |
| Contact form | EmailJS (no backend) |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Projects.jsx
│   ├── Skills.jsx
│   ├── Resume.jsx
│   └── Contact.jsx
├── data/
│   └── projects.js       ← manually curated project data
├── assets/
│   └── resume.pdf
├── App.jsx
└── main.jsx
```

---

## Visual Identity

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Page background |
| Surface | `#111111` / `#1a1a1a` | Cards, sections |
| Accent primary | `#6366f1` | Indigo — buttons, highlights |
| Accent secondary | `#a855f7` | Purple — gradient pair |
| Text primary | `#f4f4f5` | Headings, body |
| Text muted | `#71717a` | Subtitles, meta |
| Border | `#27272a` | Card borders, dividers |

### Typography

| Role | Font |
|------|------|
| Headings | Inter (or Plus Jakarta Sans) |
| Body | Inter |
| Code / tags | JetBrains Mono |

### Visual Language

- `1px` borders with indigo glow on hover
- Cards: subtle gradient (`#111` → `#1a1a1a`), thin indigo border on hover, lift on hover
- Gradient text on key headings (indigo → purple)
- Noise/grain texture overlay at ~3% opacity on background for premium depth
- Thin horizontal rules as section dividers

### Logo Mark

- Developer's initials in a minimal geometric monogram
- Rendered in indigo-to-purple gradient

---

## Sections

### 1. Navbar
- Fixed top, `backdrop-blur-md`, transparent on load → dark on scroll
- Logo/initials (left) + nav links (right): About · Projects · Skills · Resume · Contact
- Smooth-scroll to anchors on click

### 2. Hero
- Full viewport height (`100vh`)
- Left-aligned layout (editorial, avoids generic centered template feel)
- Animated text reveal: name fades + slides up, tagline follows, CTA last
- Background: faint slow-moving gradient orbs (indigo/purple, heavily blurred)
- Two CTAs: **View Projects** (filled) + **Download CV** (ghost)

### 3. About Me
- Two-column: bio text (left) + stylized photo or abstract visual (right)
- Short, punchy bio — who you are, what you build, what drives you
- Framer Motion fade-in on scroll entry

### 4. Projects
- Bento-style grid — varied card sizes, not a uniform 3-column grid
- Each card: project name, short description, tech stack tag pills, GitHub + live demo links
- Hover: card lifts slightly, indigo border glow
- Data sourced from `src/data/projects.js` (manually curated)

### 5. Skills / Tech Stack
- Grouped by category: Languages, Frameworks, Tools
- Pill/badge style with react-icons
- Staggered scroll-triggered reveal animation

### 6. Resume
- Inline CV rendered on-page: experience, education, skills in a clean timeline layout
- Sticky "Download PDF" button
- PDF file served from `src/assets/resume.pdf`

### 7. Contact
- Email link, GitHub icon, LinkedIn icon
- Short optional contact form via EmailJS
- Closing personal tagline

---

## Animations

| Location | Animation | Library |
|----------|-----------|---------|
| Hero text | Staggered fade + slide up | Framer Motion |
| Hero background | Slow gradient orb float | CSS keyframes |
| Section entries | Fade + slight Y translate on scroll | Framer Motion (whileInView) |
| Project cards | Lift + border glow on hover | Framer Motion + Tailwind |
| Skills | Staggered pill reveal | Framer Motion |
| Navbar | Blur + bg transition on scroll | Framer Motion / CSS |

Animation philosophy: **a few standout moments (hero, project cards) with calm elsewhere.** Nothing distracts from content.

---

## Data Model

### projects.js

```js
export const projects = [
  {
    id: 1,
    title: "Project Name",
    description: "Short description of what it does and why it matters.",
    tags: ["React", "Node.js", "PostgreSQL"],
    github: "https://github.com/username/repo",
    demo: "https://demo-url.com",  // null if no live demo
    featured: true,                 // featured cards get larger grid slot
  }
]
```

---

## Deployment

- Host on **Vercel** — connect GitHub repo, auto-deploy on push to `main`
- Custom domain optional (recommended for professionalism)
- Environment variable: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` for contact form

---

## Out of Scope

- Blog / writing section
- GitHub API auto-fetch (projects are manually curated)
- Dark/light mode toggle
- Multi-language support
- Backend / database
