import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
} from "ngx-ui-sdk/select"

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
    <div uiField>
      <label uiFieldLabel>Reviewer</label
      ><ng-container uiSelect defaultValue="hollis"
        ><button uiSelectTrigger>
          <span uiSelectValue #current="uiSelectValue"
            ><span data-slot="badge">{{
              current.state().label.slice(0, 1)
            }}</span>
            {{ current.state().label }}</span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          @for (member of members; track member.value) {
            <div
              uiSelectItem
              #entry="uiSelectItem"
              [value]="member.value"
              [label]="member.name"
              [disabled]="member.value === 'wren'"
            >
              <span data-slot="badge">{{ member.name.slice(0, 1) }}</span><span
                data-slot="stack"
                >{{ member.name
                }}<span data-slot="hint">{{
                  entry.state().disabled ? "Out of office" : member.email
                }}</span></span
              ><span *uiSelectItemIndicator="let indicator">
                @if (indicator().selected) {
                  <svg lucideCheck aria-hidden="true"></svg>
                }
              </span>
            </div>
          }</div
      ></ng-container>
    </div>
  `,
})
class Example {
  protected readonly members = [
    { value: "hollis", name: "Hollis Grant", email: "hollis@example.com" },
    { value: "ines", name: "Inès Moreau", email: "ines@example.com" },
    { value: "kofi", name: "Kofi Mensah", email: "kofi@example.com" },
    { value: "wren", name: "Wren Takahashi", email: "wren@example.com" },
  ]
}

export { Example }
