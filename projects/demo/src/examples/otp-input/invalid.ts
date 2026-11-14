import { Component, signal } from "@angular/core"
import {
  UiField,
  UiFieldError,
  UiFieldLabel,
  UiOtpInput,
  UiOtpInputGroup,
  UiOtpInputSlot,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldError,
    UiFieldLabel,
    UiOtpInput,
    UiOtpInputGroup,
    UiOtpInputSlot,
  ],
  template: `
    <div uiField [invalid]="invalid()">
      <label uiFieldLabel>Verification code</label>
      <div uiOtpInput defaultValue="482913" (valueChange)="invalid.set(false)">
        <div uiOtpInputGroup>
          @for (index of [0, 1, 2, 3, 4, 5]; track index) {
            <div uiOtpInputSlot [index]="index"></div>
          }
        </div>
      </div>
      <div *uiFieldError>That code has expired. Request a new one.</div>
    </div>
  `,
})
class Example {
  protected readonly invalid = signal(true)
}

export { Example }
