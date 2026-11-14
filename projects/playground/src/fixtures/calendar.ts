import { UiText } from "@ngx-ui-sdk/core"
import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  calendarAction,
  calendarFixture as f,
  calendarOptions,
} from "tests/fixtures/calendar"
import {
  createCalendarController,
  UiCalendar,
  UiCalendarDay,
  UiCalendarGrid,
  UiCalendarHeading,
  UiCalendarMonthSelect,
  UiCalendarNext,
  UiCalendarPrevious,
  UiCalendarWeek,
  UiCalendarWeekday,
  UiCalendarWeekdays,
  UiCalendarYearSelect,
  type CalendarValue,
} from "@ngx-ui-sdk/core/calendar"

// Upstream's fixture. Vue renders a grid's weekdays, weeks and days and a
// select's options without content; here they're written from the states.
@Component({
  selector: "app-fixture",
  imports: [UiText, 
    UiCalendar,
    UiCalendarDay,
    UiCalendarGrid,
    UiCalendarHeading,
    UiCalendarMonthSelect,
    UiCalendarNext,
    UiCalendarPrevious,
    UiCalendarWeek,
    UiCalendarWeekday,
    UiCalendarWeekdays,
    UiCalendarYearSelect,
  ],
  template: `
    <div class="fixture" [attr.lang]="o.lang">
      <button>Before</button>
      <div
        uiCalendar
        class="calendar"
        [today]="f.today"
        [controller]="controller"
        [mode]="o.mode"
        [min]="o.min"
        [max]="o.max"
        [months]="o.months"
        [pageBy]="o.pageBy"
        [unavailable]="o.unavailable"
        [weekStartsOn]="o.weekStartsOn"
        [fixedWeeks]="o.fixedWeeks"
        [showOutsideDays]="o.showOutsideDays"
        [minDays]="o.minDays"
        [maxDays]="o.maxDays"
        [allowUnavailable]="o.allowUnavailable"
        [disabled]="o.disabled"
        [readOnly]="o.readOnly"
        [value]="o.controlled ? value() : undefined"
        [defaultValue]="o.controlled ? undefined : o.defaultValue"
        [month]="o.controlled ? month() : undefined"
        [defaultMonth]="o.controlled ? undefined : o.defaultMonth"
        (beforeValueChange)="onValueChange($event.value, $event.details)"
        (beforeMonthChange)="onMonthChange($event.month, $event.details)"
      >
        <div class="calendar-header">
          <button uiCalendarPrevious class="calendar-step" uiText></button>
          <h2 uiCalendarHeading class="calendar-heading" uiText></h2>
          @if (o.selects) {
            <select uiCalendarMonthSelect #months="uiCalendarMonthSelect">
              @for (option of months.state().options; track option.value) {
                <option
                  [value]="option.value"
                  [disabled]="option.disabled"
                  [selected]="option.value === months.state().value"
                >
                  {{ option.label }}
                </option>
              }
            </select>
            <select uiCalendarYearSelect #years="uiCalendarYearSelect">
              @for (option of years.state().options; track option.value) {
                <option
                  [value]="option.value"
                  [disabled]="option.disabled"
                  [selected]="option.value === years.state().value"
                >
                  {{ option.label }}
                </option>
              }
            </select>
          }
          <button uiCalendarNext class="calendar-step" uiText></button>
        </div>
        <div class="calendar-months">
          @for (offset of offsets; track offset) {
            <table
              uiCalendarGrid
              #grid="uiCalendarGrid"
              [offset]="offset"
              class="calendar-grid"
            >
              <thead>
                <tr uiCalendarWeekdays>
                  @for (weekday of grid.state().weekdays; track weekday) {
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
          }
        </div>
      </div>
      <button (click)="controller.focus(f.controller.date)">
        {{ f.controller.label }}
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly o = calendarOptions()
  protected readonly controller = createCalendarController()
  protected readonly action = signal("")
  protected readonly value = signal<CalendarValue>(this.o.defaultValue)
  protected readonly month = signal(this.o.defaultMonth ?? f.today.slice(0, 7))
  protected readonly offsets = Array.from(
    { length: this.o.months ?? 1 },
    (_, offset) => offset
  )

  protected onValueChange(next: CalendarValue, details: ChangeDetails) {
    this.value.set(next)
    this.action.set(calendarAction("value", next, details.reason))
  }

  protected onMonthChange(next: string, details: ChangeDetails) {
    this.month.set(next)
    this.action.set(calendarAction("month", next, details.reason))
  }
}

export { Fixture }
