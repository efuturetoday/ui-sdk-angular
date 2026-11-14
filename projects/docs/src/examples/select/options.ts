import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  type ListData,
  UiSelect,
  UiSelectContent,
  UiSelectGroup,
  UiSelectGroupLabel,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectGroup,
    UiSelectGroupLabel,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Size</label
      ><ng-container
        uiSelect
        [items]="sizeGroups"
        name="size"
        defaultValue="Medium"
        ><button uiSelectTrigger>
          <span uiSelectValue></span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          @for (group of sizeGroups; track group.label) {
            <div uiSelectGroup>
              <div uiSelectGroupLabel>{{ group.label }}</div>
              @for (size of group.items; track size) {
                <div uiSelectItem [value]="size">
                  {{ size }}
                  <span *uiSelectItemIndicator
                    ><svg lucideCheck aria-hidden="true"></svg
                  ></span>
                </div>
              }
            </div>
          }</div
      ></ng-container>
    </div>
  `,
})
class Example {
  protected readonly sizeGroups = [
    { type: "group", label: "Common", items: ["Small", "Medium", "Large"] },
    { type: "group", label: "Extended", items: ["Extra small", "Extra large"] },
  ] satisfies ListData
}

export { Example }
