import { DOCUMENT, isPlatformServer } from "@angular/common"
import {
  afterNextRender,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  Renderer2,
  signal,
  untracked,
} from "@angular/core"
import { preferencesScript, type PreferenceLike } from "@ui-sdk/core"

/**
 * Shows preferences on `data-*` attributes, so CSS styles by them from the
 * first paint: global ones on `<html>`, the rest on its own element, which
 * has `display: contents`. On the server it renders one inline script as its
 * first child, which puts every saved value on its attribute as the page
 * loads, before hydration. Content that reads a preference, through
 * `injectPreference`, catches up after hydration.
 * @experimental
 */
@Directive({
  selector: "[uiPreferences]",
  exportAs: "uiPreferences",
  host: { "data-slot": "preferences", style: "display: contents" },
})
class UiPreferences {
  /** The preferences to show, from `createPreference` or `createColorScheme`. */
  readonly preferences = input.required<readonly PreferenceLike[]>({
    alias: "uiPreferences",
  })
  /** The nonce your Content Security Policy gives inline scripts. */
  readonly nonce = input<string>()
  readonly #el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly #renderer = inject(Renderer2)
  readonly #document = inject(DOCUMENT)
  readonly #server = isPlatformServer(inject(PLATFORM_ID))
  readonly #mounted = signal(false)

  constructor() {
    // Until the saved values load, the server's on the element, and on the
    // server a script that applies the saved ones before the page paints.
    let script: unknown
    effect(() => {
      const list = this.preferences()
      const nonce = this.nonce()
      untracked(() => {
        for (const preference of list) {
          if (!preference.global) {
            this.#renderer.setAttribute(
              this.#el,
              preference.attribute,
              preference.initialState.value
            )
          }
        }
        if (!this.#server) {
          return
        }
        if (script) {
          this.#renderer.removeChild(this.#el, script)
        }
        script = this.#renderer.createElement("script")
        this.#renderer.setAttribute(script, "data-preferences", "")
        if (nonce) {
          this.#renderer.setAttribute(script, "nonce", nonce)
        }
        this.#renderer.setProperty(
          script,
          "textContent",
          preferencesScript(list)
        )
        this.#renderer.insertBefore(this.#el, script, this.#el.firstChild)
      })
    })
    afterNextRender(() => {
      this.#el.querySelector(":scope > script[data-preferences]")?.remove()
      this.#mounted.set(true)
    })
    effect((onCleanup) => {
      const list = this.preferences()
      if (!this.#mounted()) {
        return
      }
      const read = () => {
        for (const preference of list) {
          const target = preference.global
            ? this.#document.documentElement
            : this.#el
          target.setAttribute(preference.attribute, preference.get().value)
        }
      }
      const stops = list.map((preference) => preference.subscribe(read))
      read()
      onCleanup(() => stops.forEach((each) => each()))
    })
  }
}

/**
 * A preference's state, like `{ value: "dark" }`, or a color scheme's, as a
 * signal. It's the server's until mounted, so the page hydrates without a
 * mismatch, and the saved value right after. Call it where Angular allows
 * `inject`, like a field initializer.
 * @experimental
 */
function injectPreference<State>(preference: {
  get: () => State
  initialState: State
  subscribe: (listener: () => void) => () => void
}) {
  const state = signal(preference.initialState)
  const destroyRef = inject(DestroyRef)
  afterNextRender(() => {
    // Subscribing first reads back what was saved.
    const stop = preference.subscribe(() => state.set(preference.get()))
    state.set(preference.get())
    destroyRef.onDestroy(stop)
  })
  return state.asReadonly()
}

export { injectPreference, UiPreferences }
