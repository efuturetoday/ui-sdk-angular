import { isPlatformBrowser } from "@angular/common"
import {
  afterNextRender,
  computed,
  effect,
  inject,
  PLATFORM_ID,
  signal,
} from "@angular/core"
import { initialApple, isApple } from "@ui-sdk/core/renderer"
import {
  ariaKeyshortcuts,
  formatShortcut,
  shortcuts,
  type ShortcutHandler,
  type ShortcutOptions,
} from "@ui-sdk/core/shortcuts"

/**
 * Options for `injectShortcut`. `layer` takes a function, so it can read a
 * `viewChild` that's there only once the view has rendered.
 * @experimental
 */
type InjectShortcutOptions = Omit<ShortcutOptions, "layer"> & {
  /** An element inside a popup, or a function that gives one. The shortcut belongs to that popup. */
  layer?: Element | null | (() => Element | null | undefined)
}

/**
 * Registers a keyboard shortcut for the life of the component, in the shared
 * `shortcuts`. Keys and options are functions, like signals, and it registers
 * again when they change; nothing registers for `null`. Call it in an
 * injection context.
 * @experimental
 */
function injectShortcut(
  keys: () => string | null | undefined,
  handler: ShortcutHandler,
  options: () => InjectShortcutOptions = () => ({})
) {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return
  }
  effect((onCleanup) => {
    const current = keys()
    if (!current) {
      return
    }
    const { layer, ...rest } = options()
    onCleanup(
      shortcuts.register(current, handler, {
        ...rest,
        layer:
          layer === undefined
            ? undefined
            : () => (typeof layer === "function" ? layer() : layer),
      })
    )
  })
}

/**
 * Keys formatted for this platform, like `⌘S` on Apple platforms and
 * `Ctrl+S` elsewhere, with the matching `aria-keyshortcuts`. The server and
 * the first client render agree, and they update after it.
 * @experimental
 */
function injectShortcutHint(keys: () => string) {
  const apple = signal(initialApple())
  afterNextRender(() => apple.set(isApple()))
  return {
    text: computed(() => formatShortcut(keys(), apple())),
    ariaKeyshortcuts: computed(() => ariaKeyshortcuts(keys(), apple())),
  }
}

export {
  ariaKeyshortcuts,
  formatShortcut,
  matchesShortcut,
  registerShortcut,
  shortcuts,
} from "@ui-sdk/core/shortcuts"
export type {
  ShortcutHandler,
  ShortcutInfo,
  ShortcutKeys,
  ShortcutOptions,
  Shortcuts,
} from "@ui-sdk/core/shortcuts"

export { type InjectShortcutOptions, injectShortcut, injectShortcutHint }
