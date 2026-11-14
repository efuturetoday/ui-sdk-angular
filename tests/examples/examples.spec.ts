import { readdirSync } from "node:fs"
import { expect, test } from "@playwright/test"
import { openComponent } from "./helpers"

const components = readdirSync("projects/docs/src/examples", {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

for (const component of components) {
  test(`${component}: every example renders without errors`, async ({
    page,
  }) => {
    const errors = await openComponent(page, component)
    expect(errors).toEqual([])
  })
}
