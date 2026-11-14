import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  UiCalendar,
  UiCalendarDay,
  UiCalendarGrid,
  UiCalendarHeading,
  UiCalendarNext,
  UiCalendarPrevious,
  UiCalendarWeekday,
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
    UiCalendarWeekday,
  ],
  template: `
    <div uiCalendar defaultValue="2026-10-16" [weekStartsOn]="1">
      <div data-slot="row">
        <button
          uiCalendarPrevious
          #previous="uiCalendarPrevious"
          data-variant="ghost"
          [title]="'Show ' + previous.state().month"
        >
          <svg lucideChevronLeft></svg>
        </button>
        <h2 uiCalendarHeading #heading="uiCalendarHeading">
          {{ heading.state().label }}
        </h2>
        <button uiCalendarNext data-variant="ghost">
          <svg lucideChevronRight></svg>
        </button>
      </div>
      <table uiCalendarGrid #grid="uiCalendarGrid">
        <thead>
          <tr>
            <th scope="col"><abbr title="Week">Wk</abbr></th>
            @for (
              weekday of grid.state().weekdays;
              track weekday;
              let index = $index
            ) {
              <th uiCalendarWeekday scope="col" [index]="index"></th>
            }
          </tr>
        </thead>
        <tbody>
          @for (week of grid.state().weeks; track week[0]!.date) {
            <tr>
              <th scope="row" data-slot="hint">{{ isoWeek(week[0]!.date) }}</th>
              @for (cell of week; track cell.date) {
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
  protected isoWeek(date: string) {
    const day = new Date(`${date}T00:00:00Z`)
    day.setUTCDate(day.getUTCDate() + 3 - ((day.getUTCDay() + 6) % 7))
    const firstThursday = new Date(Date.UTC(day.getUTCFullYear(), 0, 4))
    const days = (day.getTime() - firstThursday.getTime()) / 86400000
    return (
      1 + Math.round((days - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7)
    )
  }
}

export { Example }
