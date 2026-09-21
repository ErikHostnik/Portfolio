import { test, expect } from '@playwright/test'

const breakpoints = [
  { name: '320', width: 320, height: 640 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
]

for (const bp of breakpoints) {
  test(`hero renders readable text over the parallax scene at ${bp.name}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: bp.width, height: bp.height })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page).toHaveScreenshot(`hero-${bp.name}.png`)
  })

  test(`about renders readable text over the parallax scene at ${bp.name}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: bp.width, height: bp.height })
    await page.goto('/#about')
    await page.locator('#about').evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'start' }))
    // Instant scroll removes scroll-animation timing variance, but About's own
    // Framer Motion whileInView entrance (4 children, staggerChildren 0.2 +
    // 0.7s duration each => ~1.3s worst case) still needs to finish before the
    // screenshot is taken, or the comparison window overlaps the reveal
    // animation and flakes under CPU load (mirrors the wait used for Hero's
    // entrance stagger in the reduced-motion test below).
    await page.waitForTimeout(1500)
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

test('parallax scene animates when the user has no motion preference', async ({ page }) => {
  await page.goto('/')
  const heroScene = page.locator('#hero [aria-hidden="true"]').first()
  await expect(heroScene).toBeVisible()
  await page.waitForTimeout(2000)
  const before = await heroScene.screenshot()
  await page.waitForTimeout(1000)
  const after = await heroScene.screenshot()
  expect(Buffer.compare(before, after)).not.toBe(0)
})
