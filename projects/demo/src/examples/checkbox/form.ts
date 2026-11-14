import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
} from "ngx-ui-sdk/checkbox"
import { UiField, UiFieldDescription, UiFieldLabel } from "ngx-ui-sdk/field"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <button
          uiCheckbox
          #terms="uiCheckbox"
          name="terms"
          value="yes"
          required
        >
          <span *uiCheckboxIndicator>
            <svg lucideCheck aria-hidden="true"></svg>
          </span>
        </button>
        <input [uiCheckboxInput]="terms" />
        <div data-slot="stack">
          <label uiFieldLabel>Accept terms and conditions</label>
          <p uiFieldDescription>
            You agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      <div uiField>
        <button
          uiCheckbox
          #newsletter="uiCheckbox"
          name="newsletter"
          value="weekly"
          defaultChecked
        >
          <span *uiCheckboxIndicator>
            <svg lucideCheck aria-hidden="true"></svg>
          </span>
        </button>
        <input [uiCheckboxInput]="newsletter" />
        <div data-slot="stack">
          <label uiFieldLabel>Send me the weekly newsletter</label>
          <p uiFieldDescription>
            Product news and tips, once a week. Unsubscribe anytime.
          </p>
        </div>
      </div>
      <div data-slot="row">
        <button type="submit">Create Account</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    const entries = [
      ...new FormData(event.currentTarget as HTMLFormElement),
    ].map(([name, value]) => `${name}=${value}`)
    this.log(
      entries.length ? `Submitted ${entries.join("&")}` : "Submitted nothing"
    )
  }
}

export { Example }
