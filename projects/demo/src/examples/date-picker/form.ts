import { Component } from "@angular/core"
import {
  LucideCalendar,
  LucideChevronLeft,
  LucideChevronRight,
} from "@lucide/angular"
import {
  UiCalendarDay,
  UiCalendarGrid,
  UiCalendarHeading,
  UiCalendarNext,
  UiCalendarPrevious,
  UiCalendarWeek,
  UiCalendarWeekday,
  UiCalendarWeekdays,
} from "@ngx-ui-sdk/core/calendar"
import {
  UiDatePicker,
  UiDatePickerContent,
  UiDatePickerInput,
  UiDatePickerTrigger,
} from "@ngx-ui-sdk/core/date-picker"
import {
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCalendar,
    LucideChevronLeft,
    LucideChevronRight,
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
    UiDatePickerInput,
    UiDatePickerTrigger,
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
  ],
  template: `
    <form data-slot="stack" (submit)="submit($event)">
      <div uiField name="due">
        <label uiFieldLabel>Due date</label>
        <div uiDatePicker required>
          <div data-slot="row">
            <input uiDatePickerInput />
            <button uiDatePickerTrigger data-variant="ghost">
              <svg lucideCalendar aria-hidden="true"></svg>
            </button>
          </div>
          <div *uiDatePickerContent="let state">
            <div data-slot="row">
              <button uiCalendarPrevious data-variant="ghost">
                <svg lucideChevronLeft aria-hidden="true"></svg>
              </button>
              <h2 uiCalendarHeading></h2>
              <button uiCalendarNext data-variant="ghost">
                <svg lucideChevronRight aria-hidden="true"></svg>
              </button>
            </div>
            <table uiCalendarGrid #grid="uiCalendarGrid">
              <thead>
                <tr uiCalendarWeekdays>
                  @for (weekday of grid.state().weekdays; track $index) {
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
        <p uiFieldDescription>When the invoice is due.</p>
        <div>
          <div *uiFieldError="let state; match: 'valueMissing'">
            Choose a due date.
          </div>
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected submit(event: Event) {
    event.preventDefault()
    this.log(
      `Submitted due=${new FormData(event.currentTarget as HTMLFormElement).get("due")}`
    )
  }
}

export { Example }
