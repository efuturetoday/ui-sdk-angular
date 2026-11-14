import {
  computed,
  Directive,
  forwardRef,
  inject,
  input,
  type InputSignal,
  output,
} from "@angular/core"
import type {
  Anchor,
  ChangeDetails,
  DismissAttemptDetails,
  Side,
  SlotName,
} from "@ui-sdk/core"
import { calendar } from "@ui-sdk/core/calendar"
import {
  datePicker,
  type DateMatchers,
  type DatePickerContentProps,
  type DatePickerContentState,
  type DatePickerController,
  type DatePickerDismissReason,
  type DatePickerMode,
  type DatePickerMonthChangeReason,
  type DatePickerOpenChangeReason,
  type DatePickerPrimitive,
  type DatePickerValue,
  type DatePickerValueChangeReason,
  type ISOMonth,
} from "@ui-sdk/core/date-picker"
import {
  injectFieldControl,
  ɵinjectInputInside as injectInputInside,
  optionalBoolean,
  ɵbindPart as bindPart,
  injectPart,
  injectPopupPart,
  type PopupContainer,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵtokenOf as tokenOf,
  injectPresentPart,
  type PresentPartContext,
  TextSource,
  showText,
} from "@ngx-ui-sdk/core"

/**
 * Why the picked dates change.
 * @experimental
 */
type DatePickerValueChangeDetails = ChangeDetails<DatePickerValueChangeReason>

/**
 * Why the calendar opens or closes.
 * @experimental
 */
type DatePickerOpenChangeDetails = ChangeDetails<DatePickerOpenChangeReason>

/**
 * A date field with a calendar in a popup, on the element it's written on.
 * Every `uiCalendar…` part works inside its content, on its calendar. A
 * hidden input for each date with a name to submit under is made at its end.
 * @experimental
 */
