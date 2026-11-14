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
  tooltip,
  type TooltipContentProps,
  type TooltipContentState,
  type TooltipController,
  type TooltipOpenChangeReason,
  type TooltipPayloadChangeReason,
  type TooltipPrimitive,
} from "@ui-sdk/core/tooltip"
import {
  optionalBoolean,
  injectConnectedPart,
  injectPart,
  injectPopupPart,
  type PresentPartContext,
  ɵinjectShortcutPart as injectShortcutPart,
  ɵprovideTrigger as provideTrigger,
  type ɵTriggerContext as TriggerContext,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
} from "ngx-ui-sdk"

/**
 * Why the tooltip opens or closes.
 * @experimental
 */
type TooltipOpenChangeDetails = ChangeDetails<TooltipOpenChangeReason>

/**
 * A short label or hint that appears when the pointer rests on its trigger or
 * keyboard focus reaches it. It renders no element of its own, so it goes on
 * an `ng-container` around its trigger and content.
 * @experimental
 */
@Directive({
  selector: "[uiTooltip]",
  exportAs: "uiTooltip",
  providers: [provideRoot(tooltip, () => UiTooltip)],
})
class UiTooltip implements OnInit {
  /** Whether the tooltip is open. Bind it, or `[(open)]`, to control the tooltip. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the tooltip is open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** How long the pointer rests on the trigger before it opens, in milliseconds. */
  readonly delay = input<number>()
  /** How long it stays open after the pointer leaves, in milliseconds. */
  readonly closeDelay = input<number>()
  /** Stops the tooltip from opening. The trigger keeps working. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether pressing the trigger opens and closes it, so touch screens can show it too. */
  readonly toggleable = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether pressing the trigger closes it. `false` keeps it open. */
  readonly closeOnPress = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether it names its trigger (`"label"`) or describes it (`"description"`). */
  readonly type = input<"label" | "description">()
  /** The keyboard shortcut of what the trigger does, like `"mod+s"`, as a hint a `uiTooltipShortcut` shows. */
  readonly shortcut = input<string>()
  /** Renders the tooltip into this element instead of in place. */
  readonly container = input<Element | DocumentFragment | null>()
  /** Logs why it opens and closes to the console. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Opens and closes the tooltip from anywhere. Create one with `createTooltipController()`. */
  readonly controller = input<TooltipController<any>>()
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the tooltip opens or closes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: TooltipOpenChangeDetails
  }>()
  /** Emits once the tooltip has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when the payload a trigger or the controller passed changes. */
  readonly payloadChange = output<{
    payload: unknown
    details: ChangeDetails<TooltipPayloadChangeReason>
  }>()
  readonly handle: PrimitiveHandle<TooltipPrimitive> = injectPrimitive(
    tooltip,
    () => ({
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      delay: this.delay(),
      closeDelay: this.closeDelay(),
      disabled: this.disabled(),
      toggleable: this.toggleable(),
      closeOnPress: this.closeOnPress(),
      type: this.type(),
      shortcut: this.shortcut(),
      debug: this.debug(),
      controller: this.controller(),
      onOpenChange: (open: boolean, details: TooltipOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
      onPayloadChange: (
        payload: unknown,
        details: ChangeDetails<TooltipPayloadChangeReason>
      ) => this.payloadChange.emit({ payload, details }),
    })
  )
  /** The tooltip's state. */
  readonly state: Signal<TypesOf<TooltipPrimitive>["state"]> = this.handle.state

  ngOnInit() {
    this.handle.init()
  }
}

/**
 * The element the tooltip names or describes, usually a button. A trigger
 * outside the tooltip connects through `controller`.
 * @experimental
 */
