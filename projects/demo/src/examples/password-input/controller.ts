import { Component } from "@angular/core"
import { LucideEye, LucideEyeOff } from "@lucide/angular"
import { injectLog } from "../../shared/log"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import {
  UiPasswordInput,
  UiPasswordInputControl,
  UiPasswordInputToggle,
  createPasswordInputController,
} from "ngx-ui-sdk/password-input"

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
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="suggest()">Suggest</button>
        <button type="button" (click)="password.toggleVisible()">Toggle</button>
        <button type="button" (click)="password.clear()">Clear</button>
        <button type="button" (click)="read()">Read</button>
        <button type="button" (click)="password.focus()">Focus</button>
      </div>
      <div uiField name="new-password">
        <label uiFieldLabel>New password</label>
        <div
          uiPasswordInput
          [controller]="password"
          autoComplete="new-password"
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
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly password = createPasswordInputController()

  protected suggest() {
    this.password.setValue("plum-kettle-orbit-42")
    this.password.setVisible(true)
  }

  protected read() {
    this.log(
      `${this.password.getValue().length} characters, ${this.password.isVisible() ? "shown" : "hidden"}`
    )
  }
}

export { Example }
