import {
  computed,
  Directive,
  inject,
  input,
  output,
  type InputSignal,
  type OnInit,
  type Signal,
} from "@angular/core"
import type { ChangeDetails, TypesOf } from "@ui-sdk/core"
import {
  dialog,
  type DialogBackdropState,
  type DialogCloseActionDetails,
  type DialogContentProps,
  type DialogFinalFocus,
  type DialogInitialFocus,
  type DialogContentState,
  type DialogController,
  type DialogDismissAttemptDetails,
  type DialogOpenChangeDetails,
  type DialogPayloadChangeReason,
  type DialogPrimitive,
} from "@ui-sdk/core/dialog"
import { injectConnectedPart, injectPart } from "./part"
import { injectPopupPart } from "./popup-layer"
import type { PresentPartContext } from "./structural"
import { optionalBoolean } from "./inputs"
import {
  injectShortcut,
  provideTrigger,
  type TriggerContext,
  unboundTrigger,
} from "./trigger"
import {
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  UiIds,
} from "./primitive"

/**
 * A window over the page that asks for the user's attention. It renders no
 * element of its own, so it goes on an `ng-container` around its trigger and content.
 * @experimental
 */
@Directive({
  selector: "[uiDialog]",
  exportAs: "uiDialog",
  providers: [provideRoot(dialog, () => UiDialog)],
})
class UiDialog implements OnInit {
  /** Whether the dialog is open. Bind it, or `[(open)]`, to control the dialog. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the dialog is open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the page behind is inert, `true` by default. `"trap-focus"` only keeps focus inside. */
  readonly modal = input<boolean | "trap-focus">()
  /** Whether Escape and outside presses may close it, `true` by default. */
  readonly dismissible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a press outside closes it, `true` by default. */
  readonly closeOnOutsidePress = input<boolean | undefined, unknown>(
    undefined,
    { transform: optionalBoolean }
  )
  /** How it presents: `"sheet"` slides up from the bottom, `"auto"` does that on small touch screens. */
  readonly presentation = input<"auto" | "dialog" | "sheet">()
  /** Renders the popup into this element instead of in place. */
  readonly container = input<Element | DocumentFragment | null>()
  /** Elements outside that stay live while it's modal. */
  readonly persistentElements = input<
    (Element | string)[] | (() => Element[])
  >()
  /** What a screen reader announces while a close action is pending. */
  readonly pendingAnnouncement = input<string>()
  /** Opens and closes the dialog from anywhere. Create one with `createDialogController()`. */
  readonly controller = input<DialogController<any, any>>()
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the dialog opens or closes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: DialogOpenChangeDetails
  }>()
  /** Emits once the dialog has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when a dismissal is refused, like Escape on a dialog that isn't `dismissible`. */
  readonly dismissAttempt = output<DialogDismissAttemptDetails>()
  /** Emits when the payload a trigger or the controller passed changes. */
  readonly payloadChange = output<{
    payload: unknown
    details: ChangeDetails<DialogPayloadChangeReason>
  }>()
  readonly handle: PrimitiveHandle<DialogPrimitive> = injectPrimitive(
    dialog,
    () => ({
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      modal: this.modal(),
      dismissible: this.dismissible(),
      closeOnOutsidePress: this.closeOnOutsidePress(),
      presentation: this.presentation(),
      container: this.container(),
      persistentElements: this.persistentElements(),
      pendingAnnouncement: this.pendingAnnouncement(),
      controller: this.controller(),
      onOpenChange: (open: boolean, details: DialogOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
      onDismissAttempt: (details: DialogDismissAttemptDetails) =>
        this.dismissAttempt.emit(details),
      onPayloadChange: (
        payload: unknown,
        details: ChangeDetails<DialogPayloadChangeReason>
      ) => this.payloadChange.emit({ payload, details }),
    })
  )
  /** The dialog's state. */
  readonly state: Signal<TypesOf<DialogPrimitive>["state"]> = this.handle.state

  ngOnInit() {
    this.handle.init()
  }
}

/**
 * The button that opens the dialog.
 * @experimental
 */
