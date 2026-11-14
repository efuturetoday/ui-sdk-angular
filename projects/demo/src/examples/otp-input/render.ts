import { Component } from "@angular/core"
import { UiOtpInput, UiOtpInputGroup, UiOtpInputSlot } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiOtpInput, UiOtpInputGroup, UiOtpInputSlot],
  template: `
    <div uiOtpInput #otp="uiOtpInput" [maxLength]="5" aria-label="Invite code">
      <div uiOtpInputGroup>
        @for (slot of otp.state().slots; track $index) {
          <span uiOtpInputSlot #current="uiOtpInputSlot" [index]="$index">
            @if (current.state().char) {
              {{ current.state().char }}
            } @else if (current.state().hasFakeCaret) {
              <span></span>
            }
          </span>
        }
      </div>
    </div>
  `,
})
class Example {}

export { Example }
