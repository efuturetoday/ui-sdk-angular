import {
  effect,
  ElementRef,
  inject,
  Renderer2,
  signal,
  type Signal,
} from "@angular/core"

// An element's content has one owner, decided by the template: the library
// when it's written empty, the template when it has content of its own. Its
// children exist from `ngOnInit` on, before any is written, so `decide()` goes there.
function injectContentOwner() {
  const el = inject(ElementRef).nativeElement as HTMLElement
  const owned = signal(false)
  return {
    decide: () => owned.set(!el.hasChildNodes()),
    core: owned.asReadonly(),
  }
}

/**
 * Shows `text` in this directive's element while it's written empty, like a
 * chip's label, for parts whose text core doesn't write itself. Call
 * `decide()` from `ngOnInit`.
 * @experimental
 */
function injectDefaultText(text: () => string) {
  const el = inject(ElementRef).nativeElement as HTMLElement
  const renderer = inject(Renderer2)
  const owner = injectContentOwner()
  effect(() => {
    const next = text()
    if (owner.core() && el.textContent !== next) {
      renderer.setProperty(el, "textContent", next)
    }
  })
  return owner
}

/**
 * Shows `text` in the element a structural part renders while it's written
 * empty, like a toast's title. Its children exist once it's shown, before
 * any text is written, so that's when its owner is decided.
 * @experimental
 */
function injectShownText(
  element: Signal<HTMLElement | undefined>,
  text: () => string
) {
  const renderer = inject(Renderer2)
  const owned = new WeakMap<HTMLElement, boolean>()
  effect(() => {
    const el = element()
    const next = text()
    if (!el) {
      return
    }
    if (!owned.has(el)) {
      owned.set(el, !el.hasChildNodes())
    }
    if (owned.get(el) && el.textContent !== next) {
      renderer.setProperty(el, "textContent", next)
    }
  })
}

export { injectContentOwner, injectDefaultText, injectShownText }
