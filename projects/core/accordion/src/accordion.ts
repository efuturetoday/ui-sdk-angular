import { computed, Directive, inject, input, output } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  accordion,
  type AccordionController,
  type AccordionPanelState,
  type AccordionPrimitive,
  type AccordionValueChangeReason,
} from "@ui-sdk/core/accordion"
import {
  injectPart,
  injectPresentPart,
  type PresentPartContext,
  optionalBoolean,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
} from "@ngx-ui-sdk/core"

/**
 * A stack of items that each open a section of content. One item is open at a
 * time unless `multiple` is set.
 * @experimental
 */
@Directive({
  selector: "[uiAccordion]",
  exportAs: "uiAccordion",
  providers: [provideRoot(accordion, () => UiAccordion)],
})
class UiAccordion {
  /** The open items' values. Bind it, or `[(value)]`, to control the accordion. */
  readonly value = input<string[]>()
  /** The items open at first, when uncontrolled. */
  readonly defaultValue = input<string[]>()
  /** Whether several items can be open at once. Otherwise opening one closes the others. */
  readonly multiple = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the open item can close when only one may be open. With `false`, one item always stays open. */
  readonly collapsible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Stops every item from opening or closing. Triggers stay focusable. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether closed panels stay in the page, hidden. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps closed panels in the page as `hidden="until-found"`, so the browser's find in page opens them. */
  readonly hiddenUntilFound = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Opens and closes items from anywhere. Create one with `createAccordionController()`. */
  readonly controller = input<AccordionController>()
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string[]>()
  /** Emits before items open or close. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string[]
    details: ChangeDetails<AccordionValueChangeReason>
  }>()
  readonly handle: PrimitiveHandle<AccordionPrimitive> = injectPrimitive(
    accordion,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      multiple: this.multiple(),
      collapsible: this.collapsible(),
      disabled: this.disabled(),
      keepMounted: this.keepMounted(),
      hiddenUntilFound: this.hiddenUntilFound(),
      controller: this.controller(),
      onValueChange: (value, details) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The accordion's state. */
  readonly state = this.#part.state
}

/**
 * One item: a header with its trigger, and the panel the trigger opens.
 * @experimental
 */
@Directive({ selector: "[uiAccordionItem]", exportAs: "uiAccordionItem" })
class UiAccordionItem {
  /** Identifies the item. The accordion's value lists the open items' values. Defaults to a generated id. */
  readonly value = input<string>()
  /** Stops the item from opening or closing. Its trigger stays focusable. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new value once a change isn't canceled. */
  readonly openChange = output<boolean>()
  /** Emits before the item opens or closes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: ChangeDetails<AccordionValueChangeReason>
  }>()
  /** Emits once the item's panel has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  readonly #id = inject(UiIds).next()
  /** @internal The value its header, trigger and panel read. */
  readonly key = computed(() => this.value() ?? this.#id)
  readonly #part = injectPart(injectHandle(accordion), "item", () => ({
    value: this.key(),
    disabled: this.disabled(),
    onOpenChange: (
      open: boolean,
      details: ChangeDetails<AccordionValueChangeReason>
    ) => {
      this.beforeOpenChange.emit({ open, details })
      if (!details.canceled) {
        this.openChange.emit(open)
      }
    },
    onOpenChangeComplete: (open: boolean) => this.openChangeComplete.emit(open),
  }))
  /** The item's state. */
  readonly state = this.#part.state
}

/**
 * A heading around the trigger, so screen readers can move between items by
 * heading. Put it inside an item.
 * @experimental
 */
@Directive({ selector: "[uiAccordionHeader]", exportAs: "uiAccordionHeader" })
class UiAccordionHeader {
  readonly #item = inject(UiAccordionItem)
  readonly #part = injectPart(injectHandle(accordion), "header", () => ({
    value: this.#item.key(),
  }))
  /** The header's state. */
  readonly state = this.#part.state
}

/**
 * The button that opens and closes its item's panel. Put it inside the item's
 * header.
 * @experimental
 */
@Directive({
  selector: "[uiAccordionTrigger]",
  exportAs: "uiAccordionTrigger",
})
class UiAccordionTrigger {
  /** Stops this trigger from opening or closing the item. It stays focusable. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #item = inject(UiAccordionItem)
  readonly #part = injectPart(injectHandle(accordion), "trigger", () => ({
    value: this.#item.key(),
    disabled: this.disabled(),
  }))
  /** The trigger's state. */
  readonly state = this.#part.state
}

/**
 * The content its item's trigger shows and hides, on the element it's written
 * on: `<div *uiAccordionPanel>`. Closed, it leaves the page unless
 * `keepMounted` or `hiddenUntilFound` keeps it.
 * @experimental
 */
@Directive({ selector: "[uiAccordionPanel]" })
class UiAccordionPanel {
  /** Keeps the panel in the page, hidden, while closed: `*uiAccordionPanel="let state; keepMounted: true"`. Overrides the accordion's. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiAccordionPanelKeepMounted",
    transform: optionalBoolean,
  })
  /** Keeps the closed panel in the page with `hidden="until-found"`, so the browser's find-in-page opens it. Overrides the accordion's. */
  readonly hiddenUntilFound = input<boolean | undefined, unknown>(undefined, {
    alias: "uiAccordionPanelHiddenUntilFound",
    transform: optionalBoolean,
  })
  readonly #item = inject(UiAccordionItem)
  readonly #part = injectPresentPart(
    injectHandle(accordion),
    "panel",
    computed(() => ({
      value: this.#item.key(),
      keepMounted: this.keepMounted(),
      hiddenUntilFound: this.hiddenUntilFound(),
    }))
  )

  static ngTemplateContextGuard(
    _directive: UiAccordionPanel,
    _context: unknown
  ): _context is PresentPartContext<AccordionPanelState> {
    return true
  }
}

export { createAccordionController } from "@ui-sdk/core/accordion"
export type {
  AccordionApi,
  AccordionChangeOptions,
  AccordionController,
  AccordionHeaderProps,
  AccordionHeaderState,
  AccordionItemProps,
  AccordionItemState,
  AccordionOptions,
  AccordionPanelProps,
  AccordionPanelState,
  AccordionPrimitive,
  AccordionState,
  AccordionTriggerProps,
  AccordionTriggerState,
  AccordionValueChangeReason,
} from "@ui-sdk/core/accordion"

export {
  UiAccordion,
  UiAccordionHeader,
  UiAccordionItem,
  UiAccordionPanel,
  UiAccordionTrigger,
}
