import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  createCheckboxGroupController,
  UiCheckbox,
  UiCheckboxInput,
  UiCheckboxGroup,
  UiCheckboxIndicator,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiCheckboxInput,
    LucideCheck,
    UiCheckbox,
    UiCheckboxGroup,
    UiCheckboxIndicator,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="schedule.setValue(weekdays)">
          Select Weekdays
        </button>
        <button type="button" (click)="schedule.setValue([])">Clear</button>
      </div>
      <h3 id="controlled-days">Working days</h3>
      <div
        uiCheckboxGroup
        [(value)]="value"
        aria-labelledby="controlled-days"
        [controller]="schedule"
        (beforeValueChange)="onValueChange($event.value, $event.details)"
      >
        @for (day of days; track day.value) {
          <label data-slot="label">
            <button uiCheckbox #box="uiCheckbox" [value]="day.value">
              <span *uiCheckboxIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
              </span>
            </button>
            <input [uiCheckboxInput]="box" />
            {{ day.label }}
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly days = [
    { value: "mon", label: "Monday" },
    { value: "tue", label: "Tuesday" },
    { value: "wed", label: "Wednesday" },
    { value: "thu", label: "Thursday" },
    { value: "fri", label: "Friday" },
    { value: "sat", label: "Saturday" },
    { value: "sun", label: "Sunday" },
  ]
  protected readonly weekdays = ["mon", "tue", "wed", "thu", "fri"]
  protected readonly log = injectLog()
  protected readonly schedule = createCheckboxGroupController()
  protected readonly value = signal(["mon", "tue"])

  protected onValueChange(next: string[], details: ChangeDetails) {
    const names = this.days
      .filter((day) => next.includes(day.value))
      .map((day) => day.label)
    this.log(`${names.join(", ") || "No days"} (${details.reason})`)
  }
}

export { Example }
