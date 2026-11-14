import { Component } from "@angular/core"
import {
  LucideCalendar,
  LucideChevronLeft,
  LucideChevronRight,
} from "@lucide/angular"
import {
  type DatePickerMonthChangeReason,
  type DatePickerOpenChangeReason,
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
  UiDatePickerHint,
  UiDatePickerInput,
  UiDatePickerTrigger,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

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
    UiDatePickerHint,
    UiDatePickerInput,
    UiDatePickerTrigger,
  ],
  template: `
    <div data-slot="stack">
      <div
        uiDatePicker
        [defaultOpen]="false"
        presentation="auto"
        [container]="container"
        (beforeOpenChange)="onOpenChange($event.open, $event.details)"
        (openChangeComplete)="onOpenChangeComplete($event)"
        (beforeMonthChange)="onMonthChange($event.month, $event.details)"
      >
        <div #anchor data-slot="row">
          <input uiDatePickerInput aria-label="Due date" />
          <button uiDatePickerTrigger data-variant="ghost">
            <svg lucideCalendar aria-hidden="true"></svg>
          </button>
        </div>
        <span uiDatePickerHint></span>
        <div
          *uiDatePickerContent="
            let state;
            anchor: anchor;
            sideOffset: 6;
            collisionPadding: 16;
            keepMounted: true
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
      <div #container></div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onOpenChange(
    open: boolean,
    details: { reason: DatePickerOpenChangeReason }
  ) {
    this.log(`${open ? "Opened" : "Closed"} (${details.reason})`)
  }

  protected onOpenChangeComplete(open: boolean) {
    if (!open) {
      this.log("Finished closing")
    }
  }

  protected onMonthChange(
    month: string,
    details: { reason: DatePickerMonthChangeReason }
  ) {
    this.log(`Showing ${month} (${details.reason})`)
  }
}

export { Example }
