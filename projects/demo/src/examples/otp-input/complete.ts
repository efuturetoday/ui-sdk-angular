import { Component } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiOtpInput,
  UiOtpInputGroup,
  UiOtpInputSlot,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiField, UiFieldLabel, UiOtpInput, UiOtpInputGroup, UiOtpInputSlot],
  template: `
    <div uiField>
      <label uiFieldLabel>Verification code</label>
      <div
        uiOtpInput
        (valueCommit)="
          log('Checking ' + $event.value + ' (' + $event.details.reason + ')')
        "
      >
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
  protected readonly log = injectLog()
}

export { Example }
