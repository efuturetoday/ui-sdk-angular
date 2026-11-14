import { UiText } from "@ngx-ui-sdk/core"
import { Component, signal } from "@angular/core"
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
  type DatePickerValue,
  UiDatePicker,
  UiDatePickerContent,
  UiDatePickerInput,
  UiDatePickerTrigger,
} from "@ngx-ui-sdk/core/date-picker"

@Component({
  selector: "app-example",
  imports: [
    UiText,
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
    UiDatePickerTrigger,
  ],
  template: `
    <div
      uiDatePicker
      [(value)]="value"
      mode="range"
      defaultMonth="2026-10"
      [dismissible]="value() !== null"
      (valueChange)="asking.set(false)"
      (openChange)="onOpen($event)"
      (dismissAttempt)="asking.set(true)">
      <div data-slot="row">
        <input uiDatePickerInput aria-label="Check in" placeholder="Check in" />
        <span data-slot="hint">–</span>
        <input
          uiDatePickerInput
          end
          aria-label="Check out"
          placeholder="Check out" />
        <button uiDatePickerTrigger data-variant="ghost">
          <svg lucideCalendar aria-hidden="true"></svg>
        </button>
      </div>
      <div *uiDatePickerContent="let state">
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
        @if (asking()) {
          <p data-slot="hint" role="alert">
            Pick a check-out date to finish your stay.
          </p>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly value = signal<DatePickerValue | undefined>(null)
  protected readonly asking = signal(false)

  protected onOpen(open: boolean) {
    if (open) {
      this.asking.set(false)
    }
  }
}

export { Example }
