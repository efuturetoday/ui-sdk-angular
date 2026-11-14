import {
  afterNextRender,
  computed,
  DestroyRef,
  Directive,
  effect,
  inject,
  InjectionToken,
  Injector,
  input,
  Renderer2,
  signal,
  TemplateRef,
  untracked,
  ViewContainerRef,
  type EmbeddedViewRef,
  type Signal,
} from "@angular/core"

/**
 * The item a list highlights, by its index among the items it shows. Lists
 * like `uiSelect` and `uiCombobox` provide it, so `*uiVirtualFor` inside
 * them scrolls the highlighted row into view.
 * @experimental
 */
const ListHighlight = new InjectionToken<Signal<number>>("list-highlight")

/**
 * A row's index among all, which an item inside `*uiVirtualFor` reads as its
 * own `index` for screen readers, since only some rows render.
 * @experimental
 */
const VirtualIndex = new InjectionToken<number>("virtual-index")

/**
 * The context of a `*uiVirtualFor` row: `let item`, and `let i = index`.
 * @experimental
 */
type VirtualForContext<Item> = { $implicit: Item; index: number }

/**
 * Like `@for` for a long list, rendering only the rows in view:
 * `<div *uiVirtualFor="let item of items; rowHeight: 32" uiSelectItem [value]="item.value">`.
 * Rows have a fixed `rowHeight`. The list it's in scrolls, or the nearest
 * element around it that does. The rows not rendered are room around the
 * ones that are, as margins on the first and last.
 * Inside a list that provides `ListHighlight`, it scrolls the highlighted row
 * into view, and its items take their `index` from it.
 * @experimental
 */
@Directive({ selector: "[uiVirtualFor][uiVirtualForOf]" })
class UiVirtualFor<Item> {
  /** Every item, of which only those in view render. */
  readonly items = input.required<readonly Item[]>({ alias: "uiVirtualForOf" })
  /** Each row's height, in pixels. */
  readonly rowHeight = input.required<number>({
    alias: "uiVirtualForRowHeight",
  })
  /** How many rows render beyond the edges of the view, for smooth scrolling. */
  readonly overscan = input(4, { alias: "uiVirtualForOverscan" })
  readonly #template = inject<TemplateRef<VirtualForContext<Item>>>(TemplateRef)
  readonly #container = inject(ViewContainerRef)
  readonly #injector = inject(Injector)
  readonly #renderer = inject(Renderer2)
  readonly #scrollTop = signal(0)
  readonly #viewHeight = signal(0)
  readonly #views = new Map<number, EmbeddedViewRef<VirtualForContext<Item>>>()
  #list: HTMLElement | undefined
  #spaced: HTMLElement[] = []
  #scroller: HTMLElement | undefined

  // The rows to render: those in view, and the overscan around them.
  readonly #range = computed(() => {
    const count = this.items().length
    const row = this.rowHeight()
    const top = this.#scrollTop()
    // Before it's measured, as many as fit a tall list.
    const height = this.#viewHeight() || row * 20
    return {
      start: Math.max(0, Math.floor(top / row) - this.overscan()),
      end: Math.min(count, Math.ceil((top + height) / row) + this.overscan()),
    }
  })

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => this.#attach(destroyRef))
    effect(() => {
      const items = this.items()
      const { start, end } = this.#range()
      untracked(() => this.#render(items, start, end))
    })
    // Only highlights from now on: one from before it was made, like the
    // last open's, isn't where a new list starts.
    const highlight = inject(ListHighlight, { optional: true })
    if (highlight) {
      const initial = untracked(highlight)
      let seen = false
      effect(() => {
        const index = highlight()
        if (!seen && index === initial) {
          return
        }
        seen = true
        untracked(() => this.scrollToIndex(index))
      })
    }
  }

  /** Scrolls the row at `index` into view, the least it takes. */
  scrollToIndex(index: number) {
    const scroller = this.#scroller
    if (!scroller || index < 0) {
      return
    }
    const row = this.rowHeight()
    const top = this.#offset() + index * row
    if (top < scroller.scrollTop) {
      scroller.scrollTop = top
    } else if (top + row > scroller.scrollTop + scroller.clientHeight) {
      scroller.scrollTop = top + row - scroller.clientHeight
    }
  }

  // The list is the element the rows are in; it scrolls, or the nearest
  // element around it that does.
  #attach(destroyRef: DestroyRef) {
    const anchor = this.#container.element.nativeElement as Node
    this.#list = anchor.parentElement ?? undefined
    let scroller = this.#list
    while (
      scroller &&
      !/auto|scroll/.test(getComputedStyle(scroller).overflowY)
    ) {
      scroller = scroller.parentElement ?? undefined
    }
    this.#scroller = scroller ?? this.#list
    const el = this.#scroller
    if (!el) {
      return
    }
    const measure = () => {
      this.#viewHeight.set(el.clientHeight)
      this.#scrollTop.set(Math.max(0, el.scrollTop - this.#offset()))
    }
    measure()
    const stop = this.#renderer.listen(el, "scroll", measure)
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    destroyRef.onDestroy(() => {
      stop()
      observer.disconnect()
    })
  }

  // Where the first row starts inside the scroller, which may hold more
  // than the list, like a search field above it.
  #offset() {
    const list = this.#list
    const scroller = this.#scroller
    if (!list || !scroller || list === scroller) {
      return 0
    }
    return (
      list.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop
    )
  }

  #render(items: readonly Item[], start: number, end: number) {
    for (const [index, view] of this.#views) {
      if (
        index < start ||
        index >= end ||
        view.context.$implicit !== items[index]
      ) {
        view.destroy()
        this.#views.delete(index)
      }
    }
    for (let index = start; index < end; index++) {
      if (this.#views.has(index)) {
        continue
      }
      const injector = Injector.create({
        providers: [{ provide: VirtualIndex, useValue: index }],
        parent: this.#injector,
      })
      const view = this.#container.createEmbeddedView(
        this.#template,
        { $implicit: items[index]!, index },
        { index: this.#placeOf(index), injector }
      )
      this.#views.set(index, view)
    }
    // The room for the rows not rendered goes on the first and last rows
    // that are, not on the list: padding can't shrink, so a list that scrolls
    // in a popup's flex column would grow to hold every row.
    const row = this.rowHeight()
    const first = this.#views.get(start)?.rootNodes[0] as
      HTMLElement | undefined
    const last = this.#views.get(end - 1)?.rootNodes[0] as
      HTMLElement | undefined
    for (const el of this.#spaced) {
      if (el !== first && el !== last) {
        this.#renderer.removeStyle(el, "margin-top")
        this.#renderer.removeStyle(el, "margin-bottom")
      }
    }
    this.#spaced = [first, last].filter((el): el is HTMLElement => !!el)
    if (first) {
      this.#renderer.setStyle(first, "margin-top", `${start * row}px`)
    }
    if (last) {
      this.#renderer.setStyle(
        last,
        "margin-bottom",
        `${(items.length - end) * row}px`
      )
    }
  }

  // Where a new row goes in the container, so rows stay in order.
  #placeOf(index: number) {
    let place = 0
    for (const other of this.#views.keys()) {
      if (other < index) {
        place++
      }
    }
    return place
  }

  static ngTemplateContextGuard<Item>(
    _directive: UiVirtualFor<Item>,
    _context: unknown
  ): _context is VirtualForContext<Item> {
    return true
  }
}

export { ListHighlight, UiVirtualFor, type VirtualForContext, VirtualIndex }
