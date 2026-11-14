import {
  computed,
  Directive,
  inject,
  input,
  output,
  type OnInit,
  type Signal,
} from "@angular/core"
import type { Anchor, ChangeDetails, Side, TypesOf } from "@ui-sdk/core"
import {
  hoverCard,
  type HoverCardContentProps,
  type HoverCardContentState,
  type HoverCardController,
  type HoverCardOpenChangeReason,
  type HoverCardPayloadChangeReason,
  type HoverCardPrimitive,
} from "@ui-sdk/core/hover-card"
import {
  optionalBoolean,
  injectConnectedPart,
  injectPart,
  injectPopupPart,
  type PresentPartContext,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
} from "ngx-ui-sdk"

/**
 * Why the hover card opens or closes.
 * @experimental
 */
type HoverCardOpenChangeDetails = ChangeDetails<HoverCardOpenChangeReason>

/**
 * A preview of what a link points to, shown when the pointer rests on the link
 * or keyboard focus stays on it. It renders no element of its own, so it goes
 * on an `ng-container` around its trigger and content.
 * @experimental
 */
@Directive({
  selector: "[uiHoverCard]",
  exportAs: "uiHoverCard",
  providers: [provideRoot(hoverCard, () => UiHoverCard)],
})
class UiHoverCard implements OnInit {
  /** Whether the card is open. Bind it, or `[(open)]`, to control the card. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the card is open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** How long the pointer rests on the trigger, or focus stays on it, before the card opens, in milliseconds. */
  readonly delay = input<number>()
  /** How long it stays open after the pointer leaves, in milliseconds. */
  readonly closeDelay = input<number>()
  /** Stops the card from opening. The trigger keeps working as a link. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Renders the card into this element instead of in place. */
  readonly container = input<Element | DocumentFragment | null>()
  /** Logs why it opens and closes to the console. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Opens and closes the card from anywhere. Create one with `createHoverCardController()`. */
  readonly controller = input<HoverCardController<any>>()
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the card opens or closes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: HoverCardOpenChangeDetails
  }>()
  /** Emits once the card has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when the payload a trigger or the controller passed changes. */
  readonly payloadChange = output<{
    payload: unknown
    details: ChangeDetails<HoverCardPayloadChangeReason>
  }>()
  readonly handle: PrimitiveHandle<HoverCardPrimitive> = injectPrimitive(
    hoverCard,
    () => ({
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      delay: this.delay(),
      closeDelay: this.closeDelay(),
      disabled: this.disabled(),
      debug: this.debug(),
      controller: this.controller(),
      onOpenChange: (open: boolean, details: HoverCardOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
      onPayloadChange: (
        payload: unknown,
        details: ChangeDetails<HoverCardPayloadChangeReason>
      ) => this.payloadChange.emit({ payload, details }),
    })
  )
  /** The card's state. */
  readonly state: Signal<TypesOf<HoverCardPrimitive>["state"]> =
    this.handle.state

  ngOnInit() {
    this.handle.init()
  }
}

/**
 * A link by default: pressing it follows the link, and hover or focus opens
 * the card. A trigger outside the card connects through `controller`.
 * @experimental
 */
@Directive({
  selector: "[uiHoverCardTrigger]",
  exportAs: "uiHoverCardTrigger",
})
class UiHoverCardTrigger implements OnInit {
  /** What the card gets as its payload when this trigger opens it. */
  readonly payload = input<unknown>()
  /** Connects a trigger outside the card to the one with this controller. */
  readonly controller = input<HoverCardController<any>>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectConnectedPart(
    hoverCard,
    this.controller,
    "trigger",
    () => ({ id: this.#id, payload: this.payload() }),
    { attrs: () => ({}), state: () => ({ open: false }) }
  )
  /** The card this trigger belongs to, once it's on the page. */
  readonly target = this.#part.target
  /** The trigger's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The card itself, on the element it's written on: `<div *uiHoverCardContent>`.
 * It's positioned against its trigger.
 * @experimental
 */
@Directive({ selector: "[uiHoverCardContent]" })
class UiHoverCardContent implements OnInit {
  /** Which side of the trigger it opens on: `*uiHoverCardContent="let state; side: 'top'"`. */
  readonly side = input<Side>(undefined, { alias: "uiHoverCardContentSide" })
  /** How it lines up with the trigger along that side. */
  readonly align = input<"start" | "center" | "end">(undefined, {
    alias: "uiHoverCardContentAlign",
  })
  /** Gap between the trigger and the card, in pixels. */
  readonly sideOffset = input<number>(undefined, {
    alias: "uiHoverCardContentSideOffset",
  })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input<number>(undefined, {
    alias: "uiHoverCardContentAlignOffset",
  })
  /** Space it keeps from the edges of the screen, in pixels. */
  readonly collisionPadding = input<number>(undefined, {
    alias: "uiHoverCardContentCollisionPadding",
  })
  /** Space the arrow keeps from the card's corners, in pixels. */
  readonly arrowPadding = input<number>(undefined, {
    alias: "uiHoverCardContentArrowPadding",
  })
  /** What it's positioned against instead of the trigger: an element, a point, or a selector. */
  readonly anchor = input<Anchor | string | null>(undefined, {
    alias: "uiHoverCardContentAnchor",
  })
  /** Keeps the card in the page, hidden, while closed, for animation libraries that drive the exit. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiHoverCardContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Where the card renders, instead of the root's `container`. */
  readonly container = input<HoverCardContentProps["container"]>(undefined, {
    alias: "uiHoverCardContentContainer",
  })
  readonly #props = computed(() => ({
    side: this.side(),
    align: this.align(),
    sideOffset: this.sideOffset(),
    alignOffset: this.alignOffset(),
    collisionPadding: this.collisionPadding(),
    arrowPadding: this.arrowPadding(),
    anchor: this.anchor(),
    keepMounted: this.keepMounted(),
  }))
  readonly #root = inject(UiHoverCard)
  readonly #part = injectPopupPart(
    injectHandle(hoverCard),
    "content",
    this.#props,
    { container: () => this.container() ?? this.#root.container() }
  )

  static ngTemplateContextGuard(
    _directive: UiHoverCardContent,
    _context: unknown
  ): _context is PresentPartContext<HoverCardContentState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An arrow on the card's edge that points at its trigger.
 * @experimental
 */
@Directive({ selector: "[uiHoverCardArrow]", exportAs: "uiHoverCardArrow" })
class UiHoverCardArrow implements OnInit {
  readonly #part = injectPart(injectHandle(hoverCard), "arrow")
  /** The arrow's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createHoverCardController } from "@ui-sdk/core/hover-card"
export type {
  HoverCardApi,
  HoverCardArrowState,
  HoverCardContentProps,
  HoverCardContentState,
  HoverCardController,
  HoverCardOpenChangeReason,
  HoverCardOptions,
  HoverCardPayloadChangeReason,
  HoverCardPrimitive,
  HoverCardTriggerProps,
  HoverCardTriggerState,
} from "@ui-sdk/core/hover-card"

export {
  type HoverCardOpenChangeDetails,
  UiHoverCard,
  UiHoverCardArrow,
  UiHoverCardContent,
  UiHoverCardTrigger,
}
