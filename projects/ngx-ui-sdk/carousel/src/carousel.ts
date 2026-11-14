import {
  computed,
  Directive,
  inject,
  input,
  output,
  type OnInit,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  carousel,
  type CarouselAlign,
  type CarouselController,
  type CarouselOrientation,
  type CarouselPageChangeReason,
  type CarouselPlayingChangeReason,
  type CarouselPrimitive,
  type CarouselSlidesPerPage,
} from "@ui-sdk/core/carousel"
import {
  optionalBoolean,
  injectConnectedPart,
  injectPart,
  injectTargetPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵtokenOf as tokenOf,
  ɵUiIds as UiIds,
} from "ngx-ui-sdk"

/**
 * Why the page changes.
 * @experimental
 */
type CarouselPageChangeDetails = ChangeDetails<CarouselPageChangeReason>

/**
 * Why autoplay starts or stops.
 * @experimental
 */
type CarouselPlayingChangeDetails = ChangeDetails<CarouselPlayingChangeReason>

/**
 * A row of slides that scrolls a page at a time, on the element it's written on.
 * @experimental
 */
@Directive({
  selector: "[uiCarousel]",
  exportAs: "uiCarousel",
  providers: [provideRoot(carousel, () => UiCarousel)],
})
class UiCarousel implements OnInit {
  /** The current page, from 1. Bind it, or `[(page)]`, to control it. */
  readonly page = input<number>()
  /** The page at first, when uncontrolled. */
  readonly defaultPage = input<number>()
  /** Whether it plays on its own. Bind it, or `[(playing)]`, to control it. */
  readonly playing = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether it plays at first, when uncontrolled. */
  readonly defaultPlaying = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** How long a page shows while playing, in milliseconds. */
  readonly interval = input<number>()
  /** Which way the slides run. */
  readonly orientation = input<CarouselOrientation>()
  /** Where a page's first slide lines up in the viewport. */
  readonly align = input<CarouselAlign>()
  /** How many slides a page holds, or `"auto"` to fit them. */
  readonly slidesPerPage = input<CarouselSlidesPerPage>()
  /** Whether the last page leads back to the first. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a fast swipe may pass several pages. */
  readonly skipSnaps = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a swipe glides to rest anywhere instead of snapping to a page. */
  readonly dragFree = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a pointer can drag the slides. */
  readonly drag = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Pages and plays it from anywhere, and connects controls outside it. Create one with `createCarouselController()`. */
  readonly controller = input<CarouselController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new page once a change isn't canceled, for `[(page)]`. */
  readonly pageChange = output<number>()
  /** Emits before the page changes. `details.cancel()` stops it. */
  readonly beforePageChange = output<{
    page: number
    details: CarouselPageChangeDetails
  }>()
  /** Emits once the slides have come to rest on a page. */
  readonly pageChangeComplete = output<number>()
  /** Emits once autoplay starts or stops, for `[(playing)]`. */
  readonly playingChange = output<boolean>()
  /** Emits before autoplay starts or stops. `details.cancel()` stops it. */
  readonly beforePlayingChange = output<{
    playing: boolean
    details: CarouselPlayingChangeDetails
  }>()
  readonly handle: PrimitiveHandle<CarouselPrimitive> = injectPrimitive(
    carousel,
    () => ({
      page: this.page(),
      defaultPage: this.defaultPage(),
      playing: this.playing(),
      defaultPlaying: this.defaultPlaying(),
      interval: this.interval(),
      orientation: this.orientation(),
      align: this.align(),
      slidesPerPage: this.slidesPerPage(),
      loop: this.loop(),
      skipSnaps: this.skipSnaps(),
      dragFree: this.dragFree(),
      drag: this.drag(),
      controller: this.controller(),
      debug: this.debug(),
      onPageChange: (page: number, details: CarouselPageChangeDetails) => {
        this.beforePageChange.emit({ page, details })
        if (!details.canceled) {
          this.pageChange.emit(page)
        }
      },
      onPageChangeComplete: (page: number) =>
        this.pageChangeComplete.emit(page),
      onPlayingChange: (
        playing: boolean,
        details: CarouselPlayingChangeDetails
      ) => {
        this.beforePlayingChange.emit({ playing, details })
        if (!details.canceled) {
          this.playingChange.emit(playing)
        }
      },
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The carousel's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The window the slides scroll in.
 * @experimental
 */
@Directive({ selector: "[uiCarouselViewport]", exportAs: "uiCarouselViewport" })
class UiCarouselViewport implements OnInit {
  readonly #part = injectPart(injectHandle(carousel), "viewport")
  /** The viewport's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The row of slides, inside the viewport.
 * @experimental
 */
@Directive({ selector: "[uiCarouselContent]", exportAs: "uiCarouselContent" })
class UiCarouselContent implements OnInit {
  readonly #part = injectPart(injectHandle(carousel), "content")
  /** The content's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * One slide.
 * @experimental
 */
@Directive({ selector: "[uiCarouselItem]", exportAs: "uiCarouselItem" })
class UiCarouselItem implements OnInit {
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(carousel), "item", () => ({
    id: this.#id,
  }))
  /** The slide's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

// A control that pages or plays the carousel it's in, or the one its
// `controller` connects from anywhere.
function injectControl<
  S extends "previous" | "next" | "indicator-group" | "play-toggle",
>(
  slot: S,
  controller: () => CarouselController | undefined,
  unconnected: Record<string, unknown>,
  button: boolean
) {
  return injectConnectedPart(carousel, controller, slot, () => ({}) as never, {
    attrs: () => (button ? { type: "button" } : {}),
    state: () => unconnected as never,
  })
}

/**
 * Goes to the page before.
 * @experimental
 */
@Directive({ selector: "[uiCarouselPrevious]", exportAs: "uiCarouselPrevious" })
class UiCarouselPrevious implements OnInit {
  /** Connects it to the carousel with this controller, from anywhere. */
  readonly controller = input<CarouselController>()
  readonly #part = injectControl(
    "previous",
    this.controller,
    { disabled: true },
    true
  )
  /** The step's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Goes to the page after.
 * @experimental
 */
@Directive({ selector: "[uiCarouselNext]", exportAs: "uiCarouselNext" })
class UiCarouselNext implements OnInit {
  /** Connects it to the carousel with this controller, from anywhere. */
  readonly controller = input<CarouselController>()
  readonly #part = injectControl(
    "next",
    this.controller,
    { disabled: true },
    true
  )
  /** The step's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Starts and stops autoplay.
 * @experimental
 */
@Directive({
  selector: "[uiCarouselPlayToggle]",
  exportAs: "uiCarouselPlayToggle",
})
class UiCarouselPlayToggle implements OnInit {
  /** Connects it to the carousel with this controller, from anywhere. */
  readonly controller = input<CarouselController>()
  readonly #part = injectControl(
    "play-toggle",
    this.controller,
    { playing: false, paused: false },
    true
  )
  /** The toggle's state, with whether it's `playing`. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The page indicators, one `uiCarouselIndicator` per page.
 * @experimental
 */
@Directive({
  selector: "[uiCarouselIndicatorGroup]",
  exportAs: "uiCarouselIndicatorGroup",
})
class UiCarouselIndicatorGroup implements OnInit {
  /** Connects it to the carousel with this controller, from anywhere. */
  readonly controller = input<CarouselController>()
  readonly #part = injectControl(
    "indicator-group",
    this.controller,
    { page: 1, pageCount: null },
    false
  )
  /** @internal The carousel its indicators show. */
  readonly target = this.#part.target
  /** The group's state, with its `pageCount`. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Goes to its page, inside a `uiCarouselIndicatorGroup`.
 * @experimental
 */
@Directive({
  selector: "[uiCarouselIndicator]",
  exportAs: "uiCarouselIndicator",
})
class UiCarouselIndicator implements OnInit {
  /** The page it goes to, from 1. */
  readonly page = input<number>()
  readonly #group = inject(UiCarouselIndicatorGroup, { optional: true })
  readonly #nearest = inject(tokenOf(carousel), { optional: true })?.handle
  readonly #id = inject(UiIds).next()
  readonly #part = injectTargetPart(
    computed(() => this.#group?.target() ?? this.#nearest),
    "indicator",
    () => ({ id: this.#id, page: this.page() }),
    {
      attrs: () => ({ type: "button" }),
      state: () => ({ page: this.page() ?? 0, selected: false }) as never,
    }
  )
  /** The indicator's state, with whether it's `selected`. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createCarouselController } from "@ui-sdk/core/carousel"
export type {
  CarouselAlign,
  CarouselApi,
  CarouselContentState,
  CarouselControlProps,
  CarouselController,
  CarouselIndicatorGroupState,
  CarouselIndicatorProps,
  CarouselIndicatorState,
  CarouselItemState,
  CarouselNextState,
  CarouselOptions,
  CarouselOrientation,
  CarouselPageChangeReason,
  CarouselPageOptions,
  CarouselPlayToggleState,
  CarouselPlayingChangeReason,
  CarouselPlayingOptions,
  CarouselPreviousState,
  CarouselPrimitive,
  CarouselSlidesPerPage,
  CarouselState,
  CarouselStepState,
  CarouselViewportState,
} from "@ui-sdk/core/carousel"

export {
  type CarouselPageChangeDetails,
  type CarouselPlayingChangeDetails,
  UiCarousel,
  UiCarouselContent,
  UiCarouselIndicator,
  UiCarouselIndicatorGroup,
  UiCarouselItem,
  UiCarouselNext,
  UiCarouselPlayToggle,
  UiCarouselPrevious,
  UiCarouselViewport,
}
