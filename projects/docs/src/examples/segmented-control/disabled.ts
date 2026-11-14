import { Component } from "@angular/core"
import {
  UiSegmentedControl,
  UiSegmentedControlIndicator,
  UiSegmentedControlInput,
  UiSegmentedControlItem,
} from "@ngx-ui-sdk/core/segmented-control"

@Component({
  selector: "app-example",
  imports: [
    UiSegmentedControl,
    UiSegmentedControlIndicator,
    UiSegmentedControlInput,
    UiSegmentedControlItem,
  ],
  template: `
    <div data-slot="stack">
      <div uiSegmentedControl aria-label="Theme" defaultValue="system" disabled>
        <span uiSegmentedControlIndicator></span>
        <button
          uiSegmentedControlItem
          #light="uiSegmentedControlItem"
          value="light">
          Light
        </button>
        <input [uiSegmentedControlInput]="light" />
        <button
          uiSegmentedControlItem
          #dark="uiSegmentedControlItem"
          value="dark">
          Dark
        </button>
        <input [uiSegmentedControlInput]="dark" />
        <button
          uiSegmentedControlItem
          #system="uiSegmentedControlItem"
          value="system">
          System
        </button>
        <input [uiSegmentedControlInput]="system" />
      </div>
      <div
        uiSegmentedControl
        aria-label="Billing period"
        defaultValue="monthly">
        <span uiSegmentedControlIndicator></span>
        <button
          uiSegmentedControlItem
          #monthly="uiSegmentedControlItem"
          value="monthly">
          Monthly
        </button>
        <input [uiSegmentedControlInput]="monthly" />
        <button
          uiSegmentedControlItem
          #yearly="uiSegmentedControlItem"
          value="yearly">
          Yearly
        </button>
        <input [uiSegmentedControlInput]="yearly" />
        <button
          uiSegmentedControlItem
          #lifetime="uiSegmentedControlItem"
          value="lifetime"
          disabled>
          Lifetime
        </button>
        <input [uiSegmentedControlInput]="lifetime" />
      </div>
    </div>
  `,
})
class Example {}

export { Example }
