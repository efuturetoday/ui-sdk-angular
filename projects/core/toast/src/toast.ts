import {
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  input,
  type Provider,
  Renderer2,
} from "@angular/core"
import {
  toast as globalToaster,
  toastRegion,
  type Toast,
  type Toaster,
  type ToastActionProps,
  type ToastCloseProps,
  type ToastRegionPrimitive,
} from "@ui-sdk/core/toast"
import {
  optionalBoolean,
  injectPart,
  injectPresentPart,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
  showText,
  TextSource,
} from "@ngx-ui-sdk/core"

/**
 * The toaster `inject(TOASTER)` gives and a region shows without its own
 * `toaster`: core's `toast` unless `provideToaster` names another.
 * @experimental
 */
const TOASTER = new InjectionToken<Toaster<any>>("toaster", {
  providedIn: "root",
  factory: () => globalToaster,
})

/**
 * Provides a toaster for `inject(TOASTER)` and the regions below, like one
 * made with `createToaster()`.
 * @experimental
 */
function provideToaster(toaster: Toaster<any>) {
  return { provide: TOASTER, useValue: toaster } satisfies Provider
}

/**
 * Shows a toaster's toasts, once, like in the app's root. Render them from
 * its state: `@for (item of region.state().toasts; track item.toast.id)`,
 * in a `uiToastList`.
 * @experimental
 */
@Directive({
  selector: "[uiToastRegion]",
  exportAs: "uiToastRegion",
  providers: [provideRoot(toastRegion, () => UiToastRegion)],
})
class UiToastRegion {
  /** The toaster whose toasts it shows; the one `TOASTER` gives by default. */
  readonly toaster = input<Toaster<any>>()
  /** The edge it sits on. */
  readonly side = input<"top" | "bottom">()
  /** Where along that edge. */
  readonly align = input<"start" | "center" | "end">()
  /** How many toasts show at once; the rest wait. */
  readonly maxVisible = input<number>()
  /** Shows the toasts spread out instead of stacked. */
  readonly expanded = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The keys that move focus into the region, like `"F8"`, or `null` for none. */
  readonly shortcut = input<string | null>()
  /** What a screen reader announces while an action is pending. */
  readonly pendingAnnouncement = input<string>()
  /** @internal Set by the overlay host, whose regions give way to placed ones. */
  readonly hosted = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Logs the toasts' timers to the console. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #injected = inject(TOASTER)
  readonly #el = inject(ElementRef).nativeElement as HTMLElement
  readonly handle: PrimitiveHandle<ToastRegionPrimitive> = injectPrimitive(
    toastRegion,
    () => ({
      toaster: this.toaster() ?? this.#injected,
      side: this.side(),
      align: this.align(),
      maxVisible: this.maxVisible(),
      expanded: this.expanded(),
      shortcut: this.shortcut(),
      pendingAnnouncement: this.pendingAnnouncement(),
      debug: this.debug(),
      placed: !this.hosted(),
      label: this.#label,
    })
  )
  // The landmark's name, which core writes only while it holds toasts.
  readonly #label = this.#el.getAttribute("aria-label") ?? undefined
  readonly #part = injectPart(this.handle, "region")
  /** The region's state, with its `toasts`. */
  readonly state = this.#part.state

  constructor() {
    inject(Renderer2).removeAttribute(this.#el, "aria-label")
  }
}

/**
 * The list the toasts sit in, inside the region: `<ol uiToastList>`.
 * @experimental
 */
@Directive({ selector: "[uiToastList]", exportAs: "uiToastList" })
class UiToastList {
  readonly #part = injectPart(inject(UiToastRegion).handle, "list")
}

/**
 * One toast, given its data from the region's state:
 * `<li [uiToast]="item.toast">`. Swipe it toward the region's side, or press
 * Escape on it, to dismiss it.
 * @experimental
 */
@Directive({ selector: "[uiToast]", exportAs: "uiToast" })
class UiToast {
  /** The toast it shows, from the region's `state().toasts`. */
  readonly toast = input.required<Toast<any>>({ alias: "uiToast" })
  /** @internal The region it's in. */
  readonly region = inject(UiToastRegion)
  readonly #part = injectPart(this.region.handle, "root", () => ({
    id: this.toast().id,
  }))
  /** The toast's state. */
  readonly state = this.#part.state
}

