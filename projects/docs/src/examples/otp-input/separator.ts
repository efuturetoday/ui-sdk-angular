import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { LucideMinus } from "@lucide/angular"
import {
  UiOtpInput,
  UiOtpInputGroup,
  UiOtpInputSeparator,
  UiOtpInputSlot,
} from "@ngx-ui-sdk/core/otp-input"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    LucideMinus,
    UiOtpInput,
    UiOtpInputGroup,
    UiOtpInputSeparator,
    UiOtpInputSlot,
  ],
  template: `
    <div uiOtpInput [maxLength]="6" aria-label="Verification code">
      <div uiOtpInputGroup>
        <div uiOtpInputSlot [index]="0" uiText></div>
        <div uiOtpInputSlot [index]="1" uiText></div>
      </div>
      <div uiOtpInputSeparator><svg lucideMinus aria-hidden="true"></svg></div>
      <div uiOtpInputGroup>
        <div uiOtpInputSlot [index]="2" uiText></div>
        <div uiOtpInputSlot [index]="3" uiText></div>
      </div>
      <div uiOtpInputSeparator><svg lucideMinus aria-hidden="true"></svg></div>
      <div uiOtpInputGroup>
        <div uiOtpInputSlot [index]="4" uiText></div>
        <div uiOtpInputSlot [index]="5" uiText></div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
