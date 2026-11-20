// examples-and-fixtures: fails while an upstream example or spec fixture whose
// components we have lacks its Angular copy, and generates the demo's list of
// examples and stylesheet (`--write`). See contributing/examples.md.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { parseTemplate } from "@angular/compiler"

const root = path.resolve(import.meta.dirname, "..")
const vendor = path.join(root, "vendor/ui")
const lib = path.join(root, "projects/core")
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

const has = (entry) =>
  existsSync(path.join(lib, entry, `src/${entry}.ts`)) ||
  existsSync(path.join(lib, `src/lib/${entry}.ts`))
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
    const ours = `projects/docs/src/examples/${component}/${name}.ts`
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

// The order, titles and captions of each component's examples on ui-sdk.dev,
// from its Vue page. An example's title is the heading above it; the one at
// the top, above every heading, is the component's overview.
const docs = path.join(vendor, "apps/docs/content/docs/vue/components")
const shownOnSite = new Map()
for (const file of existsSync(docs) ? readdirSync(docs) : []) {
  const page = read(path.join(docs, file))
  for (const match of page.matchAll(
    /<ComponentExample\s+name="([\w/-]+)"\s+caption="([^"]*)"/g
  )) {
    const [, name, caption] = match
    const headings = [
      ...page
        .slice(0, match.index)
        .matchAll(/^#{2,3} (.+?)(?: \[#[\w-]+\])?$/gm),
    ]
    const title = headings.at(-1)?.[1] ?? "Overview"
    shownOnSite.set(name, { index: shownOnSite.size, caption, title })
  }
}
// An example the site doesn't show is titled by its name, like "Dirty Form".
const words = { rtl: "Right to Left", otp: "OTP", sr: "Screen Reader" }
const titleOf = (key) =>
  shownOnSite.get(key)?.title ??
  key
    .split("/")[1]
    .split("-")
    .map((word) => words[word] ?? word[0].toUpperCase() + word.slice(1))
    .join(" ")
const siteOrder = (a, b) =>
  (shownOnSite.get(a)?.index ?? Infinity) -
    (shownOnSite.get(b)?.index ?? Infinity) || a.localeCompare(b)

// The demo's generated files.
const ours = path.join(root, "projects/docs/src/examples")
const ported = dirs(ours).flatMap((component) =>
  readdirSync(path.join(ours, component))
    .filter((file) => file.endsWith(".ts"))
    .map((file) => `${component}/${file.replace(/\.ts$/, "")}`)
)
// A data-slot an example writes itself, like "stack", only hooks the theme's
// or the demo's styles, so a name they don't style is a typo nothing else
// would catch.
const styled = new Set()
const stylesheets = [
  path.join(root, "projects/themes/styles"),
  path.join(root, "projects/docs/src/demo"),
].flatMap((dir) =>
  readdirSync(dir)
    .filter((file) => file.endsWith(".css"))
    .map((file) => path.join(dir, file))
)
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
        `projects/docs/src/examples/${key}.ts data-slot="${slot}" isn't in the example styles`
      )
    }
  }
}

// Each component's composition, read from its first example's template by
// Angular's own parser: its parts as they nest, a structural part with its
// "*", and a part repeated by @for marked as such.
const selectors = new Set()
for (const file of readdirSync(lib, { recursive: true })) {
  if (String(file).endsWith(".ts") && !String(file).endsWith(".spec.ts")) {
    const source = read(path.join(lib, String(file)))
    for (const [, name] of source.matchAll(/\[(ui[A-Z]\w*)\]/g)) {
      selectors.add(name)
    }
  }
}
selectors.delete("uiText")
function compositionOf(key) {
  const source = read(path.join(ours, `${key}.ts`))
  const template = source.match(/template: `([\s\S]*?)`,\n/)?.[1]
  if (!template) {
    return []
  }
  const walk = (nodes, each) =>
    nodes.flatMap((node) => {
      const kind = node.constructor.name
      if (kind === "ForLoopBlock") {
        return walk(node.children, true)
      }
      if (
        kind.endsWith("Block") ||
        kind.endsWith("Branch") ||
        kind.endsWith("Group") ||
        kind.endsWith("Case")
      ) {
        const inner = [node.children, node.branches, node.cases, node.groups]
          .filter(Array.isArray)
          .flat()
        return walk(inner, each)
      }
      if (kind === "Template" && node.tagName) {
        // `*uiPart` on an element: the template holds that one element.
        const structural = node.templateAttrs
          .map((attr) => attr.name)
          .filter((name) => selectors.has(name))
          .map((name) => `*${name}`)
        const [element] = node.children
        const own = element ? ownParts(element) : []
        const children = walk(element?.children ?? [], false)
        const parts = [...structural, ...own]
        return parts.length
          ? [{ tag: node.tagName, parts, each, children }]
          : children
      }
      if (kind === "Element" || kind === "Component") {
        return partsOf(node, each)
      }
      return []
    })
  const ownParts = (node) => [
    ...new Set(
      [
        ...(node.attributes ?? []).map((attr) => attr.name),
        ...(node.inputs ?? []).map((input) => input.name),
      ].filter((name) => selectors.has(name))
    ),
  ]
  const partsOf = (node, each) => {
    const parts = ownParts(node)
    const children = walk(node.children ?? [], false)
    return parts.length ? [{ tag: node.name, parts, each, children }] : children
  }
  // The same part written twice side by side, like two close buttons, shows once.
  const once = (nodes) =>
    nodes
      .filter(
        (node, index) =>
          index === 0 ||
          `${node.tag} ${node.parts}` !==
            `${nodes[index - 1].tag} ${nodes[index - 1].parts}`
      )
      .map((node) => ({ ...node, children: once(node.children) }))
  return once(walk(parseTemplate(template, `${key}.html`, {}).nodes, false))
}
const compositions = {}
for (const key of ported.sort(siteOrder)) {
  const component = key.split("/")[0]
  compositions[component] ??= compositionOf(key)
}

const generated = {
  "projects/docs/src/examples/index.ts": [
    "// Generated by `node scripts/check-examples.mjs --write`.",
    'import type { Type } from "@angular/core"',
    "",
    "const examples: Record<",
    "  string,",
    "  {",
    "    title: string",
    "    logs: boolean",
    "    caption?: string",
    "    load: () => Promise<Type<unknown>>",
    "    source: () => Promise<string>",
    "  }",
    "> = {",
    ...ported
      .sort(siteOrder)
      .map(
        (key) =>
          `  "${key}": { title: ${JSON.stringify(titleOf(key))}, logs: ${/shared\/log"/.test(read(path.join(ours, `${key}.ts`)))}, caption: ${JSON.stringify(shownOnSite.get(key)?.caption)}, load: () => import("./${key}").then((m) => m.Example), source: () => import("./${key}", { with: { loader: "text" } }).then((m: unknown) => (m as { default: string }).default) },`
      ),
    "}",
    "",
    "export { examples }",
    "",
  ].join("\n"),
  "projects/docs/src/examples/composition.ts": [
    "// Generated by `node scripts/check-examples.mjs --write`.",
    "type Node = { tag: string; parts: string[]; each: boolean; children: Node[] }",
    "",
    `const compositions: Record<string, Node[]> = ${JSON.stringify(compositions)}`,
    "",
    "export { compositions, type Node }",
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
