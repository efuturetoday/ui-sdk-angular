import { UiText } from "@ngx-ui-sdk/core"
import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
} from "@ngx-ui-sdk/core/checkbox"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
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
    UiText,
    LucideCheck,
    LucideChevronDown,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
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
        <label data-slot="label">
          <button
            uiCheckbox
            #box="uiCheckbox"
            [checked]="aligned()"
            (checkedChange)="aligned.set($event === true)"
          >
            <span *uiCheckboxIndicator>
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
          </button>
          <input [uiCheckboxInput]="box" />
          Align item with trigger
        </label>
      </div>
      <div uiField>
        <label uiFieldLabel>Priority</label>
        <ng-container uiSelect defaultValue="medium">
          <button uiSelectTrigger>
            <span uiSelectValue uiText></span>
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent="let state; alignItemWithTrigger: aligned()">
            @for (priority of priorities; track priority.value) {
              <div uiSelectItem [value]="priority.value">
                {{ priority.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {
  protected readonly priorities = [
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
    { value: "none", label: "No priority" },
  ]
  protected readonly aligned = signal(true)
}

export { Example }
