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
  UiDatePickerPreset,
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
    UiDatePickerPreset,
    UiDatePickerTrigger,
  ],
  template: `
    <div uiDatePicker mode="range" today="2026-10-16">
      <div data-slot="row">
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
      <div *uiDatePickerContent="let state">
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
        <div data-slot="row">
          <button
            uiDatePickerPreset
            data-variant="ghost"
            [value]="['2026-10-10', '2026-10-16']"
          >
            Last 7 Days
          </button>
          <button
            uiDatePickerPreset
            data-variant="ghost"
            [value]="['2026-09-17', '2026-10-16']"
          >
            Last 30 Days
          </button>
          <button
            uiDatePickerPreset
            data-variant="ghost"
            [value]="['2026-10-01', '2026-10-31']"
          >
            This Month
          </button>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
