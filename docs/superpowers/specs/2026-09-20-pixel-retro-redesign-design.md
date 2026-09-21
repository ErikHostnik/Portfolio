# Pixel/Retro-Game Redesign — Design Spec

Date: 2026-09-20
Status: Approved by user, ready for implementation planning

## 1. Goal

Replace the current dark SaaS/glassmorphism theme with a full 16-bit
SNES/indie pixel-art retro-game theme. Every major section (Hero, About,
Skills, Projects, Resume, Contact) gets a full-bleed animated parallax
"driving through a landscape" background, built from Craftpix parallax
layer packs already present in `src/assets/backgrounds/nature_1` .. `nature_8`.
Text sits in a retro "dialog box" HUD panel on top of the scene, guaranteeing
readability regardless of how bright the underlying art is.

## 2. Assets (already in repo)

`src/assets/backgrounds/nature_{1..8}/{n}.png` — each `nature_N` folder is
one scene, each numbered PNG inside is one parallax layer, back-to-front
(lower number = farther/sky, higher number = closer/foreground). All layers
in a scene share one canvas size (576×324, RGBA, transparent). Layer counts:

| Scene | Layers |
|---|---|
| nature_1 | 8 (1,2,3,5,6,7,8,10) |
| nature_2 | 4 (1-4) |
| nature_3 | 4 (1-4) |
| nature_4 | 4 (1-4) |
| nature_5 | 5 (1-5) |
| nature_6 | 3 (1-3) |
| nature_7 | 2 (1-2) |
| nature_8 | 1 (1) |

`orig.png` / `origbig.png` / `PSD/*.psd` in each folder are source files —
not used at runtime, excluded from the bundle.

### Section → scene mapping

| Section | Scene |
|---|---|
| Hero | nature_1 |
| About | nature_5 |
| Skills | nature_2 |
| Projects | nature_3 |
| Resume | nature_6 |
| Contact | nature_4 |

nature_7 and nature_8 are spares (candidate: navbar/footer texture later,
out of scope for this pass).

## 3. Component: `<ParallaxScene>`

New reusable component, `src/components/parallax/ParallaxScene.jsx`, one
instance per section, wrapping/behind that section's content.

**Props:** `layers: string[]` (ordered image imports, back to front),
`speeds?: number[]` (px/sec per layer, sane depth-based default if omitted
— farther layers slower), `className?`.

**Behavior:**
- Each layer renders twice, side by side (`translateX(0)` and
  `translateX(100%)`), and both copies are shifted left together on a loop
  so the seam is invisible — the standard infinite-scroll-background
  technique. Motion is driven by `requestAnimationFrame`, writing only
  `transform: translateX(...)` (compositor-friendly, no layout thrash).
- Animation runs only while the section is on-screen, gated by
  `IntersectionObserver` (via a small `useInView` hook) — off-screen
  sections don't burn CPU.
- Respects `prefers-reduced-motion`: when set, layers render statically
  (no translation loop) instead of stopping model output — page keeps
  looking correct, just still.
- `image-rendering: pixelated` on every layer so upscaling from the
  576×324 native canvas stays crisp, never blurry.
- Layers are `position: absolute; inset: 0`, scene wrapper is
  `position: relative; overflow: hidden`, sized to fill its section
  (`absolute inset-0` behind the section's content, `-z-10`).

**New hook:** `src/hooks/useInView.js` — thin IntersectionObserver wrapper,
reusable beyond this feature if needed later.

## 4. Component: `<DialogPanel>` (HUD text panel)

New component, `src/components/ui/DialogPanel.jsx`. Renders its children
inside a dark, semi-opaque panel styled like an RPG dialog/HUD box: thick
pixel border (solid, no anti-aliasing, `border-radius: 0`), layered
box-shadow to fake a pixel bevel, background `rgba(navy, 0.85)`+ so
contrast is guaranteed independent of the scene behind it.

Every section's real content (headings, body copy, buttons, cards) moves
inside a `DialogPanel` instance, positioned over its `ParallaxScene`. This
is the mechanism that solves the "bright green scenery vs. readable text"
problem raised during design review — no scene-wide dimming needed, so the
parallax art stays vivid everywhere except behind the text panel itself.

## 5. Visual system (applies globally)

**Typography** (`tailwind.config.js` `fontFamily`, replaces current
Inter/JetBrains Mono pairing):
- Display: `"Press Start 2P"` — headings only (h1/h2), kept short and at
  moderate sizes; this font is unreadable at body-text length.
- Body/UI: `"VT323"` or `"Pixelify Sans"` (final pick made during
  implementation by legibility check at 16px) — body copy, nav, buttons,
  dialog panel text.
- Max two families total, per the existing font-loading budget.

**Color palette** (replaces current indigo/purple `accent` tokens in
`tailwind.config.js`):
- Derived from the scene art: forest greens, sky blue, earth brown for
  ambient/secondary use.
- One warm accent (arcade gold/amber) for links, CTAs, focus states —
  chosen to contrast against the green/blue scenery.
- Dialog panel background: near-black navy, distinct from pure black so it
  reads as "panel" rather than a hole in the page.

**Components:**
- `border-radius: 0` everywhere (buttons, cards, panels, nav).
- Thick (2-4px) solid pixel borders, no blur/glow shadows — pixel-bevel
  shadows instead (hard-edged, offset).
- Buttons get a "pressed" active state: `translate-y-[2px]` + shadow
  shrinks, mimicking a physical retro button.
- Hover states shift border/text color, not just opacity — must look
  designed, not a default Tailwind hover.
- Navbar restyled as a HUD bar using the same panel treatment as
  `DialogPanel`.

## 6. Accessibility & performance

- Contrast: dialog panel background/text combo must hit WCAG AA (4.5:1)
  at minimum — verified once panel colors are finalized, independent of
  scene brightness by construction.
- `prefers-reduced-motion`: parallax layers stop scrolling, scene renders
  as a static composited image (see §3).
- Keyboard focus: pixel-styled focus outlines (thick, high-contrast),
  replacing the current indigo `:focus-visible` outline.
- Perf: only `transform` is animated (no `top`/`left`/`width`), rAF loop
  pauses off-screen via IntersectionObserver, PNG layers are already small
  (576×324) so no additional image optimization pass is required, but each
  is verified against the existing bundle budget (`web/performance.md`)
  before merge.
- Images: explicit width/height (or aspect-ratio) on the scene wrapper to
  avoid CLS; hero scene layers preloaded, other five sections' layers
  lazy/deferred since they're below the fold.

## 7. Testing

- Unit: `useInView` hook (mocks `IntersectionObserver`) and `ParallaxScene`
  render logic (renders correct layer count from props, static markup when
  `prefers-reduced-motion` is mocked true) with Vitest + Testing Library —
  consistent with existing `*.test.jsx` pattern in `src/components`.
- Visual regression: Playwright screenshots per `web/testing.md` breakpoints
  (320/768/1024/1440) for at least Hero and one text-heavy section (About),
  both to confirm the dialog panel keeps text readable over the brightest
  scene.
- Accessibility: automated contrast check on the dialog panel + reduced
  motion behavior verified (toggle `prefers-reduced-motion` in Playwright).
- Manual: confirm smooth 60fps scroll/parallax in dev before calling this
  done, per the "test the feature in a browser" rule for frontend work.

## 8. Out of scope for this pass

- nature_7 / nature_8 scenes (reserved for future sections/navbar).
- Sound effects / chiptune audio.
- Mobile-specific alternate (lighter) scene variants — same assets are
  used at all breakpoints, just the dialog panel repositions responsively.
