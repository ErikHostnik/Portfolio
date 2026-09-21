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
  const before = await heroScene.screenshot()
  await page.waitForTimeout(500)
  const after = await heroScene.screenshot()
  expect(Buffer.compare(before, after)).toBe(0)
})
