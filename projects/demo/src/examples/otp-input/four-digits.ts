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
    <div uiField>
      <label uiFieldLabel>PIN</label>
      <div uiOtpInput [maxLength]="4" textAlign="center">
        <div uiOtpInputGroup>
          @for (index of [0, 1, 2, 3]; track index) {
            <div uiOtpInputSlot [index]="index"></div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
