import { Component } from "@angular/core"
import { LucideEye, LucideEyeOff } from "@lucide/angular"
import { injectLog } from "../../shared/log"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import { UiInput } from "ngx-ui-sdk/input"
import {
  UiPasswordInput,
  UiPasswordInputControl,
  UiPasswordInputToggle,
} from "ngx-ui-sdk/password-input"

@Component({
  selector: "app-example",
  imports: [
    LucideEye,
    LucideEyeOff,
    UiField,
    UiFieldLabel,
    UiInput,
    UiPasswordInput,
    UiPasswordInputControl,
    UiPasswordInputToggle,
  ],
  template: `
    <div data-slot="stack">
      <form id="sign-in" data-slot="stack" (submit)="onSubmit($event)">
        <div uiField name="email">
          <label uiFieldLabel>Email</label>
          <input uiInput type="email" required autocomplete="username" />
        </div>
      </form>
      <div uiField>
        <label uiFieldLabel>Password</label>
        <div uiPasswordInput name="password" form="sign-in" required>
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
      <div data-slot="row">
        <button type="submit" form="sign-in" data-variant="solid">
          Sign In
        </button>
        <button type="reset" form="sign-in">Reset</button>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    const length = String(data.get("password")).length
    this.log(
      `Signed in as ${data.get("email")}, with a password of ${length} characters`
    )
  }
}

export { Example }
