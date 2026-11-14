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
import type { ChangeDetails, TypesOf } from "@ui-sdk/core"
import type {
  DialogCloseActionDetails,
  DialogFinalFocus,
  DialogInitialFocus,
} from "@ui-sdk/core/dialog"
import {
  drawer,
  type DrawerBackdropState,
  type DrawerContentProps,
  type DrawerContentState,
  type DrawerController,
  type DrawerDismissAttemptDetails,
  type DrawerDriver,
  type DrawerKeyframes,
  type DrawerOpenChangeReason,
  type DrawerPayloadChangeReason,
  type DrawerPrimitive,
  type DrawerSide,
  type DrawerSnapPointChangeReason,
  type SheetPhysics,
  type SnapPoint,
} from "@ui-sdk/core/drawer"
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
 * Why the drawer opens or closes, and the `returnValue` of the Close part
 * that closed it.
 * @experimental
 */
type DrawerOpenChangeDetails = ChangeDetails<DrawerOpenChangeReason> & {
  returnValue?: string
}

/**
 * A dialog presented as a sheet that slides in from an edge. It renders no
 * element of its own, so it goes on an `ng-container` around its trigger,
 * backdrop and content.
 * @experimental
 */
@Directive({
  selector: "[uiDrawer]",
  exportAs: "uiDrawer",
  providers: [provideRoot(drawer, () => UiDrawer)],
})
class UiDrawer implements OnInit {
  /** Whether the drawer is open. Bind it, or `[(open)]`, to control the drawer. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the drawer is open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the page behind is inert, `true` by default. `"trap-focus"` only keeps focus inside. */
  readonly modal = input<boolean | "trap-focus">()
  /** Whether Escape, outside presses and swipes may close it, `true` by default. */
  readonly dismissible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a press outside closes it, `true` by default while it's modal. */
  readonly closeOnOutsidePress = input<boolean | undefined, unknown>(
    undefined,
    { transform: optionalBoolean }
  )
  /** Renders the drawer into this element instead of in place. */
  readonly container = input<Element | DocumentFragment | null>()
  /** Elements outside that stay live while it's modal. */
  readonly persistentElements = input<
    (Element | string)[] | (() => Element[])
  >()
  /** What a screen reader announces while a close action is pending. */
  readonly pendingAnnouncement = input<string>()
  /** The points it rests at, as fractions of the viewport, pixels like `"200px"`, or `"content"`. */
  readonly snapPoints = input<SnapPoint[]>()
  /** The snap point it rests at. Bind it, or `[(snapPoint)]`, to control it. */
  readonly snapPoint = input<SnapPoint | null>()
  /** The snap point it opens at, when uncontrolled. */
  readonly defaultSnapPoint = input<SnapPoint>()
  /** The edge it comes from, `"bottom"` by default. */
  readonly side = input<DrawerSide>()
  /** The snap point above which it's modal; at or below it, the page stays usable. */
  readonly modalAbove = input<SnapPoint>()
  /** How it follows a drag: `"pointer"` events or native `"scroll-snap"`. */
  readonly driver = input<DrawerDriver>()
  /** Whether scrolling its content up expands it to the next snap point first, `true` by default. */
  readonly expandOnScroll = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The spring it moves with. */
  readonly physics = input<Partial<SheetPhysics>>()
  /** Whether it dims the browser's theme color with its backdrop. */
  readonly themeColor = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether it stops swipes from the screen's edge, like the browser's back gesture. */
  readonly preventEdgeSwipe = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Logs its gestures to the console. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Opens, closes and moves the drawer from anywhere. Create one with `createDrawerController()`. */
  readonly controller = input<DrawerController<any, any>>()
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the drawer opens or closes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: DrawerOpenChangeDetails
  }>()
  /** Emits once the drawer has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when a dismissal is refused, like a swipe on a drawer that isn't `dismissible`. */
  readonly dismissAttempt = output<DrawerDismissAttemptDetails>()
  /** Emits when the payload a trigger or the controller passed changes. */
  readonly payloadChange = output<{
    payload: unknown
    details: ChangeDetails<DrawerPayloadChangeReason>
  }>()
  /** Emits the new snap point once a change isn't canceled, for `[(snapPoint)]`. */
  readonly snapPointChange = output<SnapPoint>()
  /** Emits before it moves to another snap point. `details.cancel()` stops it. */
  readonly beforeSnapPointChange = output<{
    snapPoint: SnapPoint
    details: ChangeDetails<DrawerSnapPointChangeReason>
  }>()
  readonly handle: PrimitiveHandle<DrawerPrimitive> = injectPrimitive(
    drawer,
    () => ({
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      modal: this.modal(),
      dismissible: this.dismissible(),
      closeOnOutsidePress: this.closeOnOutsidePress(),
      persistentElements: this.persistentElements(),
      pendingAnnouncement: this.pendingAnnouncement(),
      snapPoints: this.snapPoints(),
      snapPoint: this.snapPoint(),
      defaultSnapPoint: this.defaultSnapPoint(),
      side: this.side(),
      modalAbove: this.modalAbove(),
      driver: this.driver(),
      expandOnScroll: this.expandOnScroll(),
      physics: this.physics(),
      themeColor: this.themeColor(),
      preventEdgeSwipe: this.preventEdgeSwipe(),
      debug: this.debug(),
      controller: this.controller(),
      onOpenChange: (open: boolean, details: DrawerOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
      onDismissAttempt: (details: DrawerDismissAttemptDetails) =>
        this.dismissAttempt.emit(details),
      onPayloadChange: (
        payload: unknown,
        details: ChangeDetails<DrawerPayloadChangeReason>
      ) => this.payloadChange.emit({ payload, details }),
      onSnapPointChange: (
        snapPoint: SnapPoint,
        details: ChangeDetails<DrawerSnapPointChangeReason>
      ) => {
        this.beforeSnapPointChange.emit({ snapPoint, details })
        if (!details.canceled) {
          this.snapPointChange.emit(snapPoint)
        }
      },
    })
  )
  /** The drawer's state. */
  readonly state: Signal<TypesOf<DrawerPrimitive>["state"]> = this.handle.state

  ngOnInit() {
    this.handle.init()
  }
}

