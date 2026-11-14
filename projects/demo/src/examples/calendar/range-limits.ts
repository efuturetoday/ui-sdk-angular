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
} from "ui-sdk-angular"

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
      [minDays]="3"
      [maxDays]="8"
      [unavailable]="unavailable"
      allowUnavailable
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
class Example {
  protected readonly unavailable = { from: "2026-10-17", to: "2026-10-18" }
}

export { Example }
