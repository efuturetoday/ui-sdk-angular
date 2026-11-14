import { Component } from "@angular/core"
import {
  LucideAlignCenter,
  LucideAlignLeft,
  LucideAlignRight,
  LucideList,
  LucideListOrdered,
} from "@lucide/angular"
import { UiToggle, UiToggleGroup, UiToggleIcon } from "@ngx-ui-sdk/core/toggle"
import { UiToolbar, UiToolbarSeparator } from "@ngx-ui-sdk/core/toolbar"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideAlignCenter,
    LucideAlignLeft,
    LucideAlignRight,
    LucideList,
    LucideListOrdered,
    UiToggle,
    UiToggleGroup,
    UiToggleIcon,
    UiToolbar,
    UiToolbarSeparator,
  ],
  template: `
    <div uiToolbar aria-label="Paragraph">
      <div
        uiToggleGroup
        [defaultValue]="['left']"
        [deselectable]="false"
        aria-label="Alignment"
        (valueChange)="log('Align ' + $event[0])">
        <button uiToggle value="left" aria-label="Align left">
          <span uiToggleIcon><svg lucideAlignLeft></svg></span>
        </button>
        <button uiToggle value="center" aria-label="Align center">
          <span uiToggleIcon><svg lucideAlignCenter></svg></span>
        </button>
        <button uiToggle value="right" aria-label="Align right">
          <span uiToggleIcon><svg lucideAlignRight></svg></span>
        </button>
      </div>
      <div uiToolbarSeparator></div>
      <div uiToggleGroup aria-label="List" (valueChange)="onList($event[0])">
        <button uiToggle value="bulleted" aria-label="Bulleted list">
          <span uiToggleIcon><svg lucideList></svg></span>
        </button>
        <button uiToggle value="numbered" aria-label="Numbered list">
          <span uiToggleIcon><svg lucideListOrdered></svg></span>
        </button>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly lists = [
    { value: "bulleted", label: "Bulleted list" },
    { value: "numbered", label: "Numbered list" },
  ]

  protected onList(value: string | undefined) {
    this.log(
      this.lists.find((list) => list.value === value)?.label ?? "No list"
    )
  }
}

export { Example }
