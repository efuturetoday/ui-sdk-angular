import { Component } from "@angular/core"
import { LucideEye, LucideEyeOff } from "@lucide/angular"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
  UiPasswordInput,
  UiPasswordInputControl,
  UiPasswordInputToggle,
} from "ui-sdk-angular"

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
    <div dir="rtl">
      <div uiField name="password">
        <label uiFieldLabel>كلمة المرور</label>
        <div uiPasswordInput>
          <input uiPasswordInputControl />
          <button
            uiPasswordInputToggle
            #toggle="uiPasswordInputToggle"
            aria-label="إظهار كلمة المرور"
          >
            @if (toggle.state().visible) {
              <svg lucideEyeOff aria-hidden="true"></svg>
            } @else {
              <svg lucideEye aria-hidden="true"></svg>
            }
          </button>
        </div>
        <p uiFieldDescription>ثمانية أحرف على الأقل.</p>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
