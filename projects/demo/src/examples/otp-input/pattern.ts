import { Component } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiOtpInput,
  UiOtpInputGroup,
  UiOtpInputSlot,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [UiField, UiFieldLabel, UiOtpInput, UiOtpInputGroup, UiOtpInputSlot],
  template: `
    <div uiField>
      <label uiFieldLabel>Device code</label>
      <div uiOtpInput [maxLength]="6" [pattern]="pattern" inputMode="text">
        <div uiOtpInputGroup>
          @for (index of [0, 1, 2, 3, 4, 5]; track index) {
            <div uiOtpInputSlot [index]="index"></div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly pattern = /[0-9A-F]/i
}

export { Example }
