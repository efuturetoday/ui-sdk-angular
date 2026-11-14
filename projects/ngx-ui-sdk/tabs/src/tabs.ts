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
  tabs,
  type TabsController,
  type TabsOrientation,
  type TabsPanelState,
  type TabsPrimitive,
  type TabsValueChangeReason,
} from "@ui-sdk/core/tabs"
import {
  optionalBoolean,
  injectPart,
  injectPresentPart,
  type PresentPartContext,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
} from "ngx-ui-sdk"

/**
 * A set of tabs, each showing its own panel. Put its list and panels inside.
 * @experimental
 */
@Directive({
  selector: "[uiTabs]",
  exportAs: "uiTabs",
  providers: [provideRoot(tabs, () => UiTabs)],
})
class UiTabs implements OnInit {
  /** The selected tab's value. Bind it, or `[(value)]`, to control the tabs. `null` selects nothing. */
  readonly value = input<string | null>()
  /** The tab selected at first, when uncontrolled. Defaults to the first enabled tab. */
  readonly defaultValue = input<string | null>()
  /** Which arrow keys move between tabs: left and right, or up and down. */
  readonly orientation = input<TabsOrientation>()
  /** `"automatic"` selects a tab as soon as arrow keys focus it. `"manual"` waits for Enter or Space. */
  readonly activation = input<"automatic" | "manual">()
  /** Whether arrow keys wrap from the last tab to the first. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps hidden panels in the page as `hidden="until-found"`, so the browser's find in page selects their tab. */
  readonly hiddenUntilFound = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Selects tabs from anywhere. Create one with `createTabsController()`. */
  readonly controller = input<TabsController>()
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string | null>()
  /** Emits before the selection changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string | null
    details: ChangeDetails<TabsValueChangeReason>
  }>()
  readonly handle: PrimitiveHandle<TabsPrimitive> = injectPrimitive(
    tabs,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      orientation: this.orientation(),
      activation: this.activation(),
      loop: this.loop(),
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
  /** The tabs' state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The row of tabs, which arrow keys move through.
 * @experimental
 */
@Directive({ selector: "[uiTabsList]", exportAs: "uiTabsList" })
class UiTabsList implements OnInit {
  readonly #part = injectPart(injectHandle(tabs), "list")
  /** The list's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A tab, a `<button>` or a link, that selects the panel with its `value`.
 * @experimental
 */
@Directive({ selector: "[uiTabsTab]", exportAs: "uiTabsTab" })
class UiTabsTab implements OnInit {
  /** Identifies the tab and pairs it with the panel of the same value. */
  readonly value = input.required<string>()
  /** Keeps the tab focusable but stops it from being selected. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #part = injectPart(injectHandle(tabs), "tab", () => ({
    value: this.value(),
    disabled: this.disabled(),
  }))
  /** The tab's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An icon inside a tab. Screen readers skip it, and `mirror` flips it in
 * right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiTabsTabIcon]", exportAs: "uiTabsTabIcon" })
class UiTabsTabIcon implements OnInit {
  /** Flips it in right-to-left text, for icons that point a way. */
  readonly mirror = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #tab = inject(UiTabsTab)
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(tabs), "tab-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
    item: this.#tab.value(),
  }))
  /** The icon's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A mark that follows the selected tab. It reads the tab's box from the CSS
 * variables `--active-tab-left`, `--active-tab-width` and the rest.
 * @experimental
 */
@Directive({ selector: "[uiTabsIndicator]", exportAs: "uiTabsIndicator" })
class UiTabsIndicator implements OnInit {
  readonly #part = injectPart(injectHandle(tabs), "indicator")
  /** The indicator's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The content of the tab with the same value, on the element it's written on:
 * `<div *uiTabsPanel="'account'">`. It's there only while its tab is selected,
 * unless `keepMounted` or `hiddenUntilFound` keeps it.
 * @experimental
 */
@Directive({ selector: "[uiTabsPanel]" })
class UiTabsPanel implements OnInit {
  /** The value of the tab this panel belongs to. */
  readonly value = input.required<string>({ alias: "uiTabsPanel" })
  /** Keeps the panel in the page, hidden, while its tab isn't selected: `*uiTabsPanel="'account'; keepMounted: true"`. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiTabsPanelKeepMounted",
    transform: optionalBoolean,
  })
  /** Keeps the hidden panel findable with `hidden="until-found"`. Overrides the tabs'. */
  readonly hiddenUntilFound = input<boolean | undefined, unknown>(undefined, {
    alias: "uiTabsPanelHiddenUntilFound",
    transform: optionalBoolean,
  })
  readonly #part = injectPresentPart(
    injectHandle(tabs),
    "panel",
    computed(() => ({
      value: this.value(),
      keepMounted: this.keepMounted(),
      hiddenUntilFound: this.hiddenUntilFound(),
    }))
  )

  static ngTemplateContextGuard(
    _directive: UiTabsPanel,
    _context: unknown
  ): _context is PresentPartContext<TabsPanelState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

export { createTabsController } from "@ui-sdk/core/tabs"
export type {
  TabsApi,
  TabsChangeOptions,
  TabsController,
  TabsDirection,
  TabsIndicatorState,
  TabsListState,
  TabsOptions,
  TabsOrientation,
  TabsPanelProps,
  TabsPanelState,
  TabsPrimitive,
  TabsState,
  TabsTabIconProps,
  TabsTabIconState,
  TabsTabProps,
  TabsTabState,
  TabsValueChangeReason,
} from "@ui-sdk/core/tabs"

export {
  UiTabs,
  UiTabsIndicator,
  UiTabsList,
  UiTabsPanel,
  UiTabsTab,
  UiTabsTabIcon,
}
