import { expect, type Page, test } from "@playwright/test"
import { example, openComponent } from "./helpers"

// iOS makes a tap a click only where something up to the document handles
// clicks, and core dismisses a popup at the click of a tap outside it. Chromium
// clicks anywhere, so these run on WebKit as an iPhone.

// Taps the example's label above it, which is plain text outside the popup.
const tapOutside = (page: Page, name: string) =>
  page
    .locator("section.example", { has: example(page, name) })
    .locator("h3")
    .tap()

// Taps near the screen's end, past a drawer from the start, but clear of the
// edge, where a press starts the browser's back swipe.
const tapEdge = async (page: Page) => {
  const { width, height } = page.viewportSize()!
  await page.touchscreen.tap(width - 40, height / 2)
}

test("a tap outside a menu closes it", async ({ page }) => {
  await openComponent(page, "menu")
  await example(page, "menu/basic")
    .getByRole("button", { name: "Open Menu" })
    .tap()
  await expect(page.getByRole("menu")).toBeVisible()
  await tapOutside(page, "menu/basic")
  await expect(page.getByRole("menu")).toHaveCount(0)
})

test("a tap outside a popover closes it", async ({ page }) => {
  await openComponent(page, "popover")
  await example(page, "popover/arrow")
    .getByRole("button", { name: "Help" })
    .tap()
  const popup = page.getByRole("dialog")
  await expect(popup).toBeVisible()
  await tapOutside(page, "popover/arrow")
  await expect(popup).toHaveCount(0)
})

test("a tap on a drawer's backdrop closes it", async ({ page }) => {
  await openComponent(page, "drawer")
  await example(page, "drawer/sides")
    .getByRole("button", { name: "Left" })
    .tap()
  const drawer = page.getByRole("dialog")
  await expect(drawer).toBeVisible()
  await tapEdge(page)
  await expect(drawer).toHaveCount(0)
})

test("a tap on the page's drawer backdrop closes it", async ({ page }) => {
  await openComponent(page, "menu")
  await page.getByRole("button", { name: "Navigation" }).tap()
  const nav = page.getByRole("dialog", { name: "Navigation" })
  await expect(nav).toBeVisible()
  await tapEdge(page)
  await expect(nav).toHaveCount(0)
})
