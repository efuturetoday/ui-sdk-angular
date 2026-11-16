// Writes the Material theme's tokens/light.json and dark.json from seed.json's
// seed, and a palette, palettes/<name>, from each of its palettes, with
// Material's own color utilities. `--check` fails when any is out of date.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import prettier from "prettier"
import {
  argbFromHex,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  SchemeTonalSpot,
} from "@material/material-color-utilities"

const dir = path.resolve(import.meta.dirname, "../projects/themes/material")
const check = process.argv.includes("--check")
const { seed, palettes } = JSON.parse(
  readFileSync(path.join(dir, "seed.json"), "utf8")
)

const round = (n) => Math.round(n * 10000) / 10000
function color(hex, alpha = 1) {
  const value = {
    colorSpace: "srgb",
    components: [1, 3, 5].map((i) =>
      round(parseInt(hex.slice(i, i + 2), 16) / 255)
    ),
  }
  if (alpha !== 1) {
    value.alpha = alpha
  }
  value.hex = hex
  return value
}

// Each token, as the Material role it is, and the opacity Material draws it
// with, like the 8% of a hover's state layer.
const roles = {
  background: ["The page.", "surface"],
  foreground: ["Text.", "onSurface"],
  "surface-1": ["Controls, like a button or an input.", "surface"],
  "surface-2": ["Popups, like a menu or a dialog.", "surfaceContainer"],
  "surface-3": ["A surface on a popup.", "surfaceContainerHigh"],
  muted: ["A quiet surface, like a hovered item.", "onSurface", 0.08],
  "muted-foreground": [
    "Secondary text, like a description.",
    "onSurfaceVariant",
  ],
  primary: ["Fills that stand out, like a checked checkbox.", "primary"],
  "primary-foreground": ["Text and icons on the primary color.", "onPrimary"],
  ring: ["The focus ring.", "primary", 0.4],
  input: ["The border of a control.", "outline"],
  border: ["Dividers and quiet borders.", "outlineVariant"],
  "border-strong": ["The border of a button or a checkbox.", "outline"],
  "border-disabled": [
    "The border and text of a disabled control.",
    "onSurface",
    0.38,
  ],
  destructive: ["Errors.", "error"],
  "destructive-muted": ["A surface behind an error.", "errorContainer"],
  overlay: ["Behind a modal dialog or drawer.", "scrim", 0.32],
  field: ["The fill of a text field.", "surfaceContainerHighest"],
}

// Material's elevation draws two shadows, a key and an ambient one.
const shadows = {
  key: ["The key shadow of a raised surface.", 0.3],
  ambient: ["The ambient shadow of a raised surface.", 0.15],
  none: ["No shadow.", 0],
}

// A seed's colors in one mode, as Material's tonal spot scheme.
function colorsOf(seed, mode) {
  const scheme = new SchemeTonalSpot(
    Hct.fromInt(argbFromHex(seed)),
    mode === "dark",
    0
  )
  const colors = { $type: "color" }
  for (const [token, [description, role, alpha]] of Object.entries(roles)) {
    colors[token] = {
      $description: description,
      $value: color(
        hexFromArgb(MaterialDynamicColors[role].getArgb(scheme)),
        alpha
      ),
    }
  }
  return colors
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

for (const mode of ["light", "dark"]) {
  const shadowColors = { $type: "color" }
  for (const [token, [description, alpha]] of Object.entries(shadows)) {
    shadowColors[token] = {
      $description: description,
      $value: color("#000000", alpha),
    }
  }
  await write(path.join(dir, `tokens/${mode}.json`), {
    $description: `The Material theme's ${mode} colors, made from ${seed} by scripts/build-material.mjs. Each mode has the same tokens.`,
    color: colorsOf(seed, mode),
    "shadow-color": shadowColors,
  })
  for (const [name, from] of Object.entries(palettes)) {
    await write(path.join(dir, `palettes/${name}/${mode}.json`), {
      $description: `The Material theme's ${name} palette in ${mode}, made from ${from} by scripts/build-material.mjs.`,
      color: colorsOf(from, mode),
    })
  }
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
    `Out of date (${stale.join(", ")}): run node scripts/build-material.mjs`
  )
  process.exitCode = 1
}
