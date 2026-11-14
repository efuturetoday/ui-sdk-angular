import { Directive, input } from "@angular/core"
import {
  dateInput,
  type DateInputGranularity,
  type DateMatchers,
} from "@ui-sdk/core/date-input"
import {
  provideValueAccessor,
  UiValueAccessor,
  provideRoot,
  TextSource,
} from "@ngx-ui-sdk/core"
import {
  ɵSegmentedInput as SegmentedInput,
  ɵSegmentedInputSegment as SegmentedInputSegment,
  ɵSegmentedPrimitive as SegmentedPrimitive,
} from "@ngx-ui-sdk/core/segmented-input"

/**
 * A date made of segments you type in, like day, month and year, on the
 * element it's written on. Render its segments from `state().segments`, each
 * with `uiDateInputSegment`. With `name`, a native form gets its value.
 * @experimental
 */
@Directive({
  selector: "[uiDateInput]",
  exportAs: "uiDateInput",
  providers: [
    provideRoot(dateInput, () => UiDateInput),
    { provide: SegmentedPrimitive, useValue: dateInput },
  ],
})
class UiDateInput extends SegmentedInput {
  /** The smallest unit it shows. */
  readonly granularity = input<DateInputGranularity>()
  /** Dates that can't be chosen: a date, a range, or a function. */
  readonly unavailable = input<DateMatchers>()

  protected extraOptions() {
    return { granularity: this.granularity(), unavailable: this.unavailable() }
  }
}

/**
 * One segment of a date input: an `<input>` you type in, or a `<span>` for
 * the text between inputs. With `uiText`, a span shows its text.
 * @experimental
 */
@Directive({
  selector: "[uiDateInputSegment]",
  exportAs: "uiDateInputSegment",
  providers: [{ provide: TextSource, useExisting: UiDateInputSegment }],
})
class UiDateInputSegment extends SegmentedInputSegment {}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * date input's `value`. Signal Forms' `formField` needs nothing more.
 * @experimental
 */
@Directive({
  selector:
    "[uiDateInput][ngModel], [uiDateInput][formControl], [uiDateInput][formControlName]",
  providers: [provideValueAccessor(() => UiDateInputValueAccessor)],
})
class UiDateInputValueAccessor extends UiValueAccessor<string | null> {
  protected fromForm(value: unknown) {
    return (value as string | null | undefined) ?? null
  }
}

export { createDateInputController } from "@ui-sdk/core/date-input"
export type {
  DateInputApi,
  DateInputChangeOptions,
  DateInputController,
  DateInputGranularity,
  DateInputOptions,
  DateInputPrimitive,
  DateInputSegmentData,
  DateInputSegmentProps,
  DateInputSegmentState,
  DateInputSegmentType,
  DateInputState,
  DateInputValueChangeReason,
  DateMatcher,
  DateMatchers,
  HourCycle,
} from "@ui-sdk/core/date-input"

export { UiDateInput, UiDateInputSegment, UiDateInputValueAccessor }
