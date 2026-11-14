import { computed, Directive, inject, input, type OnInit } from "@angular/core"
import {
  scrollArea,
  type ScrollAreaController,
  type ScrollAreaPrimitive,
  type ScrollAreaType,
} from "@ui-sdk/core/scroll-area"
import {
  optionalBoolean,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "@ngx-ui-sdk/core"

/**
 * A scrollable region with scrollbars you style. Put its viewport and
 * scrollbars inside.
 * @experimental
 */
@Directive({
  selector: "[uiScrollArea]",
  exportAs: "uiScrollArea",
  providers: [provideRoot(scrollArea, () => UiScrollArea)],
})
class UiScrollArea implements OnInit {
  /** When the scrollbars show: `"hover"`, `"scroll"`, `"auto"` or `"always"`. */
  readonly type = input<ScrollAreaType>()
  /** How long the scrollbars stay after scrolling or hovering stops, in milliseconds. */
  readonly scrollHideDelay = input<number>()
  /** Keeps the view at the end while content is added, like a chat, until the user scrolls away. */
  readonly stickToEnd = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Scrolls the area from anywhere. Create one with `createScrollAreaController()`. */
  readonly controller = input<ScrollAreaController>()
  readonly handle: PrimitiveHandle<ScrollAreaPrimitive> = injectPrimitive(
    scrollArea,
    () => ({
      type: this.type(),
      scrollHideDelay: this.scrollHideDelay(),
      stickToEnd: this.stickToEnd(),
      controller: this.controller(),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The area's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The element that scrolls. Give it a `role` and a name when nothing inside
 * it can take focus.
 * @experimental
 */
@Directive({
  selector: "[uiScrollAreaViewport]",
  exportAs: "uiScrollAreaViewport",
})
class UiScrollAreaViewport implements OnInit {
  readonly #part = injectPart(injectHandle(scrollArea), "viewport")
  /** The viewport's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Wraps the content inside the viewport, so the area can follow its size.
 * @experimental
 */
@Directive({
  selector: "[uiScrollAreaContent]",
  exportAs: "uiScrollAreaContent",
})
class UiScrollAreaContent implements OnInit {
  readonly #part = injectPart(injectHandle(scrollArea), "content")
  /** The content's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A scrollbar for one axis. Put its thumb inside.
 * @experimental
 */
@Directive({
  selector: "[uiScrollAreaScrollbar]",
  exportAs: "uiScrollAreaScrollbar",
})
class UiScrollAreaScrollbar implements OnInit {
  /** The axis the scrollbar scrolls. */
  readonly orientation = input<"vertical" | "horizontal">("vertical")
  readonly #part = injectPart(
    injectHandle(scrollArea),
    "scrollbar",
    computed(() => ({
      id: this.orientation(),
      orientation: this.orientation(),
    }))
  )
  /** The scrollbar's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The draggable thumb of the scrollbar it's inside.
 * @experimental
 */
@Directive({
  selector: "[uiScrollAreaThumb]",
  exportAs: "uiScrollAreaThumb",
})
class UiScrollAreaThumb implements OnInit {
  readonly #scrollbar = inject(UiScrollAreaScrollbar)
  readonly #part = injectPart(
    injectHandle(scrollArea),
    "thumb",
    computed(() => ({
      id: this.#scrollbar.orientation(),
      orientation: this.#scrollbar.orientation(),
    }))
  )
  /** The thumb's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The square where two scrollbars meet.
 * @experimental
 */
@Directive({
  selector: "[uiScrollAreaCorner]",
  exportAs: "uiScrollAreaCorner",
})
class UiScrollAreaCorner implements OnInit {
  readonly #part = injectPart(injectHandle(scrollArea), "corner")
  /** The corner's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A button that scrolls to the end, which shows while the view is away from it.
 * @experimental
 */
@Directive({
  selector: "[uiScrollAreaScrollToEnd]",
  exportAs: "uiScrollAreaScrollToEnd",
})
class UiScrollAreaScrollToEnd implements OnInit {
  readonly #part = injectPart(injectHandle(scrollArea), "scroll-to-end")
  /** The button's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createScrollAreaController } from "@ui-sdk/core/scroll-area"
export type {
  ScrollAreaController,
  ScrollAreaOptions,
  ScrollAreaPrimitive,
  ScrollAreaScrollOptions,
  ScrollAreaScrollToEndState,
  ScrollAreaScrollbarProps,
  ScrollAreaScrollbarState,
  ScrollAreaState,
  ScrollAreaThumbState,
  ScrollAreaType,
} from "@ui-sdk/core/scroll-area"

export {
  UiScrollArea,
  UiScrollAreaContent,
  UiScrollAreaCorner,
  UiScrollAreaScrollbar,
  UiScrollAreaScrollToEnd,
  UiScrollAreaThumb,
  UiScrollAreaViewport,
}
