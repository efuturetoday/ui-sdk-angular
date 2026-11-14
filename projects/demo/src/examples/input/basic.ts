import { Component } from "@angular/core"
import { LucideX } from "@lucide/angular"
import { UiField, UiFieldDescription, UiFieldLabel } from "ngx-ui-sdk/field"
import {
  UiInput,
  UiInputClear,
  UiInputGroup,
  type InputValueChangeReason,
} from "ngx-ui-sdk/input"
import type { ChangeDetails } from "@ui-sdk/core"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideX,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiInput,
    UiInputClear,
    UiInputGroup,
  ],
  template: `
    <div uiField name="website">
      <label uiFieldLabel>Website</label>
      <div uiInputGroup>
        <span>https://</span>
        <input
          uiInput
          placeholder="example.com"
          defaultValue="hollisgrant.com"
          (beforeValueChange)="onChange($event)"
        />
        <button *uiInputClear aria-label="Clear website">
          <svg lucideX aria-hidden="true"></svg>
        </button>
      </div>
      <p uiFieldDescription>Shown on your public profile.</p>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onChange({
    value,
    details,
  }: {
    value: string
    details: ChangeDetails<InputValueChangeReason>
  }) {
    this.log(`${value ? `“${value}”` : "Empty"} (${details.reason})`)
  }
}

export { Example }
