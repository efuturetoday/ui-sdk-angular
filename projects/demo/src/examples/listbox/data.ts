import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  type ListData,
  UiListbox,
  UiListboxItem,
  UiListboxItemIndicator,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

type Plan = { id: string; price: number }

@Component({
  selector: "app-example",
  imports: [LucideCheck, UiListbox, UiListboxItem, UiListboxItemIndicator],
  template: `
    <div
      uiListbox
      [items]="plans"
      [defaultValue]="plans[1].value"
      [itemToValue]="itemToValue"
      [isItemEqualToValue]="isItemEqualToValue"
      aria-label="Plan"
      (beforeValueChange)="onValueChange($any($event.value))"
    >
      @for (plan of plans; track plan.value.id) {
        <div uiListboxItem [value]="plan.value" [disabled]="plan.disabled">
          {{ plan.label }}
          <span *uiListboxItemIndicator
            ><svg lucideCheck aria-hidden="true"></svg
          ></span>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly plans = [
    { value: { id: "hobby", price: 0 }, label: "Hobby" },
    { value: { id: "pro", price: 20 }, label: "Pro" },
    { value: { id: "team", price: 50 }, label: "Team" },
    {
      value: { id: "enterprise", price: 200 },
      label: "Enterprise",
      disabled: true,
    },
  ] satisfies ListData<Plan>
  protected readonly log = injectLog()
  protected readonly itemToValue = (plan: { id: string }) => plan.id
  protected readonly isItemEqualToValue = (
    plan: { id: string },
    selected: { id: string }
  ) => plan.id === selected.id

  protected onValueChange(plan: Plan | null) {
    this.log(plan ? `${plan.id}, $${plan.price} a month` : "No plan")
  }
}

export { Example }
