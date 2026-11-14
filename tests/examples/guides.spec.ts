import { expect, test } from "@playwright/test"

// Every guide renders without errors, with its sections in the section nav,
// and its live examples work.
const slugs = [
  "introduction",
  "installation",
  "first-component",
  "parts-and-composition",
  "state-and-events",
  "forms",
  "popups",
  "lists",
  "styling",
  "wrap-parts",
  "custom-parts",
]

for (const slug of slugs) {
  test(`${slug}: renders without errors`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(String(error)))
    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text())
      }
    })
    await page.goto(`/?doc=${slug}`)
    const sections = page.locator("main section[data-title]")
    await expect(sections.first()).toBeVisible()
    expect(errors).toEqual([])
  })
}

test("the first component's toggle turns on and off", async ({ page }) => {
  await page.goto("/?doc=first-component")
  const bookmark = page.getByRole("button", { name: "Bookmark" })
  await bookmark.click()
  await expect(bookmark).toHaveAttribute("aria-pressed", "true")
  await bookmark.click()
  await expect(bookmark).toHaveAttribute("aria-pressed", "false")
})

test("the custom rating rates by press and by arrow keys", async ({ page }) => {
  await page.goto("/?doc=custom-parts")
  const output = page.locator("app-rating-example output")
  await page.getByRole("radio", { name: "5 stars" }).click()
  await expect(output).toHaveText("5 of 5")
  await page.keyboard.press("ArrowLeft")
  await expect(output).toHaveText("4 of 5")
  await expect(page.getByRole("radio", { name: "4 stars" })).toBeFocused()
})

test("a link to another page shows it without loading the app again", async ({
  page,
}) => {
  await page.goto("/?doc=introduction")
  await page.evaluate(() => ((window as { marker?: boolean }).marker = true))
  await page
    .getByRole("link", { name: /^Installation/ })
    .first()
    .click()
  await expect(page.locator("main > h2")).toHaveText("Installation")
  expect(
    await page.evaluate(() => (window as { marker?: boolean }).marker)
  ).toBe(true)
})
