import { Component } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiSegmentedControl,
  UiSegmentedControlIndicator,
  UiSegmentedControlInput,
  UiSegmentedControlItem,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldLabel,
    UiSegmentedControl,
    UiSegmentedControlIndicator,
    UiSegmentedControlInput,
    UiSegmentedControlItem,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Vertical alignment</label>
      <div uiSegmentedControl orientation="vertical" defaultValue="middle">
        <span uiSegmentedControlIndicator></span>
        <button
          uiSegmentedControlItem
          #top="uiSegmentedControlItem"
          value="top"
        >
          Top
        </button>
        <input [uiSegmentedControlInput]="top" />
        <button
          uiSegmentedControlItem
          #middle="uiSegmentedControlItem"
          value="middle"
        >
          Middle
        </button>
        <input [uiSegmentedControlInput]="middle" />
        <button
          uiSegmentedControlItem
          #bottom="uiSegmentedControlItem"
          value="bottom"
        >
          Bottom
        </button>
        <input [uiSegmentedControlInput]="bottom" />
      </div>
    </div>
  `,
})
class Example {}

export { Example }
