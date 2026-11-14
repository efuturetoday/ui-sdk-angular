import { Directive, inject, input, output } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  calendar,
  type CalendarAnchorChangeReason,
  type CalendarController,
  type CalendarFocusedChangeReason,
  type CalendarMode,
  type CalendarMonthChangeReason,
  type CalendarPrimitive,
  type CalendarValue,
  type CalendarValueChangeReason,
  type DateMatchers,
  type ISOMonth,
} from "@ui-sdk/core/calendar"
import {
  optionalBoolean,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  TextSource,
  showText,
} from "@ngx-ui-sdk/core"

/**
 * Why the selected dates change.
 * @experimental
 */
type CalendarValueChangeDetails = ChangeDetails<CalendarValueChangeReason>

/**
 * Why the shown month changes.
 * @experimental
 */
type CalendarMonthChangeDetails = ChangeDetails<CalendarMonthChangeReason>

/**
 * A month grid to pick a date, a range or several dates, on the element it's
 * written on. Render its grids, weekdays, weeks and days from their states.
 * @experimental
 */
@Directive({
  selector: "[uiCalendar]",
  exportAs: "uiCalendar",
  providers: [provideRoot(calendar, () => UiCalendar)],
})
class UiCalendar {
  /** What it picks: one date, a range, or several dates. */
  readonly mode = input<CalendarMode>()
  /** The selected date, range or dates. Bind it, or `[(value)]`, to control it. */
  readonly value = input<CalendarValue>()
  /** The selection at first, when uncontrolled. */
  readonly defaultValue = input<CalendarValue>()
  /** The first shown month, like `"2026-11"`. Bind it, or `[(month)]`, to control it. */
  readonly month = input<ISOMonth>()
  /** The first shown month at first, when uncontrolled. */
  readonly defaultMonth = input<ISOMonth>()
  /** The earliest date that can be picked, like `"2026-01-01"`. */
  readonly min = input<string>()
  /** The latest date that can be picked. */
  readonly max = input<string>()
  /** Dates that can't be picked: dates, ranges, weekdays or a function. */
  readonly unavailable = input<DateMatchers>()
  /** Stops it from changing. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Shows the selection without letting it change. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether pressing the selected date selects nothing. */
  readonly deselectable = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** How many months show side by side. */
  readonly months = input<number>()
  /** Whether the steps move a month, or all shown months. */
  readonly pageBy = input<"month" | "page">()
  /** The locale dates are written in. */
  readonly locale = input<string>()
  /** The day a week starts on, from 0 for Sunday. */
  readonly weekStartsOn = input<number>()
  /** How weekday names are written. */
  readonly weekdayFormat = input<"narrow" | "short" | "long">()
  /** How month names are written in the month select. */
  readonly monthFormat = input<"narrow" | "short" | "long">()
  /** Whether every month shows six weeks. */
  readonly fixedWeeks = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether days of the months around show. */
  readonly showOutsideDays = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Today, if not the clock's, like `"2026-11-14"`. */
  readonly today = input<string>()
  /** The time zone today is read in. */
  readonly timeZone = input<string>()
  /** The fewest days a range can hold. */
  readonly minDays = input<number>()
  /** The most days a range can hold. */
  readonly maxDays = input<number>()
  /** Whether a range may hold unavailable dates. */
  readonly allowUnavailable = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Selects and shows dates from anywhere. Create one with `createCalendarController()`. */
  readonly controller = input<CalendarController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new selection once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<CalendarValue>()
  /** Emits before the selection changes. `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: CalendarValue
    details: CalendarValueChangeDetails
  }>()
  /** Emits the new month once a change isn't canceled, for `[(month)]`. */
  readonly monthChange = output<ISOMonth>()
  /** Emits before the shown month changes. `details.cancel()` stops it. */
  readonly beforeMonthChange = output<{
    month: ISOMonth
    details: CalendarMonthChangeDetails
  }>()
  /** Emits as the focused date moves. */
  readonly focusedChange = output<{
    date: string
    details: ChangeDetails<CalendarFocusedChangeReason>
  }>()
  /** Emits as a range's first picked date changes. */
  readonly anchorChange = output<{
    anchor: string | null
    details: ChangeDetails<CalendarAnchorChangeReason>
  }>()
  readonly handle: PrimitiveHandle<CalendarPrimitive> = injectPrimitive(
    calendar,
    () => ({
      mode: this.mode(),
      value: this.value(),
      defaultValue: this.defaultValue(),
      month: this.month(),
      defaultMonth: this.defaultMonth(),
      min: this.min(),
      max: this.max(),
      unavailable: this.unavailable(),
      disabled: this.disabled(),
      readOnly: this.readOnly(),
      deselectable: this.deselectable(),
      months: this.months(),
      pageBy: this.pageBy(),
      locale: this.locale(),
      weekStartsOn: this.weekStartsOn(),
      weekdayFormat: this.weekdayFormat(),
      monthFormat: this.monthFormat(),
      fixedWeeks: this.fixedWeeks(),
      showOutsideDays: this.showOutsideDays(),
      today: this.today(),
      timeZone: this.timeZone(),
      minDays: this.minDays(),
      maxDays: this.maxDays(),
      allowUnavailable: this.allowUnavailable(),
      controller: this.controller(),
      debug: this.debug(),
      onValueChange: (
        value: CalendarValue,
        details: CalendarValueChangeDetails
      ) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
      onMonthChange: (month: ISOMonth, details: CalendarMonthChangeDetails) => {
        this.beforeMonthChange.emit({ month, details })
        if (!details.canceled) {
          this.monthChange.emit(month)
        }
      },
      onFocusedChange: (
        date: string,
        details: ChangeDetails<CalendarFocusedChangeReason>
      ) => this.focusedChange.emit({ date, details }),
      onAnchorChange: (
        anchor: string | null,
        details: ChangeDetails<CalendarAnchorChangeReason>
      ) => this.anchorChange.emit({ anchor, details }),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The calendar's state. */
  readonly state = this.#part.state
}

/**
 * The shown month's name. With `uiText`, it shows it.
 * @experimental
 */
@Directive({
  providers: [{ provide: TextSource, useExisting: UiCalendarHeading }],
  selector: "[uiCalendarHeading]",
  exportAs: "uiCalendarHeading",
})
class UiCalendarHeading implements TextSource {
  readonly #part = injectPart(injectHandle(calendar), "heading")
  /** The heading's state, with its `label`. */
  readonly state = this.#part.state
  /** Shows the part's text where `uiText` is. */
  readonly attach = showText(() => this.state().label)
}

/**
 * A `<select>` of months. Render its `<option>`s from `state().options`.
 * @experimental
 */
@Directive({
  selector: "select[uiCalendarMonthSelect]",
  exportAs: "uiCalendarMonthSelect",
})
class UiCalendarMonthSelect {
  readonly #part = injectPart(injectHandle(calendar), "month-select")
  /** The select's state, with its `options` and `value`. */
  readonly state = this.#part.state
}

/**
 * A `<select>` of years. Render its `<option>`s from `state().options`.
 * @experimental
 */
@Directive({
  selector: "select[uiCalendarYearSelect]",
  exportAs: "uiCalendarYearSelect",
})
class UiCalendarYearSelect {
  readonly #part = injectPart(injectHandle(calendar), "year-select")
  /** The select's state, with its `options` and `value`. */
  readonly state = this.#part.state
}

/**
 * Shows the month before. With `uiText`, it shows "‹".
 * @experimental
 */
@Directive({
  providers: [{ provide: TextSource, useExisting: UiCalendarPrevious }],
  selector: "[uiCalendarPrevious]",
  exportAs: "uiCalendarPrevious",
})
class UiCalendarPrevious implements TextSource {
  readonly #part = injectPart(injectHandle(calendar), "previous")
  /** The step's state. */
  readonly state = this.#part.state
  /** Shows the part's text where `uiText` is. */
  readonly attach = showText(() => "‹")
}

/**
 * Shows the month after. With `uiText`, it shows "›".
 * @experimental
 */
@Directive({
  providers: [{ provide: TextSource, useExisting: UiCalendarNext }],
  selector: "[uiCalendarNext]",
  exportAs: "uiCalendarNext",
})
class UiCalendarNext implements TextSource {
  readonly #part = injectPart(injectHandle(calendar), "next")
  /** The step's state. */
  readonly state = this.#part.state
  /** Shows the part's text where `uiText` is. */
  readonly attach = showText(() => "›")
}

/**
 * One month's `<table>`, `offset` months after the first shown. Render its
 * weekdays and weeks from `state()`.
 * @experimental
 */
@Directive({ selector: "[uiCalendarGrid]", exportAs: "uiCalendarGrid" })
class UiCalendarGrid {
  /** Which shown month it is, from 0. */
  readonly offset = input(0)
  readonly #part = injectPart(injectHandle(calendar), "grid", () => ({
    offset: this.offset(),
    id: String(this.offset()),
  }))
  /** The grid's state, with its `weekdays` and `weeks`. */
  readonly state = this.#part.state
}

