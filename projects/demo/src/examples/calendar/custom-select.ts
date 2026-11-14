import { Component, computed, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiCalendar,
  UiCalendarDay,
  UiCalendarGrid,
  UiCalendarHeading,
  UiCalendarWeek,
  UiCalendarWeekday,
  UiCalendarWeekdays,
} from "@ngx-ui-sdk/core/calendar"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiCalendar,
    UiCalendarDay,
    UiCalendarGrid,
    UiCalendarHeading,
    UiCalendarWeek,
    UiCalendarWeekday,
    UiCalendarWeekdays,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div
      uiCalendar
      [(month)]="month"
      defaultValue="2026-10-16"
      min="2024-01-01"
      max="2028-12-31"
    >
      <div data-slot="row">
        <h2 uiCalendarHeading></h2>
        <ng-container
          uiSelect
          [items]="months"
          [value]="monthOfYear()"
          (valueChange)="setMonth($event)"
        >
          <button uiSelectTrigger aria-label="Month">
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (option of months; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator><svg lucideCheck></svg></span>
              </div>
            }
          </div>
        </ng-container>
        <ng-container
          uiSelect
          [items]="years"
          [value]="year()"
          (valueChange)="setYear($event)"
        >
          <button uiSelectTrigger aria-label="Year">
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (option of years; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator><svg lucideCheck></svg></span>
              </div>
            }
          </div>
        </ng-container>
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
  protected readonly months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((label, index) => ({
    value: String(index + 1).padStart(2, "0"),
    label,
  }))
  protected readonly years = ["2024", "2025", "2026", "2027", "2028"].map(
    (year) => ({ value: year, label: year })
  )
  protected readonly month = signal<string | undefined>("2026-10")
  protected readonly year = computed(() => this.month()?.split("-")[0])
  protected readonly monthOfYear = computed(() => this.month()?.split("-")[1])

  protected setMonth(next: unknown) {
    if (next) {
      this.month.set(`${this.year()}-${next}`)
    }
  }

  protected setYear(next: unknown) {
    if (next) {
      this.month.set(`${next}-${this.monthOfYear()}`)
    }
  }
}

export { Example }
