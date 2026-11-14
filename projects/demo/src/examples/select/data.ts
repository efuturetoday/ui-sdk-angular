import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  type ListData,
  UiField,
  UiFieldLabel,
  UiSelect,
  UiSelectContent,
  UiSelectGroup,
  UiSelectGroupLabel,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectSeparator,
  UiSelectTrigger,
  UiSelectValue,
} from "ngx-ui-sdk"

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
    UiSelectSeparator,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Plan</label
      ><ng-container uiSelect [items]="items" defaultValue="pro"
        ><button uiSelectTrigger>
          <span uiSelectValue></span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          @for (plan of plans; track plan.value) {
            <div uiSelectItem [value]="plan.value">
              {{ plan.label }}
              <span *uiSelectItemIndicator
                ><svg lucideCheck aria-hidden="true"></svg
              ></span>
            </div>
          }
          <div uiSelectSeparator></div>
          <div uiSelectGroup>
            <div uiSelectGroupLabel>Contact sales</div>
            @for (plan of sales; track plan.value) {
              <div uiSelectItem [value]="plan.value" [disabled]="plan.disabled">
                {{ plan.label }}
                <span *uiSelectItemIndicator
                  ><svg lucideCheck aria-hidden="true"></svg
                ></span>
              </div>
            }
          </div></div
      ></ng-container>
    </div>
  `,
})
class Example {
  protected readonly plans = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
    { value: "team", label: "Team" },
  ]
  protected readonly sales = [
    { value: "enterprise", label: "Enterprise" },
    { value: "education", label: "Education", disabled: true },
  ]
  protected readonly items: ListData = [
    ...this.plans,
    { type: "separator" },
    { type: "group", label: "Contact sales", items: this.sales },
  ]
}

export { Example }
