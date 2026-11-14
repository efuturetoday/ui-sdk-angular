import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideX } from "@lucide/angular"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  type SelectValueChangeDetails,
  UiSelect,
  UiSelectClear,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    LucideCheck,
    LucideChevronDown,
    LucideX,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectClear,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Assignee</label>
      <ng-container
        uiSelect
        defaultValue="ines"
        placeholder="Unassigned"
        (beforeValueChange)="onValueChange($event.value, $event.details)">
        <div data-slot="row">
          <button uiSelectTrigger>
            <span uiSelectValue uiText></span>
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <button *uiSelectClear aria-label="Clear assignee">
            <svg lucideX aria-hidden="true"></svg>
          </button>
        </div>
        <div *uiSelectContent>
          @for (person of people; track person.value) {
            <div uiSelectItem [value]="person.value">
              {{ person.label }}
              <span *uiSelectItemIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
              </span>
            </div>
          }
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly people = [
    { value: "hollis", label: "Hollis Grant" },
    { value: "ines", label: "Inès Moreau" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "wren", label: "Wren Takahashi" },
    { value: "tomasz", label: "Tomasz Wójcik" },
  ]
  protected readonly log = injectLog()

  protected onValueChange(value: unknown, details: SelectValueChangeDetails) {
    this.log(`value: ${JSON.stringify(value)} (${details.reason})`)
  }
}

export { Example }
