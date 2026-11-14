import { Component, signal } from "@angular/core"
import { LucideEye, LucideEyeOff } from "@lucide/angular"
import { injectLog } from "../../shared/log"
import {
  UiField,
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
    UiFieldLabel,
    UiPasswordInput,
    UiPasswordInputControl,
    UiPasswordInputToggle,
  ],
  template: `
    <div uiField name="password">
      <label uiFieldLabel>Password</label>
      <div
        uiPasswordInput
        [(visible)]="visible"
        (beforeVisibleChange)="onVisibleChange($event.visible, $event.details)"
      >
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
class Example {
  protected readonly log = injectLog()
  protected readonly visible = signal(false)

  protected onVisibleChange(next: boolean, details: { reason: string }) {
    this.log(`${next ? "Shown" : "Hidden"} (${details.reason})`)
  }
}

export { Example }
