import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
  UiInput,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiField, UiFieldDescription, UiFieldError, UiFieldLabel, UiInput],
  template: `
    <form data-slot="stack" (submit)="submit($event)">
      <div uiField name="email">
        <label uiFieldLabel>Email</label>
        <input uiInput type="email" required placeholder="hollis@example.com" />
        <p uiFieldDescription #hint="uiFieldDescription">
          {{
            hint.state()?.valid
              ? "Looks good."
              : "We'll send you a confirmation link."
          }}
        </p>
        <div *uiFieldError="let state; match: 'valueMissing'">
          Enter your email address.
        </div>
        <div *uiFieldError="let state; match: 'typeMismatch'">
          Enter an email address like hollis@example.com.
        </div>
      </div>
      <div uiField name="website">
        <label uiFieldLabel>Website</label>
        <input uiInput type="url" required placeholder="https://example.com" />
        <div *uiFieldError></div>
      </div>
      <button type="submit" data-variant="solid">Subscribe</button>
    </form>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected submit(event: Event) {
    event.preventDefault()
    this.log(
      `Subscribed ${new FormData(event.currentTarget as HTMLFormElement).get("email")}`
    )
  }
}

export { Example }
