import { Component, signal } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  type CalendarValue,
  UiCalendar,
  UiCalendarDay,
  UiCalendarGrid,
  UiCalendarHeading,
  UiCalendarNext,
  UiCalendarPrevious,
  UiCalendarWeek,
  UiCalendarWeekday,
  UiCalendarWeekdays,
} from "@ngx-ui-sdk/core/calendar"
import { injectLog } from "../../shared/log"

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
    <div>
      <div
        uiCalendar
        [(value)]="value"
        [(month)]="month"
        (beforeValueChange)="
          log(
            'Selected ' +
              $any($event.value) +
              ' (' +
              $event.details.reason +
              ')'
          )
        "
        (beforeMonthChange)="
          log('Showing ' + $event.month + ' (' + $event.details.reason + ')')
        "
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
    </div>
  `,
})
class Example {
  protected readonly value = signal<CalendarValue | undefined>("2026-10-16")
  protected readonly month = signal<string | undefined>("2026-10")

  protected readonly log = injectLog()
}

export { Example }
