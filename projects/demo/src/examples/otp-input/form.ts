import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
  UiOtpInput,
  UiOtpInputGroup,
  UiOtpInputSlot,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
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
                <div uiOtpInputSlot [index]="index"></div>
              }
            </div>
          </div>
          <p uiFieldDescription>
            Enter the six-digit code we sent to hollis@example.com.
          </p>
          <div *uiFieldError></div>
        </div>
      </form>
      <div uiField>
        <label uiFieldLabel>Recovery code (optional)</label>
        <div
          uiOtpInput
          name="recovery"
          form="verify-sign-in"
          [maxLength]="8"
          pattern="alphanumeric"
        >
          <div uiOtpInputGroup>
            @for (index of [0, 1, 2, 3, 4, 5, 6, 7]; track index) {
              <div uiOtpInputSlot [index]="index"></div>
            }
          </div>
        </div>
        <div *uiFieldError></div>
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
