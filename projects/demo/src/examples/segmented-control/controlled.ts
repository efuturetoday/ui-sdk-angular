import { Component, signal } from "@angular/core"
import { injectLog } from "../../shared/log"
import {
  UiSegmentedControl,
  UiSegmentedControlIndicator,
  UiSegmentedControlInput,
  UiSegmentedControlItem,
  createSegmentedControlController,
} from "ngx-ui-sdk/segmented-control"

@Component({
  selector: "app-example",
  imports: [
    UiSegmentedControl,
    UiSegmentedControlIndicator,
    UiSegmentedControlInput,
    UiSegmentedControlItem,
  ],
  template: `
    <div>
      <div data-slot="controls">
        <button type="button" (click)="range.setValue('month')">
          Show Month
        </button>
      </div>
      <div
        uiSegmentedControl
        [(value)]="value"
        aria-label="Range"
        [controller]="range"
        (beforeValueChange)="
          log('value: ' + $event.value + ' (' + $event.details.reason + ')')
        "
      >
        <span uiSegmentedControlIndicator></span>
        <button
          uiSegmentedControlItem
          #day="uiSegmentedControlItem"
          value="day"
        >
          Day
        </button>
        <input [uiSegmentedControlInput]="day" />
        <button
          uiSegmentedControlItem
          #week="uiSegmentedControlItem"
          value="week"
        >
          Week
        </button>
        <input [uiSegmentedControlInput]="week" />
        <button
          uiSegmentedControlItem
          #month="uiSegmentedControlItem"
          value="month"
        >
          Month
        </button>
        <input [uiSegmentedControlInput]="month" />
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly range = createSegmentedControlController()
  protected readonly value = signal<string | null>("week")
}

export { Example }
