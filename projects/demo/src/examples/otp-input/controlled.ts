import { Component, signal } from "@angular/core"
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
      <label uiFieldLabel>One-time password</label>
      <div
        uiOtpInput
        [(value)]="value"
        (beforeValueChange)="
          log(($event.value || 'Empty') + ' (' + $event.details.reason + ')')
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
  protected readonly value = signal("")
}

export { Example }
