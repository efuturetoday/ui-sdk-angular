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
  waterfall,
  type ListHighlightDetails,
  type NumberFormat,
  type WaterfallBarLabelDetails,
  type WaterfallController,
  type WaterfallData,
  type WaterfallDataItem,
  type WaterfallExpandedChangeReason,
  type WaterfallPrimitive,
  type WaterfallValueChangeReason,
} from "@ui-sdk/core/waterfall"
import { injectDefaultText } from "./content"
import { optionalBoolean } from "./inputs"
import { injectPart } from "./part"
import {
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "./primitive"

type Value = string | null

/**
 * A timeline of spans, like a request's network waterfall, on the element
 * it's written on. Render a `uiWaterfallRow` for each of its `rows()`.
 * @experimental
 */
@Directive({
  selector: "[uiWaterfall]",
  exportAs: "uiWaterfall",
  providers: [provideRoot(waterfall, () => UiWaterfall)],
})
class UiWaterfall implements OnInit {
  /** The spans, with their start, end and children. */
  readonly items = input.required<WaterfallData>()
  /** The time range shown, if not the spans'. */
  readonly range = input<[number, number]>()
  /** The selected span. Bind it, or `[(value)]`, to control it. */
  readonly value = input<Value>()
  /** The selected span at first, when uncontrolled. */
  readonly defaultValue = input<Value>()
  /** The expanded spans. Bind it, or `[(expanded)]`, to control it. */
  readonly expanded = input<string[]>()
  /** The expanded spans at first, when uncontrolled. */
  readonly defaultExpanded = input<string[]>()
  /** How times read, as `Intl.NumberFormat` options or a function. */
  readonly format = input<NumberFormat>()
  /** The locale times are written in. */
  readonly locale = input<string>()
  /** What a screen reader says for a span's bar. */
  readonly getBarLabel =
    input<
      (item: WaterfallDataItem, details: WaterfallBarLabelDetails) => string
    >()
  /** Selects and expands spans from anywhere. Create one with `createWaterfallController()`. */
  readonly controller = input<WaterfallController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the selected span once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<Value>()
  /** Emits before the selection changes. `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: Value
    details: ChangeDetails<WaterfallValueChangeReason>
  }>()
  /** Emits the expanded spans once a change isn't canceled, for `[(expanded)]`. */
  readonly expandedChange = output<string[]>()
  /** Emits before spans expand or collapse. `details.cancel()` stops it. */
  readonly beforeExpandedChange = output<{
    expanded: string[]
    details: ChangeDetails<WaterfallExpandedChangeReason>
  }>()
  /** Emits as a span is highlighted. */
  readonly highlight = output<{
    value: string
    details: ListHighlightDetails
  }>()
  readonly handle: PrimitiveHandle<WaterfallPrimitive> = injectPrimitive(
    waterfall,
    () => ({
      items: this.items(),
      range: this.range(),
      value: this.value(),
      defaultValue: this.defaultValue(),
      expanded: this.expanded(),
      defaultExpanded: this.defaultExpanded(),
      format: this.format(),
      locale: this.locale(),
      getBarLabel: this.getBarLabel(),
      controller: this.controller(),
      debug: this.debug(),
      onValueChange: (
        value: Value,
        details: ChangeDetails<WaterfallValueChangeReason>
      ) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
      onExpandedChange: (
        expanded: string[],
        details: ChangeDetails<WaterfallExpandedChangeReason>
      ) => {
        this.beforeExpandedChange.emit({ expanded, details })
        if (!details.canceled) {
          this.expandedChange.emit(expanded)
        }
      },
      onHighlight: (value: string, details: ListHighlightDetails) =>
        this.highlight.emit({ value, details }),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The waterfall's state. */
  readonly state = this.#part.state
  /** Every span as a row, in order, to render a `uiWaterfallRow` for each. */
  readonly rows = computed(() => {
    this.handle.version()
    return this.handle.api.internal.all()
  })

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The row of column headers.
 * @experimental
 */
@Directive({
  selector: "[uiWaterfallHeaderRow]",
  exportAs: "uiWaterfallHeaderRow",
})
class UiWaterfallHeaderRow implements OnInit {
  readonly #part = injectPart(injectHandle(waterfall), "header-row")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A column's header.
 * @experimental
 */
@Directive({
  selector: "[uiWaterfallColumnHeader]",
  exportAs: "uiWaterfallColumnHeader",
})
class UiWaterfallColumnHeader implements OnInit {
  readonly #part = injectPart(injectHandle(waterfall), "column-header")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The time axis. Render a `uiWaterfallTick` for each of its `state().ticks`.
 * @experimental
 */
@Directive({ selector: "[uiWaterfallAxis]", exportAs: "uiWaterfallAxis" })
class UiWaterfallAxis implements OnInit {
  /** The most ticks it shows. */
  readonly maxTicks = input<number>()
  readonly #part = injectPart(injectHandle(waterfall), "axis", () => ({
    maxTicks: this.maxTicks(),
  }))
  /** The axis's state, with its `ticks`. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A time on the axis. Written empty, it shows the time.
 * @experimental
 */
@Directive({ selector: "[uiWaterfallTick]", exportAs: "uiWaterfallTick" })
class UiWaterfallTick implements OnInit {
  /** The time it marks. */
  readonly time = input.required<number>()
  readonly #part = injectPart(injectHandle(waterfall), "tick", () => ({
    time: this.time(),
  }))
  /** The tick's state, with its `label`. */
  readonly state = this.#part.state
  readonly #content = injectDefaultText(() => this.state().label)

  ngOnInit() {
    this.#content.decide()
    this.#part.init()
  }
}

/**
 * A line at a time across the rows, like an event.
 * @experimental
 */
@Directive({ selector: "[uiWaterfallMark]", exportAs: "uiWaterfallMark" })
class UiWaterfallMark implements OnInit {
  /** The time it marks. */
  readonly time = input.required<number>()
  readonly #part = injectPart(injectHandle(waterfall), "mark", () => ({
    time: this.time(),
  }))
  /** The mark's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A span's row, by its `value`.
 * @experimental
 */