// A toast's title or description, while the toast has one.
function injectToastText(slot: "title" | "description") {
  const toast = inject(UiToast)
  return injectPresentPart(
    () => (toast.toast()[slot] != null ? toast.region.handle : undefined),
    slot,
    () => ({ id: toast.toast().id })
  )
}

/**
 * The toast's title, on the element it's written on: `<div *uiToastTitle>`.
 * Rendered while the toast has a `title`; with `uiText`, it shows it.
 * @experimental
 */
@Directive({
  selector: "[uiToastTitle]",
  providers: [{ provide: TextSource, useExisting: UiToastTitle }],
})
class UiToastTitle implements TextSource {
  readonly #toast = inject(UiToast)
  readonly #part = injectToastText("title")
  /** Shows the toast's title where `uiText` is. */
  readonly attach = showText(() => String(this.#toast.toast().title ?? ""))
}

/**
 * The toast's description, on the element it's written on:
 * `<div *uiToastDescription>`. Rendered while the toast has a `description`;
 * with `uiText`, it shows it.
 * @experimental
 */
@Directive({
  selector: "[uiToastDescription]",
  providers: [{ provide: TextSource, useExisting: UiToastDescription }],
})
class UiToastDescription implements TextSource {
  readonly #toast = inject(UiToast)
  readonly #part = injectToastText("description")
  /** Shows the toast's description where `uiText` is. */
  readonly attach = showText(() =>
    String(this.#toast.toast().description ?? "")
  )
}

/**
 * The toast's action, like Undo, on the element it's written on:
 * `<button *uiToastAction>`. Rendered while the toast has an `action`, or
 * with its own `onAction`; with `uiText`, it shows the action's label. A
 * Promise from the handler keeps the toast open and the button pending.
 * @experimental
 */
@Directive({
  selector: "[uiToastAction]",
  providers: [{ provide: TextSource, useExisting: UiToastAction }],
})
class UiToastAction implements TextSource {
  /** Runs instead of the toast's own `action.onAction`: `*uiToastAction="let state; onAction: undo"`. */
  readonly onAction = input<ToastActionProps["onAction"]>(undefined, {
    alias: "uiToastActionOnAction",
  })
  /** Whether pressing it dismisses the toast, by default the action's `dismiss`, else true. */
  readonly dismiss = input<boolean | undefined, unknown>(undefined, {
    alias: "uiToastActionDismiss",
    transform: optionalBoolean,
  })
  readonly #toast = inject(UiToast)
  readonly #id = inject(UiIds).next()
  readonly #part = injectPresentPart(
    () =>
      this.#toast.toast().action || this.onAction()
        ? this.#toast.region.handle
        : undefined,
    "action",
    () => ({
      id: this.#id,
      toast: this.#toast.toast().id,
      onAction: this.onAction(),
      dismiss: this.dismiss(),
    })
  )

  /** Shows the action's label where `uiText` is. */
  readonly attach = showText(() =>
    String(this.#toast.toast().action?.label ?? "")
  )
}

/**
 * Closes the toast. With an `action`, runs it first, and a returned Promise
 * keeps the toast open until it settles.
 * @experimental
 */
@Directive({ selector: "[uiToastClose]", exportAs: "uiToastClose" })
class UiToastClose {
  /** Runs before the toast closes. A returned Promise keeps it open and pending until it settles. */
  readonly action = input<ToastCloseProps["action"]>()
  readonly #toast = inject(UiToast)
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(this.#toast.region.handle, "close", () => ({
    id: this.#id,
    toast: this.#toast.toast().id,
    action: this.action(),
  }))
  /** The button's state, with `pending` while its action runs. */
  readonly state = this.#part.state
}

export { createToaster, toast } from "@ui-sdk/core/toast"
export type {
  Toast,
  ToastAction,
  ToastActionDetails,
  ToastActionProps,
  ToastButtonState,
  ToastCancel,
  ToastCloseProps,
  ToastDismissDetails,
  ToastDismissReason,
  Toaster,
  ToastItem,
  ToastOptions,
  ToastPauseReason,
  ToastRegionOptions,
  ToastRegionPrimitive,
  ToastRegionState,
  ToastState,
  ToastType,
} from "@ui-sdk/core/toast"

export {
  provideToaster,
  TOASTER,
  UiToast,
  UiToastAction,
  UiToastClose,
  UiToastDescription,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
}
