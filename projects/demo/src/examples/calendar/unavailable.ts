import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  type DateMatchers,
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
    <div uiCalendar [unavailable]="unavailable">
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
  protected readonly unavailable: DateMatchers = [
    "2026-10-08",
    { from: "2026-10-20", to: "2026-10-23" },
    { weekday: [0, 6] },
  ]
}

export { Example }
