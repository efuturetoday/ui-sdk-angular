import type { Page } from "@playwright/test"

// Opens a component's page of examples and waits until every example rendered.
async function openComponent(page: Page, component: string) {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(String(error)))
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text())
    }
  })
  await page.goto(`/?component=${component}`)
  await page.locator("app-example-frame").first().waitFor()
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("app-example-frame .preview")].every(
        (preview) => preview.children.length > 0
      ),
    undefined,
    { timeout: 30_000 }
  )
  return errors
}

// The example frame showing `name`, like "select/virtualized".
const example = (page: Page, name: string) =>
  page.locator(`[data-example="${name}"]`)

export { example, openComponent }
