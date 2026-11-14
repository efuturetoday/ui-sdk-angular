import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import {
  UiOtpInput,
  UiOtpInputGroup,
  UiOtpInputSlot,
} from "@ngx-ui-sdk/core/otp-input"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
    UiOtpInput,
    UiOtpInputGroup,
    UiOtpInputSlot,
  ],
  template: `
    <div data-slot="stack">
      <form id="verify-sign-in" (submit)="onSubmit($event)">
        <div uiField>
          <label uiFieldLabel>Verification code</label>
          <div uiOtpInput name="code" required>
            <div uiOtpInputGroup>
              @for (index of [0, 1, 2, 3, 4, 5]; track index) {
                <div uiOtpInputSlot [index]="index" uiText></div>
              }
            </div>
          </div>
          <p uiFieldDescription>
            Enter the six-digit code we sent to hollis@example.com.
          </p>
          <div *uiFieldError uiText></div>
        </div>
      </form>
      <div uiField>
        <label uiFieldLabel>Recovery code (optional)</label>
        <div
          uiOtpInput
          name="recovery"
          form="verify-sign-in"
          [maxLength]="8"
          pattern="alphanumeric">
          <div uiOtpInputGroup>
            @for (index of [0, 1, 2, 3, 4, 5, 6, 7]; track index) {
              <div uiOtpInputSlot [index]="index" uiText></div>
            }
          </div>
        </div>
        <div *uiFieldError uiText></div>
      </div>
      <div data-slot="row">
        <button type="reset" form="verify-sign-in">Reset</button>
        <button type="submit" form="verify-sign-in" data-variant="solid">
          Verify
        </button>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`
    )
    this.log(`Submitted ${data.join(", ")}`)
  }
}

export { Example }
