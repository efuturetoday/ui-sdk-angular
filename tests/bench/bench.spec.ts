import { expect, test, type Browser, type Page } from "@playwright/test"

// What a theme's selectors cost: the style recalculation per jump of a virtual
// table, against the same table without a theme. A rule with no tag, class or
// attribute on its subject is tried on every element, which this catches.
const themes = ["default", "shadcn", "material", "daisyui"]
const jumps = 100
const limit = 3

// The same jumps every run, so runs compare.
const positions = Array.from(
  { length: jumps },
  (_, i) => ((i * 7919) % 997) / 997
)

async function open(page: Page, theme: string) {
  await page.setViewportSize({ width: 1400, height: 860 })
  await page.goto(`/?bench&theme=${theme}`)
  await page.locator(".tr").first().waitFor()
}

async function scroll(page: Page, count: number) {
  await page.evaluate(
    async (positions) => {
      const viewport = document.querySelector(".viewport")!
      const max = viewport.scrollHeight - viewport.clientHeight
      for (const position of positions) {
        viewport.scrollTop = position * max
        await new Promise((done) =>
          requestAnimationFrame(() => requestAnimationFrame(done))
        )
      }
    },
    positions.slice(0, count)
  )
}

type Event = { name: string; ph: string; dur?: number; args?: any }

async function trace(
  browser: Browser,
  page: Page,
  categories: string[],
  count = jumps
) {
  if (count === jumps) {
    await scroll(page, count)
  }
  await browser.startTracing(page, { categories })
  await scroll(page, count)
  const { traceEvents } = JSON.parse((await browser.stopTracing()).toString())
  return traceEvents as Event[]
}

// Milliseconds of style recalculation per jump.
async function styleCost(browser: Browser, page: Page) {
  const events = await trace(browser, page, ["devtools.timeline"])
  const total = events
    .filter((e) => e.ph === "X" && e.name === "UpdateLayoutTree")
    .reduce((sum, e) => sum + e.dur!, 0)
  return total / 1000 / jumps
}

// The five selectors that took longest to match, for the report.
async function slowest(browser: Browser, page: Page) {
  const events = await trace(
    browser,
    page,
    [
      "devtools.timeline",
      "disabled-by-default-devtools.timeline.invalidationTracking",
      "disabled-by-default-blink.debug",
      "disabled-by-default-devtools.timeline.selector-stats",
    ],
    5
  )
  const found = new Map<
    string,
    { time: number; attempts: number; matches: number }
  >()
  for (const event of events) {
    for (const timing of event.args?.selector_stats?.selector_timings ?? []) {
      const entry = found.get(timing.selector) ?? {
        time: 0,
        attempts: 0,
        matches: 0,
      }
      entry.time += timing["elapsed (us)"]
      entry.attempts += timing.match_attempts
      entry.matches += timing.match_count
      found.set(timing.selector, entry)
    }
  }
  return [...found]
    .sort((a, b) => b[1].time - a[1].time)
    .slice(0, 5)
    .map(
      ([selector, { time, attempts, matches }]) =>
        `${(time / 1000).toFixed(1)} ms, ${attempts} tries, ${matches} matches: ${selector.slice(0, 140)}`
    )
}

test("a theme's selectors cost at most 3 times a table's own style", async ({
  browser,
  page,
}) => {
  test.setTimeout(180_000)
  await open(page, "none")
  const base = await styleCost(browser, page)
  const report: string[] = [`none: ${base.toFixed(2)} ms per jump`]
  const over: string[] = []
  for (const theme of themes) {
    await open(page, theme)
    const cost = await styleCost(browser, page)
    report.push(
      `${theme}: ${cost.toFixed(2)} ms per jump, ${(cost / base).toFixed(1)}×`,
      ...(await slowest(browser, page)).map((line) => `  ${line}`)
    )
    if (cost > base * limit) {
      over.push(theme)
    }
  }
  test
    .info()
    .annotations.push({ type: "style cost", description: report.join("\n") })
  console.log(report.join("\n"))
  expect(over, report.join("\n")).toEqual([])
})