@Directive({
  selector: "[uiDatePicker]",
  exportAs: "uiDatePicker",
  providers: [
    provideRoot(datePicker, () => UiDatePicker),
    // Its calendar parts are the calendar's, on the date picker's instance.
    {
      provide: tokenOf(calendar),
      useExisting: forwardRef(() => UiDatePicker),
    },
  ],
})
class UiDatePicker {
  /** What it picks: one date, a range, or several dates. */
  readonly mode = input<DatePickerMode>()
  /** The picked date, range or dates. Bind it, or `[(value)]`, to control it. */
  readonly value = input<DatePickerValue>()
  /** The picked dates at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<DatePickerValue>()
  /** The first shown month. Bind it, or `[(month)]`, to control it. */
  readonly month = input<ISOMonth>()
  /** The first shown month at first, when uncontrolled. */
  readonly defaultMonth = input<ISOMonth>()
  /** Whether the calendar is open. Bind it, or `[(open)]`, to control it. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the calendar is open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether picking a date closes the calendar. */
  readonly closeOnSelect = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** How it presents: `"sheet"` slides up from the bottom, `"auto"` does that on small touch screens. */
  readonly presentation = input<"auto" | "popover" | "sheet">()
  /** Whether Escape and outside presses may close it, `true` by default. */
  readonly dismissible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The earliest date that can be picked. */
  readonly min = input<string>()
  /** The latest date that can be picked. */
  readonly max = input<string>()
  /** Dates that can't be picked. */
  readonly unavailable = input<DateMatchers>()
  /** Stops it from changing. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Shows the dates without letting them change. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** How many months show side by side. */
  readonly months = input<number>()
  /** Whether the steps move a month, or all shown months. */
  readonly pageBy = input<"month" | "page">()
  /** The locale dates are written and read in. */
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
  /** Today, if not the clock's. */
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
  /** The name the date submits under. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The name a range's start submits under. */
  readonly startName = input<string>()
  /** The name a range's end submits under. */
  readonly endName = input<string>()
  /** The id of the form it belongs to, if it isn't inside it. */
  readonly form = input<string>()
  /** Whether a form needs a date. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Renders the calendar into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** Opens it and sets its dates from anywhere. Create one with `createDatePickerController()`. */
  readonly controller = input<DatePickerController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new dates once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<DatePickerValue>()
  /** Emits before the dates change. `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: DatePickerValue
    details: DatePickerValueChangeDetails
  }>()
  /** Emits the new month once a change isn't canceled, for `[(month)]`. */
  readonly monthChange = output<ISOMonth>()
  /** Emits before the shown month changes. `details.cancel()` stops it. */
  readonly beforeMonthChange = output<{
    month: ISOMonth
    details: ChangeDetails<DatePickerMonthChangeReason>
  }>()
  /** Emits the new open state once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the calendar opens or closes. `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: DatePickerOpenChangeDetails
  }>()
  /** Emits once the calendar has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when a dismissal is refused, like Escape on one that isn't `dismissible`. */
  readonly dismissAttempt =
    output<DismissAttemptDetails<DatePickerDismissReason>>()
  readonly #field = injectFieldControl()
  readonly handle: PrimitiveHandle<DatePickerPrimitive> = injectPrimitive(
    datePicker,
    () => ({
      mode: this.mode(),
      value: this.value(),
      defaultValue: this.defaultValue(),
      month: this.month(),
      defaultMonth: this.defaultMonth(),
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      closeOnSelect: this.closeOnSelect(),
      presentation: this.presentation(),
      dismissible: this.dismissible(),
      min: this.min(),
      max: this.max(),
      unavailable: this.unavailable(),
      disabled: this.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly(),
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
      name: this.name() ?? this.#field?.name(),
      startName: this.startName(),
      endName: this.endName(),
      form: this.form(),
      required: this.required(),
      controller: this.controller(),
      debug: this.debug(),
      onValueChange: (
        value: DatePickerValue,
        details: DatePickerValueChangeDetails
      ) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
      onMonthChange: (
        month: ISOMonth,
        details: ChangeDetails<DatePickerMonthChangeReason>
      ) => {
        this.beforeMonthChange.emit({ month, details })
        if (!details.canceled) {
          this.monthChange.emit(month)
        }
      },
      onOpenChange: (open: boolean, details: DatePickerOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
      onDismissAttempt: (
        details: DismissAttemptDetails<DatePickerDismissReason>
      ) => this.dismissAttempt.emit(details),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The date picker's state. */
  readonly state = this.#part.state
  /** @internal The field around it, which its start input joins. */
  readonly field = this.#field
  // A hidden input for each date that has a name to submit under.
  readonly #range = computed(() => this.state().mode === "range")
  readonly #submitsStart = computed(() =>
    this.#range()
      ? (this.startName() ?? this.name() ?? this.#field?.name())
      : (this.name() ?? this.#field?.name())
  )
  readonly #submitsEnd = computed(
    () =>
      this.#range() && (this.endName() ?? this.name() ?? this.#field?.name())
  )
  readonly #start = this.#hidden("start", this.#submitsStart)
  readonly #end = this.#hidden("end", this.#submitsEnd)

  #hidden(id: "start" | "end", submits: () => unknown) {
    const made = injectInputInside()
    return bindPart(
      () => this.handle,
      "hidden-input" as SlotName<DatePickerPrimitive>,
      () => ({ id, end: id === "end" || undefined }) as never,
      { ...made, show: () => (submits() ? made.show() : undefined) }
    )
  }
}

/**
 * A text input, on an `<input>`, that reads a date typed in the page's
 * language on Enter or blur. `end` makes it a range's end.
 * @experimental
 */
@Directive({
  selector: "input[uiDatePickerInput]",
  exportAs: "uiDatePickerInput",
})
class UiDatePickerInput {
  /** Makes it a range's end. */
  readonly end = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #root = inject(UiDatePicker)
  readonly #part = injectPart(
    injectHandle(datePicker),
    "input",
    () => ({ end: this.end(), id: this.end() ? "end" : "start" }),
    {
      join: {
        part: (own) =>
          this.end() ? undefined : this.#root.field?.join.part(own),
        merge: (own, joined) =>
          this.#root.field?.join.merge(own, joined) ?? own,
      },
    }
  )
  /** The input's state. */
  readonly state = this.#part.state
}

/**
 * Opens the calendar. Named "Choose date" and the date chosen; give it an
 * `aria-label` in another language. Put an icon inside.
 * @experimental
 */
@Directive({
  selector: "[uiDatePickerTrigger]",
  exportAs: "uiDatePickerTrigger",
})
class UiDatePickerTrigger {
  readonly #part = injectPart(injectHandle(datePicker), "trigger")
  /** The trigger's state. */
  readonly state = this.#part.state
}

/**
 * The popup, on the element it's written on: `<div *uiDatePickerContent>`.
 * Put the calendar's parts inside: steps, heading and a grid for each month.
 * @experimental
 */
@Directive({ selector: "[uiDatePickerContent]" })
class UiDatePickerContent {
  /** Which side of the field it opens on. */
  readonly side = input<Side>(undefined, { alias: "uiDatePickerContentSide" })
  /** How it lines up with the field along that side. */
  readonly align = input<"start" | "center" | "end">(undefined, {
    alias: "uiDatePickerContentAlign",
  })
  /** Gap between the field and the popup, in pixels. */
  readonly sideOffset = input<number>(undefined, {
    alias: "uiDatePickerContentSideOffset",
  })
  /** Shift along the field, in pixels. */
  readonly alignOffset = input<number>(undefined, {
    alias: "uiDatePickerContentAlignOffset",
  })
  /** Space it keeps from the edges of the screen, in pixels. */
  readonly collisionPadding = input<number>(undefined, {
    alias: "uiDatePickerContentCollisionPadding",
  })
  /** Space an arrow keeps from the popup's corners, in pixels. */
  readonly arrowPadding = input<number>(undefined, {
    alias: "uiDatePickerContentArrowPadding",
  })
  /** What it's positioned against instead of the field. */
  readonly anchor = input<Anchor | string | null>(undefined, {
    alias: "uiDatePickerContentAnchor",
  })
  /** Where focus goes when it closes while focus is inside it. */
  readonly finalFocus: InputSignal<
    DatePickerContentProps["finalFocus"] | undefined
  > = input<DatePickerContentProps["finalFocus"] | undefined>(undefined, {
    alias: "uiDatePickerContentFinalFocus",
  })

  /** Keeps it in the page, hidden, while closed. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiDatePickerContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Where it renders, instead of the date picker's `container`. */
  readonly container = input<PopupContainer>(undefined, {
    alias: "uiDatePickerContentContainer",
  })
  readonly #root = inject(UiDatePicker)
  readonly #part = injectPopupPart(
    injectHandle(datePicker),
    "content",
    computed(() => ({
      side: this.side(),
      align: this.align(),
      sideOffset: this.sideOffset(),
      alignOffset: this.alignOffset(),
      collisionPadding: this.collisionPadding(),
      arrowPadding: this.arrowPadding(),
      anchor: this.anchor(),
      finalFocus: this.finalFocus(),
      keepMounted: this.keepMounted(),
    })) as never,
    {
      container: () => this.container() ?? this.#root.container(),
      viewport: "viewport",
    }
  )

  static ngTemplateContextGuard(
    _directive: UiDatePickerContent,
    _context: unknown
  ): _context is PresentPartContext<DatePickerContentState> {
    return true
  }
}

/**
 * The format a date is typed in, like "mm/dd/yyyy". With `uiText`, it shows it.
 * @experimental
 */
@Directive({
  providers: [{ provide: TextSource, useExisting: UiDatePickerHint }],
  selector: "[uiDatePickerHint]",
  exportAs: "uiDatePickerHint",
})
class UiDatePickerHint implements TextSource {
  readonly #part = injectPart(injectHandle(datePicker), "hint")
  /** The hint's state, with its `placeholder`. */
  readonly state = this.#part.state
  /** Shows the part's text where `uiText` is. */
  readonly attach = showText(() => this.state().placeholder)
}

/**
 * A button that clears the dates, on the element it's written on:
 * `<button *uiDatePickerClear>`. Rendered while there are dates to clear.
 * @experimental
 */
@Directive({ selector: "[uiDatePickerClear]" })
class UiDatePickerClear {
  readonly #part = injectPresentPart(injectHandle(datePicker), "clear")
}

/**
 * Picks a set date or range, like "Today" or "Last 7 days".
 * @experimental
 */
@Directive({ selector: "[uiDatePickerPreset]", exportAs: "uiDatePickerPreset" })
class UiDatePickerPreset {
  /** The date or range it picks. */
  readonly value = input.required<DatePickerValue>()
  readonly #part = injectPart(injectHandle(datePicker), "preset", () => ({
    value: this.value(),
    id: JSON.stringify(this.value()),
  }))
  /** The preset's state, with whether it's `selected`. */
  readonly state = this.#part.state
}

