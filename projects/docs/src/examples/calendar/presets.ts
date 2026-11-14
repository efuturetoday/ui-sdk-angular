import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { addDays, endOfMonth, startOfMonth } from "@ui-sdk/core/date"
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

const today = "2026-10-16"

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
        @for (preset of presets; track preset.label) {
          <button type="button" data-size="sm" (click)="choose(preset.range)">
            {{ preset.label }}
          </button>
        }
      </div>
      <div
        uiCalendar
        mode="range"
        [controller]="calendar"
        [today]="today"
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
  protected readonly today = today
  protected readonly presets = [
    { label: "Last 7 Days", range: [addDays(today, -6), today] },
    { label: "This Month", range: [startOfMonth(today), endOfMonth(today)] },
    { label: "Next 30 Days", range: [today, addDays(today, 29)] },
  ] as const
  protected readonly calendar = createCalendarController()

  protected choose(range: readonly [string, string]) {
    this.calendar.setValue([...range])
    this.calendar.focus(range[0])
  }
}

export { Example }
