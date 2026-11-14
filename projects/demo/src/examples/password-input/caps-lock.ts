import { Component } from "@angular/core"
import { LucideEye, LucideEyeOff, LucideLock } from "@lucide/angular"
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
    LucideLock,
    UiField,
    UiFieldLabel,
    UiPasswordInput,
    UiPasswordInputControl,
    UiPasswordInputToggle,
  ],
  template: `
    <div uiField name="password">
      <label uiFieldLabel>Password</label>
      <div uiPasswordInput #password="uiPasswordInput">
        <input uiPasswordInputControl />
        <span>
          @if (password.state().capsLock) {
            <svg lucideLock aria-hidden="true"></svg>
          }
        </span>
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
      <p data-slot="caps-lock">Caps Lock is on.</p>
    </div>
  `,
})
class Example {}

export { Example }