@Directive({ selector: "[uiWaterfallRow]", exportAs: "uiWaterfallRow" })
class UiWaterfallRow implements OnInit {
  /** The span it shows. */
  readonly value = input.required<string>()
  readonly #part = injectPart(injectHandle(waterfall), "row", () => ({
    value: this.value(),
  }))
  /** The row's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

// A part inside a row, which takes its value.
function injectRowPart(slot: "row-header" | "indicator" | "cell" | "bar") {
  const row = inject(UiWaterfallRow)
  return injectPart(injectHandle(waterfall), slot, () => ({
    value: row.value(),
  }))
}

/**
 * The row's name.
 * @experimental
 */
@Directive({
  selector: "[uiWaterfallRowHeader]",
  exportAs: "uiWaterfallRowHeader",
})
class UiWaterfallRowHeader implements OnInit {
  readonly #part = injectRowPart("row-header")
  /** The row's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shows whether a span with children is expanded. Pressing it toggles them.
 * @experimental
 */
@Directive({
  selector: "[uiWaterfallIndicator]",
  exportAs: "uiWaterfallIndicator",
})
class UiWaterfallIndicator implements OnInit {
  readonly #part = injectRowPart("indicator")
  /** The row's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A cell of the row, for more columns.
 * @experimental
 */
@Directive({ selector: "[uiWaterfallCell]", exportAs: "uiWaterfallCell" })
class UiWaterfallCell implements OnInit {
  readonly #part = injectRowPart("cell")
  /** The row's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The span's bar, placed by its start and end.
 * @experimental
 */
@Directive({ selector: "[uiWaterfallBar]", exportAs: "uiWaterfallBar" })
class UiWaterfallBar implements OnInit {
  readonly #part = injectRowPart("bar")
  /** The row's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export {
  createWaterfallController,
  visibleWaterfallRows,
} from "@ui-sdk/core/waterfall"
export type {
  ListHighlightDetails,
  NumberFormat,
  WaterfallApi,
  WaterfallAxisProps,
  WaterfallAxisState,
  WaterfallBarLabelDetails,
  WaterfallChangeOptions,
  WaterfallController,
  WaterfallData,
  WaterfallDataItem,
  WaterfallDataRow,
  WaterfallExpandedChangeReason,
  WaterfallOptions,
  WaterfallPrimitive,
  WaterfallRowPartProps,
  WaterfallRowProps,
  WaterfallRowState,
  WaterfallState,
  WaterfallTickData,
  WaterfallTimeProps,
  WaterfallTimeState,
  WaterfallValueChangeReason,
} from "@ui-sdk/core/waterfall"

export {
  UiWaterfall,
  UiWaterfallAxis,
  UiWaterfallBar,
  UiWaterfallCell,
  UiWaterfallColumnHeader,
  UiWaterfallHeaderRow,
  UiWaterfallIndicator,
  UiWaterfallMark,
  UiWaterfallRow,
  UiWaterfallRowHeader,
  UiWaterfallTick,
}
