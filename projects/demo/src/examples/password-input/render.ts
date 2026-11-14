import { Component } from "@angular/core"
import { LucideEye, LucideEyeOff } from "@lucide/angular"
import {
  UiField,
  UiFieldLabel,
  UiPasswordInput,
  UiPasswordInputControl,
  UiPasswordInputToggle,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideEye,
    LucideEyeOff,
    UiField,
    UiFieldLabel,
    UiPasswordInput,
    UiPasswordInputControl,
    UiPasswordInputToggle,
  ],
  template: `
    <div uiField name="password">
      <label uiFieldLabel>Password</label>
      <div uiPasswordInput>
        <input uiPasswordInputControl />
        <button
          uiPasswordInputToggle
          #toggle="uiPasswordInputToggle"
          aria-label="Show password"
        >
          @if (toggle.state().visible) {
            <svg lucideEyeOff aria-hidden="true"></svg>
          } @else {
            <svg lucideEye aria-hidden="true"></svg>
          }
        </button>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
