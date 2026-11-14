import { Component } from "@angular/core"
import { LucideMinus } from "@lucide/angular"
import {
  UiOtpInput,
  UiOtpInputGroup,
  UiOtpInputSeparator,
  UiOtpInputSlot,
} from "ngx-ui-sdk/otp-input"

@Component({
  selector: "app-example",
  imports: [
    LucideMinus,
    UiOtpInput,
    UiOtpInputGroup,
    UiOtpInputSeparator,
    UiOtpInputSlot,
  ],
  template: `
    <div uiOtpInput [maxLength]="6" aria-label="Verification code">
      <div uiOtpInputGroup>
        <div uiOtpInputSlot [index]="0"></div>
        <div uiOtpInputSlot [index]="1"></div>
      </div>
      <div uiOtpInputSeparator><svg lucideMinus aria-hidden="true"></svg></div>
      <div uiOtpInputGroup>
        <div uiOtpInputSlot [index]="2"></div>
        <div uiOtpInputSlot [index]="3"></div>
      </div>
      <div uiOtpInputSeparator><svg lucideMinus aria-hidden="true"></svg></div>
      <div uiOtpInputGroup>
        <div uiOtpInputSlot [index]="4"></div>
        <div uiOtpInputSlot [index]="5"></div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