/**
 * The button that opens the drawer. A trigger outside the drawer, like one
 * per table row, connects through `controller`.
 * @experimental
 */
@Directive({
  selector: "[uiDrawerTrigger]",
  exportAs: "uiDrawerTrigger",
  providers: [provideTrigger(drawer, () => UiDrawerTrigger)],
})
class UiDrawerTrigger implements OnInit, TriggerContext<typeof drawer> {
  /** What the drawer gets as its payload when this trigger opens it. */
  readonly payload = input<unknown>()
  /** Stops the trigger from opening the drawer. */
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
  /** Connects a trigger outside the drawer to the one with this controller. */
  readonly controller = input<DrawerController<any, any>>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectConnectedPart(
    drawer,
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
  /** The drawer this trigger opens, once it's on the page. */
  readonly target = this.#part.target
  /** The trigger's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shows a trigger's shortcut, like `⌘K`, inside the trigger. Hidden from
 * screen readers, which hear `aria-keyshortcuts`. Left empty, it shows the keys.
 * @experimental
 */
@Directive({ selector: "[uiDrawerShortcut]", exportAs: "uiDrawerShortcut" })
class UiDrawerShortcut implements OnInit {
  /** The keys to show. Inside a trigger, its shortcut. */
  readonly shortcut = input<string>()
  readonly #part = injectShortcutPart(drawer, this.shortcut)
  /** The shortcut's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A dim behind the drawer, on the element it's written on: `<div *uiDrawerBackdrop>`.
 * Its opacity follows the drawer, so give it a color like `rgb(0 0 0 / 20%)`.
 * @experimental
 */
@Directive({ selector: "[uiDrawerBackdrop]" })
class UiDrawerBackdrop implements OnInit {
  readonly #root = inject(UiDrawer)
  readonly #part = injectPopupPart(
    injectHandle(drawer),
    "backdrop",
    undefined,
    {
      container: () => this.#root.container(),
    }
  )

  static ngTemplateContextGuard(
    _directive: UiDrawerBackdrop,
    _context: unknown
  ): _context is PresentPartContext<DrawerBackdropState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The sheet itself, a dialog, on the element it's written on: `<div *uiDrawerContent>`.
 * It sits in a full-screen viewport the adapter makes around it, styled by
 * `[data-slot="drawer-viewport"]`.
 * @experimental
 */
@Directive({ selector: "[uiDrawerContent]" })
class UiDrawerContent implements OnInit {
  /** Where focus goes when the drawer opens: `*uiDrawerContent="let state; initialFocus: 'content'"`. */
  readonly initialFocus = input<DialogInitialFocus>(undefined, {
    alias: "uiDrawerContentInitialFocus",
  })
  /** Where focus goes when the drawer closes while focus is inside it. */
  readonly finalFocus: InputSignal<DialogFinalFocus | undefined> = input<
    DialogFinalFocus | undefined
  >(undefined, {
    alias: "uiDrawerContentFinalFocus",
  })
  /** Keeps the drawer in the page, hidden, while closed, for animation libraries that drive the exit. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiDrawerContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Where the drawer renders, instead of the root's `container`. */
  readonly container = input<DrawerContentProps["container"]>(undefined, {
    alias: "uiDrawerContentContainer",
  })
  readonly #props = computed(() => ({
    initialFocus: this.initialFocus(),
    finalFocus: this.finalFocus(),
    keepMounted: this.keepMounted(),
  }))
  readonly #root = inject(UiDrawer)
  readonly #part = injectPopupPart(
    injectHandle(drawer),
    "content",
    this.#props,
    {
      container: () => this.container() ?? this.#root.container(),
      viewport: "viewport",
    }
  )

  static ngTemplateContextGuard(
    _directive: UiDrawerContent,
    _context: unknown
  ): _context is PresentPartContext<DrawerContentState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The grabber. Pressing it moves to the next snap point; arrow keys, Home and
 * End step.
 * @experimental
 */