export { createDatePickerController } from "@ui-sdk/core/date-picker"
export type {
  CalendarDayState,
  CalendarGridCell,
  CalendarGridState,
  CalendarHeadingState,
  CalendarSelectOption,
  CalendarSelectState,
  CalendarStepState,
  CalendarWeekdayState,
  DateMatcher,
  DateMatchers,
  DatePickerApi,
  DatePickerChangeOptions,
  DatePickerClearState,
  DatePickerContentProps,
  DatePickerContentState,
  DatePickerController,
  DatePickerDismissReason,
  DatePickerHintState,
  DatePickerInputProps,
  DatePickerInputState,
  DatePickerMode,
  DatePickerMonthChangeReason,
  DatePickerOpenChangeReason,
  DatePickerOptions,
  DatePickerPresetProps,
  DatePickerPresetState,
  DatePickerPrimitive,
  DatePickerState,
  DatePickerTriggerState,
  DatePickerValue,
  DatePickerValueChangeReason,
  ISOMonth,
} from "@ui-sdk/core/date-picker"

export {
  type DatePickerOpenChangeDetails,
  type DatePickerValueChangeDetails,
  UiDatePicker,
  UiDatePickerClear,
  UiDatePickerContent,
  UiDatePickerHint,
  UiDatePickerInput,
  UiDatePickerPreset,
  UiDatePickerTrigger,
}
