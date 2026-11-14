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
} from "@ngx-ui-sdk/core/calendar"

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
    <div uiCalendar today="2026-10-16" defaultValue="2026-10-16">
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
              <th
                uiCalendarWeekday
                #wd="uiCalendarWeekday"
                scope="col"
                [index]="$index"
              >
                <abbr
                  [title]="wd.state().name"
                  [attr.data-weekend]="
                    wd.state().weekday === 0 ||
                    wd.state().weekday === 6 ||
                    undefined
                  "
                >
                  {{ wd.state().label }}
                </abbr>
              </th>
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
                  <td uiCalendarDay #day="uiCalendarDay" [value]="cell.date">
                    <span data-slot="stack">
                      <span>{{ day.state().label }}</span>
                      @if (!day.state().outside && !day.state().disabled) {
                        <span data-slot="hint"
                          >\${{ priceOf(day.state().date) }}</span
                        >
                      }
                    </span>
                  </td>
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
  protected readonly priceOf = (date: string) =>
    80 + ((Number(date.slice(8)) * 7) % 5) * 10
}

export { Example }
