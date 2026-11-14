import { Component } from "@angular/core"
import {
  LucideMousePointer2,
  LucidePencil,
  LucideSquare,
  LucideTrash2,
  LucideType,
} from "@lucide/angular"
import { UiToggle, UiToggleGroup, UiToggleIcon } from "@ngx-ui-sdk/core/toggle"
import {
  UiToolbar,
  UiToolbarButton,
  UiToolbarSeparator,
} from "@ngx-ui-sdk/core/toolbar"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideMousePointer2,
    LucidePencil,
    LucideSquare,
    LucideTrash2,
    LucideType,
    UiToggle,
    UiToggleGroup,
    UiToggleIcon,
    UiToolbar,
    UiToolbarButton,
    UiToolbarSeparator,
  ],
  template: `
    <div uiToolbar orientation="vertical" aria-label="Canvas">
      <div
        uiToggleGroup
        [defaultValue]="['select']"
        [deselectable]="false"
        orientation="vertical"
        aria-label="Tool"
        (valueChange)="onTool($event[0])">
        <button uiToggle value="select" aria-label="Select">
          <span uiToggleIcon><svg lucideMousePointer2></svg></span>
        </button>
        <button uiToggle value="draw" aria-label="Draw">
          <span uiToggleIcon><svg lucidePencil></svg></span>
        </button>
        <button uiToggle value="shape" aria-label="Shape">
          <span uiToggleIcon><svg lucideSquare></svg></span>
        </button>
        <button uiToggle value="text" aria-label="Text">
          <span uiToggleIcon><svg lucideType></svg></span>
        </button>
      </div>
      <div uiToolbarSeparator></div>
      <button
        uiToolbarButton
        aria-label="Delete"
        (click)="log('Deleted selection')">
        <svg lucideTrash2 aria-hidden="true"></svg>
      </button>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly tools = [
    { value: "select", label: "Select" },
    { value: "draw", label: "Draw" },
    { value: "shape", label: "Shape" },
    { value: "text", label: "Text" },
  ]

  protected onTool(value: string | undefined) {
    this.log(`${this.tools.find((tool) => tool.value === value)?.label} tool`)
  }
}

export { Example }
