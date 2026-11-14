import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  createSelectController,
  UiField,
  UiFieldLabel,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="openAndWait()">Open and Wait</button
        ><button type="button" (click)="status.setValue('done')">
          Mark Done</button
        ><button type="button" (click)="status.clear()">Clear</button
        ><button type="button" (click)="status.focus()">Focus</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Status</label
        ><button uiSelectTrigger [controller]="status">
          <span uiSelectValue></span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
      </div>
      <ng-container
        uiSelect
        [controller]="status"
        [items]="statuses"
        placeholder="Select a status"
        ><div *uiSelectContent>
          @for (item of statuses; track item.value) {
            <div uiSelectItem [value]="item.value">
              {{ item.label }}
              <span *uiSelectItemIndicator
                ><svg lucideCheck aria-hidden="true"></svg
              ></span>
            </div>
          }</div
      ></ng-container>
    </div>
  `,
})
class Example {
  protected readonly statuses = [
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "Todo" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ]
  protected readonly status = createSelectController<string>()
  protected readonly log = injectLog()

  protected async openAndWait() {
    const { reason } = await this.status.open()
    this.log(`Closed by ${reason}, with ${this.status.getValue() ?? "nothing"}`)
  }
}

export { Example }
