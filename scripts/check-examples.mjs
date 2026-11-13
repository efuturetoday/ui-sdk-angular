// examples-and-fixtures: fails while an upstream example or spec fixture whose
// components we have lacks its Angular copy, and generates the demo's list of
// examples and stylesheet (`--write`). See contributing/examples.md.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const vendor = path.join(root, "vendor/ui")
const lib = path.join(root, "projects/ui-sdk-angular/src/lib")
const report = process.argv.includes("--report")
const write = process.argv.includes("--write")

const read = (file) => readFileSync(file, "utf8")
const dirs = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

// Which entry of @ui-sdk/vue exports each component, like Checkbox: "checkbox".
const entryOf = new Map()
const vueSource = path.join(vendor, "packages/vue/src")
for (const file of readdirSync(vueSource).filter((f) => f.endsWith(".ts"))) {
  for (const [, names] of read(path.join(vueSource, file)).matchAll(
    /^export \{([^}]*)\}(?! from)/gm
  )) {
    for (const name of names.split(",").map((n) => n.trim())) {
      if (/^[A-Z]/.test(name)) {
        entryOf.set(name, file.replace(/\.ts$/, ""))
      }
    }
  }
}

// The @ui-sdk/vue entries a Vue file imports.
function entriesIn(source) {
  const entries = new Set()
  for (const [, entry] of source.matchAll(/from "@ui-sdk\/vue\/([\w-]+)"/g)) {
    entries.add(entry)
  }
  for (const [, names] of source.matchAll(
    /import\s*\{([^}]*)\}\s*from "@ui-sdk\/vue"/g
  )) {
    for (const name of names.split(",").map((n) => n.trim())) {
      const entry = entryOf.get(name.replace(/^type\s+/, ""))
      if (entry && !name.startsWith("type ")) {
        entries.add(entry)
      }
    }
  }
  return entries
}

const has = (entry) => existsSync(path.join(lib, `${entry}.ts`))
const missingOf = (source) => [...entriesIn(source)].filter((e) => !has(e))

const errors = []
const blocked = []

// Examples.
const examples = path.join(vendor, "examples/components")
for (const component of dirs(examples)) {
  const vue = path.join(examples, component, "vue")
  if (!existsSync(vue)) {
    continue
  }
  for (const file of readdirSync(vue).filter((f) => f.endsWith(".vue"))) {
    const name = file.replace(/\.vue$/, "")
    const ours = `projects/demo/src/examples/${component}/${name}.ts`
    if (existsSync(path.join(root, ours))) {
      continue
    }
    const missing = missingOf(read(path.join(vue, file)))
    if (missing.length) {
      blocked.push(
        `example ${component}/${name}: waits on ${missing.join(", ")}`
      )
    } else {
      errors.push(
        `${ours} missing: port examples/components/${component}/vue/${file}`
      )
    }
  }
}

// Fixtures the specs we run open, as playwright.upstream.config.ts picks them.
const specRoot = path.join(vendor, "tests/specs")
const opened = new Set()
for (const file of readdirSync(specRoot)) {
  if (
    !file.endsWith(".spec.ts") ||
    /\.(kitchen-sink|counts|ssr)\.spec\.ts$/.test(file)
  ) {
    continue
  }
  for (const [, fixture] of read(path.join(specRoot, file)).matchAll(
    /\bopen\(\s*"([\w-]+)"/g
  )) {
    opened.add(fixture)
  }
}
const fixtures = path.join(vendor, "apps/playground/src/fixtures")
for (const fixture of [...opened].sort()) {
  const dir = path.join(fixtures, fixture)
  const vueFiles = existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith(".vue") || f === "vue.ts")
    : []
  if (!vueFiles.length) {
    continue
  }
  const ours = `projects/playground/src/fixtures/${fixture}.ts`
  if (existsSync(path.join(root, ours))) {
    continue
  }
  const missing = [
    ...new Set(vueFiles.flatMap((f) => missingOf(read(path.join(dir, f))))),
  ]
  if (missing.length) {
    blocked.push(`fixture ${fixture}: waits on ${missing.join(", ")}`)
  } else {
    errors.push(`${ours} missing: port apps/playground/src/fixtures/${fixture}`)
  }
}

