import { UiText } from "@ngx-ui-sdk/core"
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
  UiDatePickerHint,
  UiDatePickerInput,
  UiDatePickerTrigger,
} from "@ngx-ui-sdk/core/date-picker"

@Component({
  selector: "app-example",
  imports: [
    UiText,
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
    UiDatePickerHint,
    UiDatePickerInput,
    UiDatePickerTrigger,
  ],
  template: `
    <div lang="de">
      <div uiDatePicker defaultValue="2026-10-16">
        <div data-slot="row">
          <input uiDatePickerInput aria-label="Fälligkeitsdatum" />
          <button uiDatePickerTrigger data-variant="ghost">
            <svg lucideCalendar aria-hidden="true"></svg>
          </button>
        </div>
        <span uiDatePickerHint uiText></span>
        <div *uiDatePickerContent="let state">
          <div data-slot="row">
            <button uiCalendarPrevious data-variant="ghost">
              <svg lucideChevronLeft aria-hidden="true"></svg>
            </button>
            <h2 uiCalendarHeading uiText></h2>
            <button uiCalendarNext data-variant="ghost">
              <svg lucideChevronRight aria-hidden="true"></svg>
            </button>
          </div>
          <table uiCalendarGrid #grid="uiCalendarGrid">
            <thead>
              <tr uiCalendarWeekdays>
                @for (weekday of grid.state().weekdays; track $index) {
                  <th
                    uiCalendarWeekday
                    scope="col"
                    [index]="$index"
                    uiText></th>
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
                      <td uiCalendarDay [value]="cell.date" uiText></td>
                    }
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
