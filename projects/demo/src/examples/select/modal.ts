import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
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
      <div data-slot="controls" role="group" aria-label="Modal">
        @for (mode of modes; track mode.label) {
          <button
            type="button"
            [attr.aria-pressed]="modal() === mode.value"
            (click)="modal.set(mode.value)"
          >
            {{ mode.label }}
          </button>
        }
      </div>
      <div uiField>
        <label uiFieldLabel>Status</label
        ><ng-container uiSelect [modal]="modal()" defaultValue="todo"
          ><button uiSelectTrigger>
            <span uiSelectValue></span
            ><svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent>
            @for (status of statuses; track status.value) {
              <div uiSelectItem [value]="status.value">
                {{ status.label }}
                <span *uiSelectItemIndicator
                  ><svg lucideCheck aria-hidden="true"></svg
                ></span>
              </div>
            }</div
        ></ng-container>
      </div>
      <button type="button" (click)="log('Pressed Save Draft')">
        Save Draft
      </button>
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
  protected readonly modes = [
    { value: "pointer", label: "Pointer" },
    { value: true, label: "Modal" },
    { value: false, label: "Non-modal" },
  ] as const
  protected readonly modal = signal<boolean | "pointer">("pointer")
  protected readonly log = injectLog()
}

export { Example }