/**
 * The `<tr>` of weekday names, inside the grid's `<thead>`.
 * @experimental
 */
@Directive({
  selector: "[uiCalendarWeekdays]",
  exportAs: "uiCalendarWeekdays",
})
class UiCalendarWeekdays {
  readonly #grid = inject(UiCalendarGrid)
  readonly #part = injectPart(injectHandle(calendar), "weekdays", () => ({
    id: String(this.#grid.offset()),
  }))
}

/**
 * A weekday's name, by its `index` in the week. With `uiText`, it shows it.
 * @experimental
 */
@Directive({
  selector: "[uiCalendarWeekday]",
  exportAs: "uiCalendarWeekday",
  providers: [{ provide: TextSource, useExisting: UiCalendarWeekday }],
})
class UiCalendarWeekday implements TextSource {
  /** Its place in the week, from 0. */
  readonly index = input.required<number>()
  readonly #grid = inject(UiCalendarGrid)
  readonly #part = injectPart(injectHandle(calendar), "weekday", () => ({
    index: this.index(),
    id: `${this.#grid.offset()}-${this.index()}`,
  }))
  /** The weekday's state, with its `label`. */
  readonly state = this.#part.state
  /** Shows the part's text where `uiText` is. */
  readonly attach = showText(() => this.state().label)
}

