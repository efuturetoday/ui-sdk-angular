// Writes the daisyUI theme's tokens/light.json and dark.json from daisyUI's
// light and dark themes, and a palette, palettes/<name>, from each other one.
// `--check` fails when any is out of date.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import prettier from "prettier"
import { formatHex, parse } from "culori"
import themes from "daisyui/theme/object.js"

const dir = path.resolve(import.meta.dirname, "../projects/themes/daisyui")
const check = process.argv.includes("--check")

const round = (n) => Math.round(n * 10000) / 10000
function color(value, alpha = 1) {
  const hex = formatHex(parse(value))
  const found = {
    colorSpace: "srgb",
    components: [1, 3, 5].map((i) =>
      round(parseInt(hex.slice(i, i + 2), 16) / 255)
    ),
  }
  if (alpha !== 1) {
    found.alpha = alpha
  }
  found.hex = hex
  return found
}

// Each token, as the daisyUI color it is, and the opacity daisyUI draws it
// with, like the 60% of a description's text.
const roles = {
  background: ["The page.", "base-100"],
  foreground: ["Text.", "base-content"],
  "surface-1": ["Controls, like a button or an input.", "base-100"],
  "surface-2": ["Popups, like a menu or a dialog.", "base-100"],
  "surface-3": ["A surface on a popup.", "base-200"],
  muted: ["A quiet surface, like a hovered item or a button.", "base-200"],
  "muted-foreground": [
    "Secondary text, like a description.",
    "base-content",
    0.6,
  ],
  primary: [
    "Fills that stand out, like a solid button or a checked checkbox.",
    "primary",
  ],
  "primary-foreground": [
    "Text and icons on the primary color.",
    "primary-content",
  ],
  ring: ["The focus ring.", "primary", 0.4],
  input: ["The border of a control.", "base-content", 0.2],
  border: ["Dividers and quiet borders.", "base-content", 0.1],
  "border-strong": [
    "The border of a button or a checkbox.",
    "base-content",
    0.15,
  ],
  "border-disabled": [
    "The border and text of a disabled control.",
    "base-content",
    0.4,
  ],
  destructive: ["Errors.", "error"],
  "destructive-muted": ["A surface behind an error.", "error", 0.12],
  overlay: ["Behind a modal dialog or drawer.", null, 0.4],
}

function colors(theme) {
  const found = { $type: "color" }
  for (const [token, [description, role, alpha]] of Object.entries(roles)) {
    found[token] = {
      $description: description,
      $value: color(role ? theme[`--color-${role}`] : "#000000", alpha),
    }
  }
  return found
}

const files = new Map()
async function write(file, json) {
  files.set(
    file,
    await prettier.format(JSON.stringify(json), {
      ...(await prettier.resolveConfig(file)),
      filepath: file,
    })
  )
}

// The theme's own colors, with its shadows', which a palette leaves as they are.
for (const mode of ["light", "dark"]) {
  await write(path.join(dir, `tokens/${mode}.json`), {
    $description: `The daisyUI theme's ${mode} colors, from daisyUI 5's ${mode} theme, by scripts/build-daisyui.mjs. Each mode has the same tokens.`,
    color: colors(themes[mode]),
    "shadow-color": {
      $type: "color",
      soft: {
        $description: "A soft shadow.",
        $value: color("#000000", 0.1),
      },
      deep: {
        $description: "A dialog's deep shadow.",
        $value: color("#000000", 0.25),
      },
    },
  })
}

// Every other daisyUI theme is one color scheme, light or dark.
for (const [name, theme] of Object.entries(themes)) {
  if (name === "light" || name === "dark") {
    continue
  }
  const mode = theme["color-scheme"]
  await write(path.join(dir, `palettes/${name}/${mode}.json`), {
    $description: `The daisyUI theme's ${name} palette, from daisyUI 5's ${name} theme, by scripts/build-daisyui.mjs. It's ${mode} only.`,
    color: colors(theme),
  })
}

const stale = []
for (const [file, content] of files) {
  if (check) {
    if (!existsSync(file) || readFileSync(file, "utf8") !== content) {
      stale.push(path.relative(process.cwd(), file))
    }
  } else {
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, content)
  }
}
if (stale.length) {
  console.error(
    `Out of date (${stale.join(", ")}): run node scripts/build-daisyui.mjs`
  )
  process.exitCode = 1
}
