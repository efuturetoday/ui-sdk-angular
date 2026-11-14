import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import {
  UiSegmentedControl,
  UiSegmentedControlIndicator,
  UiSegmentedControlInput,
  UiSegmentedControlItem,
} from "ngx-ui-sdk/segmented-control"

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
      <label uiFieldLabel>View</label>
      <div uiSegmentedControl defaultValue="list">
        <span uiSegmentedControlIndicator></span>
        <button
          uiSegmentedControlItem
          #list="uiSegmentedControlItem"
          value="list"
        >
          List
        </button>
        <input [uiSegmentedControlInput]="list" />
        <button
          uiSegmentedControlItem
          #grid="uiSegmentedControlItem"
          value="grid"
        >
          Grid
        </button>
        <input [uiSegmentedControlInput]="grid" />
        <button
          uiSegmentedControlItem
          #board="uiSegmentedControlItem"
          value="board"
        >
          Board
        </button>
        <input [uiSegmentedControlInput]="board" />
      </div>
    </div>
  `,
})
class Example {}

export { Example }