@Directive({
  selector: "[uiDialogTrigger]",
  exportAs: "uiDialogTrigger",
  providers: [provideTrigger(dialog, () => UiDialogTrigger)],
})
class UiDialogTrigger implements OnInit, TriggerContext<typeof dialog> {
  /** What the dialog gets as its payload when this trigger opens it. */
  readonly payload = input<unknown>()
  /** Stops the trigger from opening the dialog. */
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
  /** Connects a trigger outside the dialog to the one with this controller. */
  readonly controller = input<DialogController<any, any>>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectConnectedPart(
    dialog,
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
  /** The dialog this trigger opens, once it's on the page. */
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
@Directive({ selector: "[uiDialogShortcut]", exportAs: "uiDialogShortcut" })
class UiDialogShortcut implements OnInit {
  /** The keys to show. Inside a trigger, its shortcut. */
  readonly shortcut = input<string>()
  readonly #part = injectShortcut(dialog, this.shortcut)
  /** The shortcut's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A dim behind the dialog, on the element it's written on: `<div *uiDialogBackdrop>`.
 * It's optional: without it, style the content's `::backdrop`.
 * @experimental
 */
@Directive({ selector: "[uiDialogBackdrop]" })
class UiDialogBackdrop implements OnInit {
  readonly #root = inject(UiDialog)
  readonly #part = injectPopupPart(
    injectHandle(dialog),
    "backdrop",
    undefined,
    {
      container: () => this.#root.container(),
    }
  )

  static ngTemplateContextGuard(
    _directive: UiDialogBackdrop,
    _context: unknown
  ): _context is PresentPartContext<DialogBackdropState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The dialog itself, on the element it's written on: `<div *uiDialogContent>`.
 * It's in the page while the dialog is open, named by its title and described
 * by its description. Presented as a sheet, it sits in a viewport the adapter
 * makes around it, styled by `[data-slot="dialog-viewport"]`.
 * @experimental
 */
@Directive({ selector: "[uiDialogContent]" })
class UiDialogContent implements OnInit {
  /** Where focus goes when the dialog opens: `*uiDialogContent="let state; initialFocus: 'content'"`. */
  readonly initialFocus = input<DialogInitialFocus>(undefined, {
    alias: "uiDialogContentInitialFocus",
  })
  /** Where focus goes when the dialog closes while focus is inside it. */
  readonly finalFocus: InputSignal<DialogFinalFocus | undefined> = input<
    DialogFinalFocus | undefined
  >(undefined, {
    alias: "uiDialogContentFinalFocus",
  })
  /** Keeps the dialog in the page, hidden, while closed, for animation libraries that drive the exit. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiDialogContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Where the dialog renders, instead of the root's `container`. */
  readonly container = input<DialogContentProps["container"]>(undefined, {
    alias: "uiDialogContentContainer",
  })
  readonly #props = computed(() => ({
    initialFocus: this.initialFocus(),
    finalFocus: this.finalFocus(),
    keepMounted: this.keepMounted(),
    container: this.container(),
  }))
  readonly #root = inject(UiDialog)
  readonly #part = injectPopupPart(
    injectHandle(dialog),
    "content",
    this.#props,
    {
      container: () => this.container() ?? this.#root.container(),
      viewport: "viewport",
    }
  )

  static ngTemplateContextGuard(
    _directive: UiDialogContent,
    _context: unknown
  ): _context is PresentPartContext<DialogContentState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The dialog's title, which names it.
 * @experimental
 */
@Directive({ selector: "[uiDialogTitle]", exportAs: "uiDialogTitle" })
class UiDialogTitle implements OnInit {
  readonly #part = injectPart(injectHandle(dialog), "title")
  /** The title's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Describes the dialog while it's rendered.
 * @experimental
 */
@Directive({
  selector: "[uiDialogDescription]",
  exportAs: "uiDialogDescription",
})
class UiDialogDescription implements OnInit {
  readonly #part = injectPart(injectHandle(dialog), "description")
  /** The description's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A button that closes the dialog. An `action` runs first, and a Promise it
 * returns keeps the dialog open until it settles.
 * @experimental
 */
@Directive({ selector: "[uiDialogClose]", exportAs: "uiDialogClose" })
class UiDialogClose implements OnInit {
  /** Reported as the dialog's `returnValue` when this closes it. */
  readonly value = input<string>()
  /** Runs before the dialog closes. A returned Promise keeps it open and pending until it settles. */
  readonly action =
    input<
      (
        event: Event | undefined,
        details: DialogCloseActionDetails
      ) => unknown | Promise<unknown>
    >()
  // Keyed by its own id, so several close buttons stay apart.
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(dialog), "close", () => ({
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

export { createDialogController } from "@ui-sdk/core/dialog"
export type {
  AlertDialogBackdropState,
  AlertDialogCloseActionDetails,
  AlertDialogCloseProps,
  AlertDialogCloseState,
  AlertDialogContentProps,
  AlertDialogContentState,
  AlertDialogController,
  AlertDialogOpenChangeReason,
  AlertDialogOptions,
  AlertDialogPayloadChangeReason,
  AlertDialogPrimitive,
  AlertDialogShortcutProps,
  AlertDialogShortcutState,
  AlertDialogTriggerProps,
  AlertDialogTriggerState,
  ConfirmEntry,
  ConfirmOptions,
  DialogApi,
  DialogBackdropState,
  DialogCloseActionDetails,
  DialogCloseProps,
  DialogCloseState,
  DialogContentProps,
  DialogContentState,
  DialogController,
  DialogDismissAttemptDetails,
  DialogDismissReason,
  DialogFinalFocus,
  DialogInitialFocus,
  DialogOpenChangeDetails,
  DialogOpenChangeReason,
  DialogOptions,
  DialogPayloadChangeReason,
  DialogPrimitive,
  DialogSharedOptions,
  DialogShortcutProps,
  DialogShortcutState,
  DialogTriggerProps,
  DialogTriggerState,
} from "@ui-sdk/core/dialog"

export {
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogShortcut,
  UiDialogTrigger,
}
