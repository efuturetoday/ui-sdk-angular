// The docs' theme stylesheets, `docs-<theme>.css`, one <link> each. A link
// stays once added, and `media` turns it on or off: that keeps its stylesheet
// parsed, where `disabled` would drop it and parse it again when turned on.

const on = "all"
const off = "not all"

let wanted = ""
let showWanted = () => {}

const links = () => [
  ...document.querySelectorAll<HTMLLinkElement>("link[data-theme-sheet]"),
]

// A theme's link, added off if it isn't there yet. The browser loads it in
// the background, and it shows itself once loaded if it's still wanted.
function linkOf(theme: string) {
  const found = links().find((link) => link.dataset["themeSheet"] === theme)
  if (found) {
    return found
  }
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = `docs-${theme}.css`
  link.media = off
  link.dataset["themeSheet"] = theme
  link.addEventListener("load", () => {
    if (wanted === theme) {
      turnOn(link)
    }
  })
  links().at(-1)!.after(link)
  return link
}

// Turns one link on and the others off, with what goes with the theme, in the
// same step, so the page changes once and always has a theme.
function turnOn(shown: HTMLLinkElement) {
  showWanted()
  for (const link of links()) {
    link.media = link === shown ? on : off
  }
}

/**
 * Shows a theme, and calls `show` to set what goes with it, like its palette,
 * once its stylesheet has loaded. Until then the page keeps the theme before.
 */
function showTheme(theme: string, show: () => void) {
  wanted = theme
  showWanted = show
  const link = linkOf(theme)
  // A link has its stylesheet once loaded, even while it's off.
  if (link.sheet) {
    turnOn(link)
  }
}

/** Loads the themes' stylesheets ahead, so showing one is at once. */
function loadThemes(themes: string[]) {
  themes.forEach(linkOf)
}

export { loadThemes, showTheme }
