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
  ],
  template: `
    <div
      uiDatePicker
      mode="range"
      [months]="2"
      monthFormat="short"
      [defaultValue]="['2026-10-12', '2026-10-16']"
    >
      <div #field data-slot="row">
        <input uiDatePickerInput aria-label="Check in" placeholder="Check in" />
        <span data-slot="hint">–</span>
        <input
          uiDatePickerInput
          end
          aria-label="Check out"
          placeholder="Check out"
        />
        <button uiDatePickerTrigger data-variant="ghost">
          <svg lucideCalendar aria-hidden="true"></svg>
        </button>
      </div>
      <div *uiDatePickerContent="let state; anchor: field; align: 'center'">
        <div data-slot="row">
          <button uiCalendarPrevious data-variant="ghost">
            <svg lucideChevronLeft aria-hidden="true"></svg>
          </button>
          <h2 uiCalendarHeading></h2>
          <button uiCalendarNext data-variant="ghost">
            <svg lucideChevronRight aria-hidden="true"></svg>
          </button>
        </div>
        <div data-slot="row">
          <table uiCalendarGrid #first="uiCalendarGrid">
            <thead>
              <tr uiCalendarWeekdays>
                @for (weekday of first.state().weekdays; track $index) {
                  <th uiCalendarWeekday scope="col" [index]="$index"></th>
                }
              </tr>
            </thead>
            <tbody>
              @for (week of first.state().weeks; track $index) {
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
          <table uiCalendarGrid #second="uiCalendarGrid" [offset]="1">
            <thead>
              <tr uiCalendarWeekdays>
                @for (weekday of second.state().weekdays; track $index) {
                  <th uiCalendarWeekday scope="col" [index]="$index"></th>
                }
              </tr>
            </thead>
            <tbody>
              @for (week of second.state().weeks; track $index) {
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
    </div>
  `,
})
class Example {}

export { Example }
