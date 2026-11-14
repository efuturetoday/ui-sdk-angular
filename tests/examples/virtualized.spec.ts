import { expect, test, type Locator, type Page } from "@playwright/test"
import { example, openComponent } from "./helpers"

// The rows a virtualized list shows: only the ones scrolled into view render.
const rows = (page: Page) => page.getByRole("option", { name: /^Item \d+$/ })

const cases = [
  {
    name: "select/virtualized",
    open: (page: Page) =>
      example(page, "select/virtualized").getByRole("combobox"),
  },
  {
    name: "combobox/virtualized",
    open: (page: Page) =>
      example(page, "combobox/virtualized").getByRole("combobox"),
  },
]

// Scrolls the list by wheel on a desktop, by a swipe on a phone.
async function scrollList(page: Page, row: Locator, isMobile: boolean) {
  const box = (await row.boundingBox())!
  if (isMobile) {
    const cdp = await page.context().newCDPSession(page)
    await cdp.send("Input.synthesizeScrollGesture", {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
      yDistance: -1500,
      gestureSourceType: "touch",
    })
  } else {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.wheel(0, 1500)
  }
}

for (const { name, open } of cases) {
  test.describe(name, () => {
    test.beforeEach(async ({ page }) => {
      const component = name.split("/")[0]!
      await openComponent(page, component)
    })

    test("scrolling renders the rows scrolled into view", async ({
      page,
      isMobile,
    }) => {
      await open(page).click()
      await expect(rows(page).first()).toHaveText("Item 1")
      await scrollList(page, rows(page).nth(1), isMobile)
      await expect(
        page.getByRole("option", { name: "Item 1", exact: true })
      ).toHaveCount(0)
      // Rows above the scrolled-to place render too, out of view.
      await expect(rows(page).nth(6)).toBeInViewport()
    })

    test("opened again, it starts at the top with its first rows", async ({
      page,
      isMobile,
    }) => {
      await open(page).click()
      await scrollList(page, rows(page).nth(1), isMobile)
      await expect(
        page.getByRole("option", { name: "Item 1", exact: true })
      ).toHaveCount(0)
      await page.keyboard.press("Escape")
      await expect(rows(page)).toHaveCount(0)
      await open(page).click()
      await expect(rows(page).first()).toHaveText("Item 1")
      await expect(rows(page).first()).toBeInViewport()
    })
  })
}
