import { computed, Directive, input, output, type OnInit } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  collapsible,
  type CollapsibleController,
  type CollapsibleOpenChangeReason,
  type CollapsiblePanelProps,
  type CollapsiblePanelState,
  type CollapsiblePrimitive,
} from "@ui-sdk/core/collapsible"
import {
  injectPart,
  injectPresentPart,
  type PresentPartContext,
  optionalBoolean,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "ngx-ui-sdk"

/**
 * A panel of content that a button shows and hides. Put its trigger and panel inside.
 * @experimental
 */
@Directive({
  selector: "[uiCollapsible]",
  exportAs: "uiCollapsible",
  providers: [provideRoot(collapsible, () => UiCollapsible)],
})
class UiCollapsible implements OnInit {
  /** Whether the panel is open. Bind it, or `[(open)]`, to control the collapsible. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the panel is open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Stops the trigger from opening or closing the panel. The trigger stays focusable. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Opens and closes the panel from anywhere. Create one with `createCollapsibleController()`. */
  readonly controller = input<CollapsibleController>()
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the panel opens or closes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: ChangeDetails<CollapsibleOpenChangeReason>
  }>()
  /** Emits once the panel has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  readonly handle: PrimitiveHandle<CollapsiblePrimitive> = injectPrimitive(
    collapsible,
    () => ({
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      disabled: this.disabled(),
      controller: this.controller(),
      onOpenChange: (open, details) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open) => this.openChangeComplete.emit(open),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The collapsible's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The button that opens and closes the panel. It says whether the panel is open with `aria-expanded`.
 * @experimental
 */
@Directive({
  selector: "[uiCollapsibleTrigger]",
  exportAs: "uiCollapsibleTrigger",
})
class UiCollapsibleTrigger implements OnInit {
  readonly #part = injectPart(injectHandle(collapsible), "trigger")
  /** The trigger's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The content the trigger shows and hides, on the element it's written on:
 * `<div *uiCollapsiblePanel>`. Closed, it leaves the page unless `keepMounted`
 * or `hiddenUntilFound` keeps it.
 * @experimental
 */
@Directive({ selector: "[uiCollapsiblePanel]" })
class UiCollapsiblePanel implements OnInit {
  /** Keeps the panel in the page, hidden, while closed: `*uiCollapsiblePanel="let state; keepMounted: true"`. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiCollapsiblePanelKeepMounted",
    transform: optionalBoolean,
  })
  /** Keeps the closed panel in the page with `hidden="until-found"`, so the browser's find-in-page opens it. */
  readonly hiddenUntilFound = input<boolean | undefined, unknown>(undefined, {
    alias: "uiCollapsiblePanelHiddenUntilFound",
    transform: optionalBoolean,
  })
  readonly #part = injectPresentPart(
    injectHandle(collapsible),
    "panel",
    computed(() => ({
      keepMounted: this.keepMounted(),
      hiddenUntilFound: this.hiddenUntilFound(),
    }))
  )

  static ngTemplateContextGuard(
    _directive: UiCollapsiblePanel,
    _context: unknown
  ): _context is PresentPartContext<CollapsiblePanelState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

export { createCollapsibleController } from "@ui-sdk/core/collapsible"
export type {
  CollapsibleApi,
  CollapsibleChangeOptions,
  CollapsibleController,
  CollapsibleOpenChangeReason,
  CollapsibleOptions,
  CollapsiblePanelProps,
  CollapsiblePanelState,
  CollapsiblePrimitive,
  CollapsibleState,
  CollapsibleTriggerProps,
  CollapsibleTriggerState,
} from "@ui-sdk/core/collapsible"

export { UiCollapsible, UiCollapsiblePanel, UiCollapsibleTrigger }
