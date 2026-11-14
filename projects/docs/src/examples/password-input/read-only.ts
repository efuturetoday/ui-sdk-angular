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
    <div uiField name="recovery-key">
      <label uiFieldLabel>Recovery key</label>
      <div
        uiPasswordInput
        readOnly
        defaultValue="7Hq2-vX9p-Lm4c"
        autoComplete="off"
      >
        <input uiPasswordInputControl />
        <button
          uiPasswordInputToggle
          #toggle="uiPasswordInputToggle"
          aria-label="Show recovery key"
        >
          @if (toggle.state().visible) {
            <svg lucideEyeOff aria-hidden="true"></svg>
          } @else {
            <svg lucideEye aria-hidden="true"></svg>
          }
        </button>
      </div>
      <p uiFieldDescription>
        Keep it somewhere safe. You can show it, but not change it.
      </p>
    </div>
  `,
})
class Example {}

export { Example }
