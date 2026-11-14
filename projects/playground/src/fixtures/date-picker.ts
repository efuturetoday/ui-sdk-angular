import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  datePickerAction,
  datePickerFixture as f,
  datePickerOptions,
} from "tests/fixtures/date-picker"
import {
  UiCalendarDay,
  UiCalendarGrid,
  UiCalendarHeading,
  UiCalendarNext,
  UiCalendarPrevious,
  UiCalendarWeek,
  UiCalendarWeekday,
  UiCalendarWeekdays,
  UiDatePicker,
  UiDatePickerClear,
  UiDatePickerContent,
  UiDatePickerHint,
  UiDatePickerInput,
  UiDatePickerPreset,
  UiDatePickerTrigger,
  type DatePickerValue,
} from "ui-sdk-angular"

// Upstream's fixture. The grid's weekdays, weeks and days are written from
// its state, which Vue renders without content.
@Component({
  selector: "app-fixture",
  imports: [
    UiCalendarDay,
    UiCalendarGrid,
    UiCalendarHeading,
    UiCalendarNext,
    UiCalendarPrevious,
    UiCalendarWeek,
    UiCalendarWeekday,
    UiCalendarWeekdays,
    UiDatePicker,
    UiDatePickerClear,
    UiDatePickerContent,
    UiDatePickerHint,
    UiDatePickerInput,
    UiDatePickerPreset,
    UiDatePickerTrigger,
  ],
  template: `
    <div class="fixture" [attr.lang]="o.lang">
      <button>Before</button>
      <form (submit)="onSubmit($event)">
        <label for="date-start">{{ range ? "Stay" : "Due date" }}</label>
        <div
          uiDatePicker
          class="date-picker"
          [today]="f.today"
          [name]="range ? undefined : f.name"
          [startName]="range ? 'start' : undefined"
          [endName]="range ? 'end' : undefined"
          [mode]="o.mode"
          [defaultValue]="o.defaultValue"
          [min]="o.min"
          [max]="o.max"
          [unavailable]="o.unavailable"
          [required]="o.required"
          [disabled]="o.disabled"
          [readOnly]="o.readOnly"
          [closeOnSelect]="o.closeOnSelect"
          [minDays]="o.minDays"
          [maxDays]="o.maxDays"
          [container]="container"
          (beforeValueChange)="onValueChange($event.value, $event.details)"
          (beforeOpenChange)="onOpenChange($event.open, $event.details)"
        >
          <input
            uiDatePickerInput
            id="date-start"
            [attr.aria-label]="range ? 'Start date' : null"
          />
          @if (range) {
            <input uiDatePickerInput end aria-label="End date" />
          }
          <button uiDatePickerTrigger></button>
          <button *uiDatePickerClear>Clear</button>
          <span uiDatePickerHint class="date-picker-hint"></span>
          <div *uiDatePickerContent class="date-picker-content">
            <div class="calendar-header">
              <button uiCalendarPrevious class="calendar-step"></button>
              <h2 uiCalendarHeading class="calendar-heading"></h2>
              <button uiCalendarNext class="calendar-step"></button>
            </div>
            <table uiCalendarGrid #grid="uiCalendarGrid" class="calendar-grid">
              <thead>
                <tr uiCalendarWeekdays>
                  @for (weekday of grid.state().weekdays; track weekday) {
                    <th uiCalendarWeekday scope="col" [index]="$index"></th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (week of grid.state().weeks; track $index) {
                  <tr uiCalendarWeek [index]="$index">
                    @for (cell of week; track $index) {
                      @if (cell.hidden) {
                        <td></td>
                      } @else {
                        <td uiCalendarDay [value]="cell.date"></td>
                      }
                    }
                  </tr>
                }
              </tbody>
            </table>
            <button uiDatePickerPreset [value]="preset.value">
              {{ preset.label }}
            </button>
          </div>
        </div>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly o = datePickerOptions()
  protected readonly container = (this.o as { container?: HTMLElement | null })
    .container
  protected readonly range = this.o.mode === "range"
  protected readonly preset = (this.range ? f.rangePreset : f.preset) as {
    value: DatePickerValue
    label: string
  }
  protected readonly action = signal("")
  protected readonly submitted = signal("")

  protected onValueChange(next: DatePickerValue, details: ChangeDetails) {
    this.action.set(datePickerAction("value", next, details.reason))
  }

  protected onOpenChange(next: boolean, details: ChangeDetails) {
    this.action.set(datePickerAction("open", next, details.reason))
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(
      JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])
    )
  }
}

export { Fixture }