@Directive({ selector: "[uiDrawerHandle]", exportAs: "uiDrawerHandle" })
class UiDrawerHandle implements OnInit {
  readonly #part = injectPart(injectHandle(drawer), "handle")
  /** The handle's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The drawer's title, which names it.
 * @experimental
 */
@Directive({ selector: "[uiDrawerTitle]", exportAs: "uiDrawerTitle" })
class UiDrawerTitle implements OnInit {
  readonly #part = injectPart(injectHandle(drawer), "title")
  /** The title's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Describes the drawer while it's rendered.
 * @experimental
 */
@Directive({
  selector: "[uiDrawerDescription]",
  exportAs: "uiDrawerDescription",
})
class UiDrawerDescription implements OnInit {
  readonly #part = injectPart(injectHandle(drawer), "description")
  /** The description's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A button that closes the drawer. An `action` runs first, and a Promise it
 * returns keeps the drawer open until it settles.
 * @experimental
 */
@Directive({ selector: "[uiDrawerClose]", exportAs: "uiDrawerClose" })
class UiDrawerClose implements OnInit {
  /** Reported as `returnValue` when this closes the drawer. */
  readonly value = input<string>()
  /** Runs before the drawer closes. A returned Promise keeps it open and pending until it settles. */
  readonly action =
    input<
      (
        event: Event | undefined,
        details: DialogCloseActionDetails
      ) => unknown | Promise<unknown>
    >()
  // Keyed by its own id, so several close buttons stay apart.
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(drawer), "close", () => ({
    id: this.#id,
    value: this.value(),
    action: this.action(),
  }))
  /** The close button's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An element that follows the drawer, like the page behind it. Outside the
 * drawer, pass its `controller`.
 * @experimental
 */
@Directive({ selector: "[uiDrawerOutlet]", exportAs: "uiDrawerOutlet" })
class UiDrawerOutlet implements OnInit {
  /** Keyframes it plays as the drawer expands, like `{ scale: [1, 0.94] }`. */
  readonly keyframes = input<DrawerKeyframes>()
  /** Connects an outlet outside the drawer to the one with this controller. */
  readonly controller = input<DrawerController<any, any>>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectConnectedPart(
    drawer,
    this.controller,
    "outlet",
    () => ({ id: this.#id, keyframes: this.keyframes() }),
    { attrs: () => ({}), state: () => ({ open: false }) }
  )
  /** The outlet's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createDrawerController, sheetPhysics } from "@ui-sdk/core/drawer"
export type {
  DrawerApi,
  DrawerBackdropState,
  DrawerContentProps,
  DrawerContentState,
  DrawerController,
  DrawerDismissAttemptDetails,
  DrawerDismissReason,
  DrawerDriver,
  DrawerHandleState,
  DrawerKeyframes,
  DrawerOpenChangeReason,
  DrawerOptions,
  DrawerOutletProps,
  DrawerOutletState,
  DrawerPayloadChangeReason,
  DrawerPrimitive,
  DrawerSide,
  DrawerSnapPointChangeReason,
  DrawerTriggerProps,
  SheetPhysics,
  SnapPoint,
} from "@ui-sdk/core/drawer"

export {
  type DrawerOpenChangeDetails,
  UiDrawer,
  UiDrawerBackdrop,
  UiDrawerClose,
  UiDrawerContent,
  UiDrawerDescription,
  UiDrawerHandle,
  UiDrawerOutlet,
  UiDrawerShortcut,
  UiDrawerTitle,
  UiDrawerTrigger,
}