// The order and captions of each component's examples on ui-sdk.dev, from its Vue page.
const docs = path.join(vendor, "apps/docs/content/docs/vue/components")
const shownOnSite = new Map()
for (const file of existsSync(docs) ? readdirSync(docs) : []) {
  for (const [, name, caption] of read(path.join(docs, file)).matchAll(
    /<ComponentExample\s+name="([\w/-]+)"\s+caption="([^"]*)"/g
  )) {
    shownOnSite.set(name, { index: shownOnSite.size, caption })
  }
}
const siteOrder = (a, b) =>
  (shownOnSite.get(a)?.index ?? Infinity) -
    (shownOnSite.get(b)?.index ?? Infinity) || a.localeCompare(b)

// The demo's generated files.
const ours = path.join(root, "projects/demo/src/examples")
const ported = dirs(ours).flatMap((component) =>
  readdirSync(path.join(ours, component))
    .filter((file) => file.endsWith(".ts"))
    .map((file) => `${component}/${file.replace(/\.ts$/, "")}`)
)
// A data-slot an example writes itself, like "stack", only hooks the example
// styles, so a name they don't style is a typo nothing else would catch.
const styled = new Set()
const stylesheets = [
  ...readdirSync(path.join(vendor, "examples/styles")).map((file) =>
    path.join(vendor, "examples/styles", file)
  ),
  ...dirs(examples).map((c) => path.join(examples, c, `${c}.css`)),
].filter((file) => file.endsWith(".css") && existsSync(file))
for (const file of stylesheets) {
  for (const [, slot] of read(file).matchAll(/data-slot[~|^$*]?="?([\w-]+)/g)) {
    styled.add(slot)
  }
}
for (const key of ported) {
  const source = read(path.join(ours, `${key}.ts`))
  for (const [, slot] of source.matchAll(/(?<![.\w[])data-slot="([^"]+)"/g)) {
    if (!styled.has(slot)) {
      errors.push(
        `projects/demo/src/examples/${key}.ts data-slot="${slot}" isn't in the example styles`
      )
    }
  }
}

const generated = {
  "projects/demo/src/examples/index.ts": [
    "// Generated by `node scripts/check-examples.mjs --write`.",
    'import type { Type } from "@angular/core"',
    "",
    "const examples: Record<",
    "  string,",
    "  {",
    "    caption?: string",
    "    load: () => Promise<Type<unknown>>",
    "    source: () => Promise<string>",
    "  }",
    "> = {",
    ...ported
      .sort(siteOrder)
      .map(
        (key) =>
          `  "${key}": { caption: ${JSON.stringify(shownOnSite.get(key)?.caption)}, load: () => import("./${key}").then((m) => m.Example), source: () => import("./${key}", { with: { loader: "text" } }).then((m: unknown) => (m as { default: string }).default) },`
      ),
    "}",
    "",
    "export { examples }",
    "",
  ].join("\n"),
  "projects/demo/src/examples.css": [
    "/* Generated by `node scripts/check-examples.mjs --write`. */",
    '@import "../../../vendor/ui/examples/styles/tokens.css";',
    '@import "../../../vendor/ui/examples/styles/base.css";',
    ...dirs(examples)
      .filter((c) => existsSync(path.join(examples, c, `${c}.css`)))
      .map(
        (c) => `@import "../../../vendor/ui/examples/components/${c}/${c}.css";`
      ),
    "",
  ].join("\n"),
}
for (const [file, content] of Object.entries(generated)) {
  const full = path.join(root, file)
  if (write) {
    writeFileSync(full, content)
  } else if (!existsSync(full) || read(full) !== content) {
    errors.push(
      `${file} is out of date: run node scripts/check-examples.mjs --write`
    )
  }
}

if (report) {
  console.log(blocked.sort().join("\n"))
  console.log(`\n${blocked.length} waiting, ${errors.length} ready to port`)
}
if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
