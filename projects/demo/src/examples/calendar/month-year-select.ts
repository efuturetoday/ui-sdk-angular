import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  UiCalendar,
  UiCalendarDay,
  UiCalendarGrid,
  UiCalendarHeading,
  UiCalendarMonthSelect,
  UiCalendarNext,
  UiCalendarPrevious,
  UiCalendarWeek,
  UiCalendarWeekday,
  UiCalendarWeekdays,
  UiCalendarYearSelect,
} from "ngx-ui-sdk/calendar"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronLeft,
    LucideChevronRight,
    UiCalendar,
    UiCalendarDay,
    UiCalendarGrid,
    UiCalendarHeading,
    UiCalendarMonthSelect,
    UiCalendarNext,
    UiCalendarPrevious,
    UiCalendarWeek,
    UiCalendarWeekday,
    UiCalendarWeekdays,
    UiCalendarYearSelect,
  ],
  template: `
    <div uiCalendar defaultMonth="1990-06" min="1920-01-01" max="2026-10-16">
      <div data-slot="row">
        <button uiCalendarPrevious data-variant="ghost">
          <svg lucideChevronLeft aria-hidden="true"></svg>
        </button>
        <h2 uiCalendarHeading></h2>
        <div data-slot="row">
          <select uiCalendarMonthSelect #monthSelect="uiCalendarMonthSelect">
            @for (option of monthSelect.state().options; track option.value) {
              <option
                [value]="option.value"
                [disabled]="option.disabled"
                [selected]="option.value === monthSelect.state().value"
              >
                {{ option.label }}
              </option>
            }
          </select>
          <select uiCalendarYearSelect #yearSelect="uiCalendarYearSelect">
            @for (option of yearSelect.state().options; track option.value) {
              <option
                [value]="option.value"
                [disabled]="option.disabled"
                [selected]="option.value === yearSelect.state().value"
              >
                {{ option.label }}
              </option>
            }
          </select>
        </div>
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
  `,
})
class Example {}

export { Example }
