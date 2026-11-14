import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
} from "ngx-ui-sdk/field"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
} from "ngx-ui-sdk/select"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <form data-slot="stack" (submit)="submit($event)">
      <div uiField name="shipping">
        <label uiFieldLabel>Shipping method</label
        ><ng-container uiSelect required placeholder="Select a shipping method"
          ><button uiSelectTrigger>
            <span uiSelectValue></span
            ><svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent>
            @for (method of methods; track method.value) {
              <div uiSelectItem [value]="method.value">
                {{ method.label }}
                <span *uiSelectItemIndicator
                  ><svg lucideCheck aria-hidden="true"></svg
                ></span>
              </div>
            }</div
        ></ng-container>
        <p uiFieldDescription>Express arrives in two business days.</p>
        <div *uiFieldError="let state; match: 'valueMissing'">
          Choose a shipping method.
        </div>
      </div>
      <button type="submit" data-variant="solid">Continue</button>
    </form>
  `,
})
class Example {
  protected readonly methods = [
    { value: "standard", label: "Standard" },
    { value: "express", label: "Express" },
    { value: "overnight", label: "Overnight" },
  ]
  protected readonly log = injectLog()

  protected submit(event: Event) {
    event.preventDefault()
    this.log(
      `Submitted shipping=${new FormData(event.currentTarget as HTMLFormElement).get("shipping")}`
    )
  }
}

export { Example }
