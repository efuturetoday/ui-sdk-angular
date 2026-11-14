import {
  computed,
  Directive,
  inject,
  input,
  output,
  type InputSignal,
  type Signal,
  type OnInit,
} from "@angular/core"
import type {
  Anchor,
  ChangeDetails,
  DismissAttemptDetails,
  Side,
  TypesOf,
} from "@ui-sdk/core"
import {
  popover,
  type PopoverContentProps,
  type PopoverContentState,
  type PopoverController,
  type PopoverDismissReason,
  type PopoverFinalFocus,
  type PopoverInitialFocus,
  type PopoverOpenChangeReason,
  type PopoverPayloadChangeReason,
  type PopoverPrimitive,
} from "@ui-sdk/core/popover"
import {
  injectConnectedPart,
  injectPart,
  injectPopupPart,
  type PresentPartContext,
  optionalBoolean,
  ɵinjectShortcutPart as injectShortcutPart,
  ɵprovideTrigger as provideTrigger,
  type ɵTriggerContext as TriggerContext,
  ɵunboundTrigger as unboundTrigger,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
} from "@ngx-ui-sdk/core"

/**
 * Why the popover opens or closes.
 * @experimental
 */
type PopoverOpenChangeDetails = ChangeDetails<PopoverOpenChangeReason>

/**
 * A refused dismissal of a popover that isn't `dismissible`.
 * @experimental
 */
type PopoverDismissAttemptDetails = DismissAttemptDetails<PopoverDismissReason>

/**
 * A panel that opens beside its trigger. It renders no element of its own, so
 * it goes on an `ng-container` around its trigger and content.
 * @experimental
 */
@Directive({
  selector: "[uiPopover]",
  exportAs: "uiPopover",
  providers: [provideRoot(popover, () => UiPopover)],
})
class UiPopover implements OnInit {
  /** Whether the popover is open. Bind it, or `[(open)]`, to control the popover. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the popover is open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the page behind is inert. `"trap-focus"` only keeps focus inside. */
  readonly modal = input<boolean | "trap-focus">()
  /** Whether hovering the trigger opens it. */
  readonly openOnHover = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** How long a hover waits before opening, in milliseconds. */
  readonly delay = input<number>()
  /** How long it stays open after the pointer leaves, in milliseconds. */
  readonly closeDelay = input<number>()
  /** How it presents: `"sheet"` slides up from the bottom, `"auto"` does that on small touch screens. */
  readonly presentation = input<"auto" | "popover" | "sheet">()
  /** Whether Escape and outside presses may close it, `true` by default. */
  readonly dismissible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Renders the popover into this element instead of in place. */
  readonly container = input<Element | DocumentFragment | null>()
  /** Logs why it opens and closes to the console. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Opens and closes the popover from anywhere. Create one with `createPopoverController()`. */
  readonly controller = input<PopoverController<any>>()
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the popover opens or closes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: PopoverOpenChangeDetails
  }>()
  /** Emits once the popover has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when a dismissal is refused, like Escape on a popover that isn't `dismissible`. */
  readonly dismissAttempt = output<PopoverDismissAttemptDetails>()
  /** Emits when the payload a trigger or the controller passed changes. */
  readonly payloadChange = output<{
    payload: unknown
    details: ChangeDetails<PopoverPayloadChangeReason>
  }>()
  readonly handle: PrimitiveHandle<PopoverPrimitive> = injectPrimitive(
    popover,
    () => ({
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      modal: this.modal(),
      openOnHover: this.openOnHover(),
      delay: this.delay(),
      closeDelay: this.closeDelay(),
      presentation: this.presentation(),
      dismissible: this.dismissible(),
      debug: this.debug(),
      controller: this.controller(),
      onOpenChange: (open: boolean, details: PopoverOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
      onDismissAttempt: (details: PopoverDismissAttemptDetails) =>
        this.dismissAttempt.emit(details),
      onPayloadChange: (
        payload: unknown,
        details: ChangeDetails<PopoverPayloadChangeReason>
      ) => this.payloadChange.emit({ payload, details }),
    })
  )
  /** The popover's state. */
  readonly state: Signal<TypesOf<PopoverPrimitive>["state"]> = this.handle.state

  ngOnInit() {
    this.handle.init()
  }
}

/**
 * The button that opens the popover. A trigger outside the popover, like one
 * per table row, connects through `controller`.
 * @experimental
 */
