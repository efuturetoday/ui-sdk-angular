import { Component } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiOtpInput,
  UiOtpInputGroup,
  UiOtpInputSlot,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiField, UiFieldLabel, UiOtpInput, UiOtpInputGroup, UiOtpInputSlot],
  template: `
    <div uiField dir="rtl">
      <label uiFieldLabel>رمز التحقق</label>
      <div uiOtpInput [maxLength]="6">
        <div uiOtpInputGroup>
          @for (index of [0, 1, 2, 3, 4, 5]; track index) {
            <div uiOtpInputSlot [index]="index"></div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