/**
 * A week's `<tr>`, by its `index` in the grid's weeks.
 * @experimental
 */
@Directive({ selector: "[uiCalendarWeek]", exportAs: "uiCalendarWeek" })
class UiCalendarWeek {
  /** Its place in the grid's weeks, from 0. */
  readonly index = input.required<number>()
  readonly #grid = inject(UiCalendarGrid)
  readonly #part = injectPart(injectHandle(calendar), "week", () => ({
    id: `${this.#grid.offset()}-${this.index()}`,
  }))
}

/**
 * A day's `<td>`, by its date. With `uiText`, it shows the day's number.
 * @experimental
 */
@Directive({
  providers: [{ provide: TextSource, useExisting: UiCalendarDay }],
  selector: "[uiCalendarDay]",
  exportAs: "uiCalendarDay",
})
class UiCalendarDay implements TextSource {
  /** The day's date, like `"2026-11-14"`, from its cell. */
  readonly value = input.required<string>()
  readonly #grid = inject(UiCalendarGrid, { optional: true })
  readonly #part = injectPart(injectHandle(calendar), "day", () => ({
    value: this.value(),
    offset: this.#grid?.offset() ?? 0,
  }))
  /** The day's state, with whether it's selected, today or unavailable. */
  readonly state = this.#part.state
  /** Shows the part's text where `uiText` is. */
  readonly attach = showText(() => this.state().label)
}

export { createCalendarController } from "@ui-sdk/core/calendar"
export type {
  CalendarAnchorChangeReason,
  CalendarApi,
  CalendarChangeOptions,
  CalendarController,
  CalendarDayProps,
  CalendarDayState,
  CalendarFocusedChangeReason,
  CalendarGridCell,
  CalendarGridProps,
  CalendarGridState,
  CalendarHeadingState,
  CalendarMode,
  CalendarMonthChangeReason,
  CalendarOptions,
  CalendarPrimitive,
  CalendarSelectOption,
  CalendarSelectState,
  CalendarState,
  CalendarStepState,
  CalendarValue,
  CalendarValueChangeReason,
  CalendarWeekdayProps,
  CalendarWeekdayState,
  DateMatcher,
  DateMatchers,
  ISOMonth,
} from "@ui-sdk/core/calendar"

export {
  type CalendarMonthChangeDetails,
  type CalendarValueChangeDetails,
  UiCalendar,
  UiCalendarDay,
  UiCalendarGrid,
  UiCalendarHeading,
  UiCalendarMonthSelect,
  UiCalendarNext,
  UiCalendarPrevious,
  UiCalendarWeek,
  UiCalendarWeekday,
  UiCalendarWeekdays,
  UiCalendarYearSelect,
}
