import { Component } from "@angular/core"
import { LucideMinus } from "@lucide/angular"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiOtpInput,
  UiOtpInputGroup,
  UiOtpInputSeparator,
  UiOtpInputSlot,
} from "@ngx-ui-sdk/core/otp-input"

@Component({
  selector: "app-example",
  imports: [
    LucideMinus,
    UiField,
    UiFieldLabel,
    UiOtpInput,
    UiOtpInputGroup,
    UiOtpInputSeparator,
    UiOtpInputSlot,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Recovery code</label>
      <div uiOtpInput [maxLength]="8" pattern="alphanumeric">
        <div uiOtpInputGroup>
          @for (index of [0, 1, 2, 3]; track index) {
            <div uiOtpInputSlot [index]="index"></div>
          }
        </div>
        <div uiOtpInputSeparator>
          <svg lucideMinus aria-hidden="true"></svg>
        </div>
        <div uiOtpInputGroup>
          @for (index of [4, 5, 6, 7]; track index) {
            <div uiOtpInputSlot [index]="index"></div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