@Directive({
  selector: "[uiTooltipTrigger]",
  exportAs: "uiTooltipTrigger",
  providers: [provideTrigger(tooltip, () => UiTooltipTrigger)],
})
class UiTooltipTrigger implements OnInit, TriggerContext<typeof tooltip> {
  /** What the tooltip gets as its payload when this trigger opens it. */
  readonly payload = input<unknown>()
  /** Connects a trigger outside the tooltip to the one with this controller. */
  readonly controller = input<TooltipController<any>>()
  /** @internal A tooltip's shortcut is its own, never its trigger's. */
  readonly shortcut = computed(() => undefined)
  readonly #id = inject(UiIds).next()
  readonly #part = injectConnectedPart(
    tooltip,
    this.controller,
    "trigger",
    () => ({ id: this.#id, payload: this.payload() }),
    {
      attrs: () => ({ type: "button" }),
      state: () => ({ open: false }),
    }
  )
  /** The tooltip this trigger belongs to, once it's on the page. */
  readonly target = this.#part.target
  /** The trigger's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The tooltip itself, on the element it's written on:
 * `<div *uiTooltipContent>`. It's positioned against its trigger.
 * @experimental
 */
@Directive({ selector: "[uiTooltipContent]" })
class UiTooltipContent implements OnInit {
  /** Which side of the trigger it opens on: `*uiTooltipContent="let state; side: 'bottom'"`. */
  readonly side = input<Side>(undefined, { alias: "uiTooltipContentSide" })
  /** How it lines up with the trigger along that side. */
  readonly align = input<"start" | "center" | "end">(undefined, {
    alias: "uiTooltipContentAlign",
  })
  /** Gap between the trigger and the tooltip, in pixels. */
  readonly sideOffset = input<number>(undefined, {
    alias: "uiTooltipContentSideOffset",
  })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input<number>(undefined, {
    alias: "uiTooltipContentAlignOffset",
  })
  /** Space it keeps from the edges of the screen, in pixels. */
  readonly collisionPadding = input<number>(undefined, {
    alias: "uiTooltipContentCollisionPadding",
  })
  /** Space the arrow keeps from the tooltip's corners, in pixels. */
  readonly arrowPadding = input<number>(undefined, {
    alias: "uiTooltipContentArrowPadding",
  })
  /** What it's positioned against instead of the trigger: an element, a point, or a selector. */
  readonly anchor = input<Anchor | string | null>(undefined, {
    alias: "uiTooltipContentAnchor",
  })
  /** Where the tooltip renders, instead of the root's `container`. */
  readonly container = input<TooltipContentProps["container"]>(undefined, {
    alias: "uiTooltipContentContainer",
  })
  readonly #props = computed(() => ({
    side: this.side(),
    align: this.align(),
    sideOffset: this.sideOffset(),
    alignOffset: this.alignOffset(),
    collisionPadding: this.collisionPadding(),
    arrowPadding: this.arrowPadding(),
    anchor: this.anchor(),
  }))
  readonly #root = inject(UiTooltip)
  readonly #part = injectPopupPart(
    injectHandle(tooltip),
    "content",
    this.#props,
    { container: () => this.container() ?? this.#root.container() }
  )

  static ngTemplateContextGuard(
    _directive: UiTooltipContent,
    _context: unknown
  ): _context is PresentPartContext<TooltipContentState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An arrow on the tooltip's edge that points at its trigger.
 * @experimental
 */
@Directive({ selector: "[uiTooltipArrow]", exportAs: "uiTooltipArrow" })
class UiTooltipArrow implements OnInit {
  readonly #part = injectPart(injectHandle(tooltip), "arrow")
  /** The arrow's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shows the tooltip's shortcut, like `⌘S`, formatted for the platform. Hidden
 * from screen readers, which hear `aria-keyshortcuts`. Written empty, it shows
 * the keys itself.
 * @experimental
 */
@Directive({ selector: "[uiTooltipShortcut]", exportAs: "uiTooltipShortcut" })
class UiTooltipShortcut implements OnInit {
  /** The keys to show. By default, the tooltip's `shortcut`. */
  readonly shortcut = input<string>()
  readonly #part = injectShortcutPart(tooltip, this.shortcut)
  /** The shortcut's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createTooltipController } from "@ui-sdk/core/tooltip"
export type {
  TooltipApi,
  TooltipArrowState,
  TooltipContentProps,
  TooltipContentState,
  TooltipController,
  TooltipOpenChangeReason,
  TooltipOptions,
  TooltipPayloadChangeReason,
  TooltipPrimitive,
  TooltipShortcutProps,
  TooltipShortcutState,
  TooltipTriggerProps,
  TooltipTriggerState,
} from "@ui-sdk/core/tooltip"

export {
  type TooltipOpenChangeDetails,
  UiTooltip,
  UiTooltipArrow,
  UiTooltipContent,
  UiTooltipShortcut,
  UiTooltipTrigger,
}
