import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  UiCalendar,
  UiCalendarDay,
  UiCalendarGrid,
  UiCalendarHeading,
  UiCalendarNext,
  UiCalendarPrevious,
  UiCalendarWeek,
  UiCalendarWeekday,
  UiCalendarWeekdays,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronLeft,
    LucideChevronRight,
    UiCalendar,
    UiCalendarDay,
    UiCalendarGrid,
    UiCalendarHeading,
    UiCalendarNext,
    UiCalendarPrevious,
    UiCalendarWeek,
    UiCalendarWeekday,
    UiCalendarWeekdays,
  ],
  template: `
    <div
      uiCalendar
      mode="range"
      [months]="2"
      monthFormat="short"
      [defaultValue]="['2026-10-12', '2026-10-16']"
    >
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
        <table uiCalendarGrid #first="uiCalendarGrid" [offset]="0">
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
  `,
})
class Example {}

export { Example }
