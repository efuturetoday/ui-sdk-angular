import { Directive, input } from "@angular/core"
import { timeInput, type TimeInputGranularity } from "@ui-sdk/core/time-input"
import { provideValueAccessor, UiValueAccessor } from "./forms"
import { provideRoot } from "./primitive"
import {
  SegmentedInput,
  SegmentedInputSegment,
  SegmentedPrimitive,
  type Segmented,
} from "./segmented-input"

// Time Input has Date Input's slots and state.
const primitive = timeInput as unknown as Segmented

/**
 * A time made of segments you type in, like hour and minute, on the element
 * it's written on. Render its segments from `state().segments`, each with
 * `uiTimeInputSegment`. With `name`, a native form gets its value.
 * @experimental
 */
@Directive({
  selector: "[uiTimeInput]",
  exportAs: "uiTimeInput",
  providers: [
    provideRoot(primitive, () => UiTimeInput),
    { provide: SegmentedPrimitive, useValue: primitive },
  ],
})
class UiTimeInput extends SegmentedInput {
  /** The smallest unit it shows. */
  readonly granularity = input<TimeInputGranularity>()

  protected extraOptions() {
    return { granularity: this.granularity() }
  }
}

/**
 * One segment of a time input: an `<input>` you type in, or a `<span>` for
 * the text between inputs. Written empty, a span shows its text.
 * @experimental
 */
@Directive({
  selector: "[uiTimeInputSegment]",
  exportAs: "uiTimeInputSegment",
})
class UiTimeInputSegment extends SegmentedInputSegment {}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * time input's `value`. Signal Forms' `formField` needs nothing more.
 * @experimental
 */
@Directive({
  selector:
    "[uiTimeInput][ngModel], [uiTimeInput][formControl], [uiTimeInput][formControlName]",
  providers: [provideValueAccessor(() => UiTimeInputValueAccessor)],
})
class UiTimeInputValueAccessor extends UiValueAccessor<string | null> {
  protected fromForm(value: unknown) {
    return (value as string | null | undefined) ?? null
  }
}

export { createTimeInputController } from "@ui-sdk/core/time-input"
export type {
  HourCycle,
  TimeInputApi,
  TimeInputChangeOptions,
  TimeInputController,
  TimeInputGranularity,
  TimeInputOptions,
  TimeInputPrimitive,
  TimeInputSegmentData,
  TimeInputSegmentProps,
  TimeInputSegmentState,
  TimeInputSegmentType,
  TimeInputState,
  TimeInputValueChangeReason,
} from "@ui-sdk/core/time-input"

export { UiTimeInput, UiTimeInputSegment, UiTimeInputValueAccessor }
