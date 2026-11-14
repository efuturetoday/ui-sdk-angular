import { Component, signal } from "@angular/core"
import {
  datePickerFieldFixture as f,
  datePickerFieldOptions,
  datePickerFixture,
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
  UiDatePickerContent,
  UiDatePickerHint,
  UiDatePickerInput,
  UiDatePickerTrigger,
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
} from "ngx-ui-sdk"

// Upstream's fixture. The calendar inside the content is written out, which
// Vue renders without content.
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
    UiDatePickerContent,
    UiDatePickerHint,
    UiDatePickerInput,
    UiDatePickerTrigger,
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form (submit)="onSubmit($event)">
        <div
          uiField
          class="field"
          [name]="datePickerFixture.name"
          [disabled]="o.disabled"
        >
          <label uiFieldLabel>{{ f.label }}</label>
          @if (shown()) {
            <div
              uiDatePicker
              class="date-picker"
              [today]="datePickerFixture.today"
              [required]="o.required"
            >
              <input uiDatePickerInput />
              <button uiDatePickerTrigger></button>
              <span uiDatePickerHint class="date-picker-hint"></span>
              <div *uiDatePickerContent class="date-picker-content">
                <div>
                  <button uiCalendarPrevious></button>
                  <h2 uiCalendarHeading></h2>
                  <button uiCalendarNext></button>
                </div>
                <table uiCalendarGrid #grid="uiCalendarGrid">
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
              </div>
            </div>
          }
          <p uiFieldDescription>{{ f.description }}</p>
          <div *uiFieldError class="field-error"></div>
        </div>
        <button type="submit">Submit</button>
        <button type="button" (click)="shown.set(false)">
          Remove date picker
        </button>
      </form>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly datePickerFixture = datePickerFixture
  protected readonly o = datePickerFieldOptions()
  protected readonly shown = signal(true)
  protected readonly submitted = signal("")

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(
      JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])
    )
  }
}

export { Fixture }
