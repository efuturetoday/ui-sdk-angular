import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  dateInputAction,
  dateInputFixture as f,
  dateInputOptions,
} from "tests/fixtures/date-input"
import {
  createDateInputController,
  UiDateInput,
  UiDateInputSegment,
  UiField,
  UiFieldError,
  UiFieldLabel,
  UiTimeInput,
  UiTimeInputSegment,
} from "ngx-ui-sdk"

@Component({
  selector: "app-fixture",
  imports: [
    UiDateInput,
    UiDateInputSegment,
    UiField,
    UiFieldError,
    UiFieldLabel,
    UiTimeInput,
    UiTimeInputSegment,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form [attr.aria-label]="f.form.label" (submit)="onSubmit($event)">
        <div uiField class="field" [name]="f.date.name">
          <label uiFieldLabel>{{ f.date.label }}</label>
          <div
            uiDateInput
            #dateInput="uiDateInput"
            class="date-input"
            [controller]="controller"
            [defaultValue]="date.defaultValue"
            [locale]="date.locale"
            [granularity]="date.granularity"
            [hourCycle]="date.hourCycle"
            [min]="date.min"
            [max]="date.max"
            [unavailable]="date.unavailable"
            [disabled]="shared.disabled"
            [readOnly]="shared.readOnly"
            [required]="shared.required"
            (beforeValueChange)="onDateChange($event.value, $event.details)"
          >
            @for (segment of dateInput.state().segments; track segment.key) {
              @if (segment.editable) {
                <input uiDateInputSegment [segment]="segment" />
              } @else {
                <span uiDateInputSegment [segment]="segment"></span>
              }
            }
          </div>
          <div *uiFieldError class="field-error"></div>
        </div>
        <div uiField class="field" [name]="f.time.name">
          <label uiFieldLabel>{{ f.time.label }}</label>
          <div
            uiTimeInput
            #timeInput="uiTimeInput"
            class="date-input"
            [defaultValue]="time.defaultValue"
            [locale]="time.locale"
            [hourCycle]="time.hourCycle"
            [disabled]="shared.disabled"
            [readOnly]="shared.readOnly"
            [required]="shared.required"
            (beforeValueChange)="onTimeChange($event.value, $event.details)"
          >
            @for (segment of timeInput.state().segments; track segment.key) {
              @if (segment.editable) {
                <input uiTimeInputSegment [segment]="segment" />
              } @else {
                <span uiTimeInputSegment [segment]="segment"></span>
              }
            }
          </div>
        </div>
        <button type="submit">{{ f.form.submit }}</button>
        <button type="reset">{{ f.form.reset }}</button>
      </form>
      <button (click)="controller.setValue(f.filled)">Set date</button>
      <button (click)="controller.clear()">Clear date</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly controller = createDateInputController()
  readonly #options = dateInputOptions()
  protected readonly date = this.#options.date
  protected readonly time = this.#options.time
  protected readonly shared = {
    disabled: this.#options.disabled,
    readOnly: this.#options.readOnly,
    required: this.#options.required,
  }
  protected readonly action = signal("")
  protected readonly submitted = signal("")

  protected onDateChange(value: string | null, details: ChangeDetails) {
    if (this.#options.cancel && value === this.#options.cancel) {
      return details.cancel()
    }
    this.action.set(dateInputAction.change("date", value, details.reason))
  }

  protected onTimeChange(value: string | null, details: ChangeDetails) {
    this.action.set(dateInputAction.change("time", value, details.reason))
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(
      JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])
    )
  }
}

export { Fixture }