@Directive({
  selector: "[uiPopoverTrigger]",
  exportAs: "uiPopoverTrigger",
  providers: [provideTrigger(popover, () => UiPopoverTrigger)],
})
class UiPopoverTrigger implements OnInit, TriggerContext<typeof popover> {
  /** What the popover gets as its payload when this trigger opens it. */
  readonly payload = input<unknown>()
  /** Stops the trigger from opening the popover. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps a disabled trigger focusable. */
  readonly focusableWhenDisabled = input<boolean | undefined, unknown>(
    undefined,
    { transform: optionalBoolean }
  )
  /** A keyboard shortcut that presses the trigger, like `"mod+k"`. */
  readonly shortcut = input<string>()
  /** Connects a trigger outside the popover to the one with this controller. */
  readonly controller = input<PopoverController<any>>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectConnectedPart(
    popover,
    this.controller,
    "trigger",
    () => ({
      id: this.#id,
      payload: this.payload(),
      disabled: this.disabled(),
      focusableWhenDisabled: this.focusableWhenDisabled(),
      shortcut: this.shortcut(),
    }),
    unboundTrigger(this.disabled, this.focusableWhenDisabled)
  )
  /** The popover this trigger opens, once it's on the page. */
  readonly target = this.#part.target
  /** The trigger's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shows a shortcut, like `⌘K`. Hidden from screen readers, which hear
 * `aria-keyshortcuts`. Left empty, it shows the keys of the trigger it sits in.
 * @experimental
 */
@Directive({ selector: "[uiPopoverShortcut]", exportAs: "uiPopoverShortcut" })
class UiPopoverShortcut implements OnInit {
  /** The keys to show. Inside a trigger, its shortcut. */
  readonly shortcut = input<string>()
  readonly #part = injectShortcutPart(popover, this.shortcut)
  /** The shortcut's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The popover itself, on the element it's written on: `<div *uiPopoverContent>`.
 * It's positioned beside its trigger. Presented as a sheet, it sits in a
 * viewport the adapter makes around it, styled by `[data-slot="popover-viewport"]`.
 * @experimental
 */
@Directive({ selector: "[uiPopoverContent]" })
class UiPopoverContent implements OnInit {
  /** Which side of the trigger it opens on: `*uiPopoverContent="let state; side: 'top'"`. */
  readonly side = input<Side>(undefined, { alias: "uiPopoverContentSide" })
  /** How it lines up with the trigger along that side. */
  readonly align = input<"start" | "center" | "end">(undefined, {
    alias: "uiPopoverContentAlign",
  })
  /** Gap between the trigger and the popover, in pixels. */
  readonly sideOffset = input<number>(undefined, {
    alias: "uiPopoverContentSideOffset",
  })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input<number>(undefined, {
    alias: "uiPopoverContentAlignOffset",
  })
  /** Space it keeps from the edges of the screen, in pixels. */
  readonly collisionPadding = input<number>(undefined, {
    alias: "uiPopoverContentCollisionPadding",
  })
  /** Space the arrow keeps from the popover's corners, in pixels. */
  readonly arrowPadding = input<number>(undefined, {
    alias: "uiPopoverContentArrowPadding",
  })
  /** What it's positioned against instead of the trigger: an element, a point, or a selector. */
  readonly anchor = input<Anchor | string | null>(undefined, {
    alias: "uiPopoverContentAnchor",
  })
  /** Where focus goes when the popover opens. */
  readonly initialFocus = input<PopoverInitialFocus>(undefined, {
    alias: "uiPopoverContentInitialFocus",
  })
  /** Where focus goes when the popover closes while focus is inside it. */
  readonly finalFocus: InputSignal<PopoverFinalFocus | undefined> = input<
    PopoverFinalFocus | undefined
  >(undefined, { alias: "uiPopoverContentFinalFocus" })
  /** Keeps the popover in the page, hidden, while closed, for animation libraries that drive the exit. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiPopoverContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Where the popover renders, instead of the root's `container`. */
  readonly container = input<PopoverContentProps["container"]>(undefined, {
    alias: "uiPopoverContentContainer",
  })
  readonly #props = computed(() => ({
    side: this.side(),
    align: this.align(),
    sideOffset: this.sideOffset(),
    alignOffset: this.alignOffset(),
    collisionPadding: this.collisionPadding(),
    arrowPadding: this.arrowPadding(),
    anchor: this.anchor(),
    initialFocus: this.initialFocus(),
    finalFocus: this.finalFocus(),
    keepMounted: this.keepMounted(),
  }))
  readonly #root = inject(UiPopover)
  readonly #part = injectPopupPart(
    injectHandle(popover),
    "content",
    this.#props,
    {
      container: () => this.container() ?? this.#root.container(),
      viewport: "viewport",
    }
  )

  static ngTemplateContextGuard(
    _directive: UiPopoverContent,
    _context: unknown
  ): _context is PresentPartContext<PopoverContentState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The popover's title, which names it.
 * @experimental
 */
@Directive({ selector: "[uiPopoverTitle]", exportAs: "uiPopoverTitle" })
class UiPopoverTitle implements OnInit {
  readonly #part = injectPart(injectHandle(popover), "title")
  /** The title's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Describes the popover while it's rendered.
 * @experimental
 */
@Directive({
  selector: "[uiPopoverDescription]",
  exportAs: "uiPopoverDescription",
})
class UiPopoverDescription implements OnInit {
  readonly #part = injectPart(injectHandle(popover), "description")
  /** The description's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A button that closes the popover.
 * @experimental
 */
@Directive({ selector: "[uiPopoverClose]", exportAs: "uiPopoverClose" })
class UiPopoverClose implements OnInit {
  readonly #part = injectPart(injectHandle(popover), "close")
  /** The close button's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An arrow that points at the trigger, positioned along the popover's edge.
 * @experimental
 */
@Directive({ selector: "[uiPopoverArrow]", exportAs: "uiPopoverArrow" })
class UiPopoverArrow implements OnInit {
  readonly #part = injectPart(injectHandle(popover), "arrow")
  /** The arrow's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createPopoverController } from "@ui-sdk/core/popover"
export type {
  PopoverApi,
  PopoverArrowState,
  PopoverContentProps,
  PopoverContentState,
  PopoverController,
  PopoverDismissReason,
  PopoverFinalFocus,
  PopoverInitialFocus,
  PopoverOpenChangeReason,
  PopoverOptions,
  PopoverPayloadChangeReason,
  PopoverPrimitive,
  PopoverShortcutProps,
  PopoverShortcutState,
  PopoverTriggerProps,
  PopoverTriggerState,
} from "@ui-sdk/core/popover"

export {
  type PopoverDismissAttemptDetails,
  type PopoverOpenChangeDetails,
  UiPopover,
  UiPopoverArrow,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverShortcut,
  UiPopoverTitle,
  UiPopoverTrigger,
}
