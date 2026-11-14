import { isPlatformBrowser } from "@angular/common"
import {
  afterNextRender,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  isDevMode,
  PLATFORM_ID,
  Renderer2,
  type WritableSignal,
} from "@angular/core"

// The elements uiText shows a part's text in, so a part that's left empty
// without it can say so in development.
const shown = new WeakSet<Element>()

// In development, warns once the page has rendered when the part's element
// is empty and has no uiText, which is easy to forget. Runs where the part's
// strategy is made, in the part's injection context.
function checkText() {
  if (!isDevMode() || !isPlatformBrowser(inject(PLATFORM_ID))) {
    return
  }
  const el = inject(ElementRef).nativeElement as Node
  if (!(el instanceof Element)) {
    return
  }
  afterNextRender(() => {
    if (!shown.has(el) && !el.hasChildNodes()) {
      const slot = el.getAttribute("data-slot") ?? el.localName
      console.warn(
        `The ${slot} part is empty. Add uiText to show its text, or write content of your own.`
      )
    }
  })
}

/**
 * A part whose text `uiText` shows, like a select's value or a meter's.
 * Implement it with `showText`, `showMarked` or a strategy of your own, and
 * provide it on the part directive with
 * `{ provide: TextSource, useExisting: YourPart }`.
 * @experimental
 */
abstract class TextSource {
  /**
   * Shows the part's text in `el`. It runs in `uiText`'s injection context,
   * so what it starts, like an effect, ends with `uiText`.
   */
  abstract attach(el: HTMLElement): void
}

/**
 * Shows the text of the part it's on, or of the part around it, like
 * `<span uiSelectValue uiText>` showing the selected label. Without it, the
 * element's content is yours, and nothing writes into it.
 * @experimental
 */
@Directive({ selector: "[uiText]" })
class UiText {
  constructor() {
    const el = inject(ElementRef).nativeElement as HTMLElement
    shown.add(el)
    inject(TextSource).attach(el)
  }
}

/**
 * A `TextSource` strategy that shows `text`, kept current.
 * @experimental
 */
function showText(text: () => string) {
  checkText()
  return (el: HTMLElement) => {
    const renderer = inject(Renderer2)
    effect(() => {
      const next = text()
      if (el.textContent !== next) {
        renderer.setProperty(el, "textContent", next)
      }
    })
  }
}

/**
 * A `TextSource` strategy that shows text in pieces, the ones a search
 * matched in `<mark>`, kept current.
 * @experimental
 */
function showMarked(
  segments: () => readonly { text: string; match: boolean }[]
) {
  checkText()
  return (el: HTMLElement) => {
    const renderer = inject(Renderer2)
    effect(() => {
      renderer.setProperty(el, "textContent", "")
      for (const { text, match } of segments()) {
        let node: unknown = renderer.createText(text)
        if (match) {
          const mark = renderer.createElement("mark")
          renderer.appendChild(mark, node)
          node = mark
        }
        renderer.appendChild(el, node)
      }
    })
  }
}

/**
 * A `TextSource` strategy for a part whose text core writes itself, like a
 * live status: `writes` is true while `uiText` asks for it.
 * @experimental
 */
function letCoreWrite(writes: WritableSignal<boolean>) {
  checkText()
  return () => {
    writes.set(true)
    inject(DestroyRef).onDestroy(() => writes.set(false))
  }
}

export { letCoreWrite, showMarked, showText, TextSource, UiText }
