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
      <label uiFieldLabel>Verification code</label>
      <div uiOtpInput [maxLength]="6">
        <div uiOtpInputGroup>
          <div uiOtpInputSlot [index]="0"></div>
          <div uiOtpInputSlot [index]="1"></div>
          <div uiOtpInputSlot [index]="2"></div>
        </div>
        <div uiOtpInputSeparator>
          <svg lucideMinus aria-hidden="true"></svg>
        </div>
        <div uiOtpInputGroup>
          <div uiOtpInputSlot [index]="3"></div>
          <div uiOtpInputSlot [index]="4"></div>
          <div uiOtpInputSlot [index]="5"></div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
