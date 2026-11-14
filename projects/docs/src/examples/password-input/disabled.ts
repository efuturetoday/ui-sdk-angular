import { Component } from "@angular/core"
import { LucideEye, LucideEyeOff } from "@lucide/angular"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import {
  UiPasswordInput,
  UiPasswordInputControl,
  UiPasswordInputToggle,
} from "@ngx-ui-sdk/core/password-input"

@Component({
  selector: "app-example",
  imports: [
    LucideEye,
    LucideEyeOff,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiPasswordInput,
    UiPasswordInputControl,
    UiPasswordInputToggle,
  ],
  template: `
    <div uiField name="password" disabled>
      <label uiFieldLabel>Password</label>
      <div uiPasswordInput defaultValue="hunter22">
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
      <p uiFieldDescription>Your administrator manages this password.</p>
    </div>
  `,
})
class Example {}

export { Example }
