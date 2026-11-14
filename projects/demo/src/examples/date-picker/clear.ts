import { Component } from "@angular/core"
import {
  LucideCalendar,
  LucideChevronLeft,
  LucideChevronRight,
  LucideX,
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
  UiDatePicker,
  UiDatePickerClear,
  UiDatePickerContent,
  UiDatePickerHint,
  UiDatePickerInput,
  UiDatePickerTrigger,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideCalendar,
    LucideChevronLeft,
    LucideChevronRight,
    LucideX,
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
    UiDatePickerTrigger,
  ],
  template: `
    <div uiDatePicker defaultValue="2026-10-16">
      <div data-slot="row">
        <input uiDatePickerInput aria-label="Due date" />
        <button *uiDatePickerClear data-variant="ghost" aria-label="Clear date">
          <svg lucideX aria-hidden="true"></svg>
        </button>
        <button uiDatePickerTrigger data-variant="ghost">
          <svg lucideCalendar aria-hidden="true"></svg>
        </button>
      </div>
      <span uiDatePickerHint></span>
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
  `,
})
class Example {}

export { Example }
