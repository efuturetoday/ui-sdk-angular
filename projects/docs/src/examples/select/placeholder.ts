import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
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
      <div uiField>
        <label uiFieldLabel>Size</label>
        <ng-container uiSelect placeholder="Select a size">
          <button uiSelectTrigger>
            <span uiSelectValue uiText></span>
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent>
            @for (size of sizes; track size) {
              <div uiSelectItem [value]="size">
                {{ size }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <div uiField>
        <label uiFieldLabel>Gift wrap</label>
        <ng-container uiSelect>
          <button uiSelectTrigger>
            <span uiSelectValue placeholder="None" uiText></span>
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent>
            @for (wrap of wraps; track wrap) {
              <div uiSelectItem [value]="wrap">
                {{ wrap }}
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
  protected readonly sizes = [
    "Extra small",
    "Small",
    "Medium",
    "Large",
    "Extra large",
  ]
  protected readonly wraps = ["Paper", "Ribbon", "Box"]
}

export { Example }
