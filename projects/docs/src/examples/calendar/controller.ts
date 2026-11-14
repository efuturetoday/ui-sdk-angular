import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { todayDate } from "@ui-sdk/core/date"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  createCalendarController,
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

@Component({
  selector: "app-example",
  imports: [
    UiText,
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
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="select('2026-12-25')">
          Go to Christmas
        </button>
        <button type="button" (click)="select(today())">Today</button>
      </div>
      <div
        uiCalendar
        [controller]="calendar"
        defaultValue="2026-10-16"
        defaultMonth="2026-10"
      >
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
                <th uiCalendarWeekday scope="col" [index]="$index" uiText></th>
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
  `,
})
class Example {
  protected readonly calendar = createCalendarController()
  protected readonly today = todayDate

  protected select(date: string) {
    this.calendar.setValue(date)
    this.calendar.focus(date)
  }
}

export { Example }
