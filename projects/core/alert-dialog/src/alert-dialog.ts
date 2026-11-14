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
import {
  alertDialog,
  type AlertDialogBackdropState,
  type AlertDialogCloseActionDetails,
  type AlertDialogContentProps,
  type AlertDialogContentState,
  type AlertDialogController,
  type AlertDialogOpenChangeReason,
  type AlertDialogPayloadChangeReason,
  type AlertDialogPrimitive,
} from "@ui-sdk/core/alert-dialog"
import type {
  DialogDismissAttemptDetails,
  DialogFinalFocus,
  DialogInitialFocus,
  DialogOpenChangeDetails,
} from "@ui-sdk/core/dialog"
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
 * A dialog that interrupts to ask for a decision, like confirming a delete.
 * An outside press never closes it. It renders no element of its own, so it
 * goes on an `ng-container` around its trigger and content.
 * @experimental
 */
@Directive({
  selector: "[uiAlertDialog]",
  exportAs: "uiAlertDialog",
  providers: [provideRoot(alertDialog, () => UiAlertDialog)],
})
class UiAlertDialog implements OnInit {
  /** Whether the alert dialog is open. Bind it, or `[(open)]`, to control it. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether it's open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether Escape may close it, `true` by default. */
  readonly dismissible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Renders the popup into this element instead of in place. */
  readonly container = input<Element | DocumentFragment | null>()
  /** Elements outside that stay live while it's open. */
  readonly persistentElements = input<
    (Element | string)[] | (() => Element[])
  >()
  /** What a screen reader announces while a close action is pending. */
  readonly pendingAnnouncement = input<string>()
  /** Opens and closes it from anywhere, like `createConfirm()`'s controller. */
  readonly controller = input<AlertDialogController<any, any>>()
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before it opens or closes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: DialogOpenChangeDetails<AlertDialogOpenChangeReason>
  }>()
  /** Emits once it has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when a dismissal is refused, like Escape on one that isn't `dismissible`. */
  readonly dismissAttempt = output<DialogDismissAttemptDetails>()
  /** Emits when the payload a trigger or the controller passed changes. */
  readonly payloadChange = output<{
    payload: unknown
    details: ChangeDetails<AlertDialogPayloadChangeReason>
  }>()
  readonly handle: PrimitiveHandle<AlertDialogPrimitive> = injectPrimitive(
    alertDialog,
    () => ({
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      dismissible: this.dismissible(),
      container: this.container(),
      persistentElements: this.persistentElements(),
      pendingAnnouncement: this.pendingAnnouncement(),
      controller: this.controller(),
      onOpenChange: (open, details) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open) => this.openChangeComplete.emit(open),
      onDismissAttempt: (details) => this.dismissAttempt.emit(details),
      onPayloadChange: (payload, details) =>
        this.payloadChange.emit({ payload, details }),
    })
  )
  /** The alert dialog's state. */
  readonly state: Signal<TypesOf<AlertDialogPrimitive>["state"]> =
    this.handle.state

  ngOnInit() {
    this.handle.init()
  }
}

/**
 * The button that opens the alert dialog.
 * @experimental
 */
@Directive({
  selector: "[uiAlertDialogTrigger]",
  exportAs: "uiAlertDialogTrigger",
  providers: [provideTrigger(alertDialog, () => UiAlertDialogTrigger)],
})
class UiAlertDialogTrigger implements TriggerContext<typeof alertDialog> {
  /** What the alert dialog gets as its payload when this trigger opens it. */
  readonly payload = input<unknown>()
  /** Stops the trigger from opening the alert dialog. */
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
  /** Connects a trigger outside the alert dialog to the one with this controller. */
  readonly controller = input<AlertDialogController<any, any>>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectConnectedPart(
    alertDialog,
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
  /** The alert dialog this trigger opens, once it's on the page. */
  readonly target = this.#part.target
  /** The trigger's state. */
  readonly state = this.#part.state
}

/**
 * Shows a trigger's shortcut, like `⌘K`, inside the trigger. Hidden from
 * screen readers, which hear `aria-keyshortcuts`. Left empty, it shows the keys.
 * @experimental
 */
@Directive({
  selector: "[uiAlertDialogShortcut]",
  exportAs: "uiAlertDialogShortcut",
})
class UiAlertDialogShortcut implements OnInit {
  /** The keys to show. Inside a trigger, its shortcut. */
  readonly shortcut = input<string>()
  readonly #part = injectShortcutPart(alertDialog, this.shortcut)
  /** The shortcut's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A dim behind the alert dialog, on the element it's written on: `<div *uiAlertDialogBackdrop>`.
 * @experimental
 */
@Directive({ selector: "[uiAlertDialogBackdrop]" })
class UiAlertDialogBackdrop implements OnInit {
  readonly #root = inject(UiAlertDialog)
  readonly #part = injectPopupPart(
    injectHandle(alertDialog),
    "backdrop",
    undefined,
    {
      container: () => this.#root.container(),
    }
  )

  static ngTemplateContextGuard(
    _directive: UiAlertDialogBackdrop,
    _context: unknown
  ): _context is PresentPartContext<AlertDialogBackdropState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The alert dialog itself, on the element it's written on:
 * `<div *uiAlertDialogContent>`. It's named by its title and described by its description.
 * @experimental
 */
@Directive({ selector: "[uiAlertDialogContent]" })
class UiAlertDialogContent implements OnInit {
  /** Where focus goes when the dialog opens: `*uiAlertDialogContent="let state; initialFocus: 'content'"`. */
  readonly initialFocus = input<DialogInitialFocus>(undefined, {
    alias: "uiAlertDialogContentInitialFocus",
  })
  /** Where focus goes when the dialog closes while focus is inside it. */
  readonly finalFocus: InputSignal<DialogFinalFocus | undefined> = input<
    DialogFinalFocus | undefined
  >(undefined, {
    alias: "uiAlertDialogContentFinalFocus",
  })
  /** Keeps the dialog in the page, hidden, while closed, for animation libraries that drive the exit. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiAlertDialogContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Where the dialog renders, instead of the root's `container`. */
  readonly container = input<AlertDialogContentProps["container"]>(undefined, {
    alias: "uiAlertDialogContentContainer",
  })
  readonly #props = computed(() => ({
    initialFocus: this.initialFocus(),
    finalFocus: this.finalFocus(),
    keepMounted: this.keepMounted(),
    container: this.container(),
  }))
  readonly #root = inject(UiAlertDialog)
  readonly #part = injectPopupPart(
    injectHandle(alertDialog),
    "content",
    this.#props,
    {
      container: () => this.container() ?? this.#root.container(),
    }
  )

  static ngTemplateContextGuard(
    _directive: UiAlertDialogContent,
    _context: unknown
  ): _context is PresentPartContext<AlertDialogContentState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The alert dialog's title, which names it.
 * @experimental
 */
@Directive({
  selector: "[uiAlertDialogTitle]",
  exportAs: "uiAlertDialogTitle",
})
class UiAlertDialogTitle implements OnInit {
  readonly #part = injectPart(injectHandle(alertDialog), "title")
  /** The title's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Describes the alert dialog.
 * @experimental
 */
@Directive({
  selector: "[uiAlertDialogDescription]",
  exportAs: "uiAlertDialogDescription",
})
class UiAlertDialogDescription implements OnInit {
  readonly #part = injectPart(injectHandle(alertDialog), "description")
  /** The description's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A button that closes the alert dialog, reporting its `value` as the result.
 * @experimental
 */
@Directive({
  selector: "[uiAlertDialogClose]",
  exportAs: "uiAlertDialogClose",
})
class UiAlertDialogClose implements OnInit {
  /** Reported as the alert dialog's `returnValue` when this closes it. */
  readonly value = input<string>()
  /** Runs before it closes. A returned Promise keeps it open and pending until it settles. */
  readonly action =
    input<
      (
        event: Event | undefined,
        details: AlertDialogCloseActionDetails
      ) => unknown | Promise<unknown>
    >()
  // Keyed by its own id, so several close buttons stay apart.
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(alertDialog), "close", () => ({
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

export {
  confirm,
  createAlertDialogController,
  createConfirm,
} from "@ui-sdk/core/alert-dialog"
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
} from "@ui-sdk/core/alert-dialog"

export {
  UiAlertDialog,
  UiAlertDialogBackdrop,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogDescription,
  UiAlertDialogTitle,
  UiAlertDialogShortcut,
  UiAlertDialogTrigger,
}
