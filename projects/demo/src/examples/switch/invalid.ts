import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import { UiSwitch, UiSwitchInput, UiSwitchThumb } from "@ngx-ui-sdk/core/switch"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
    UiSwitch,
    UiSwitchInput,
    UiSwitchThumb,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <div data-slot="row">
          <div data-slot="stack">
            <label uiFieldLabel>Two-factor authentication</label>
            <p uiFieldDescription>Required for admins of this workspace.</p>
          </div>
          <button uiSwitch #twoFactor="uiSwitch" name="two-factor" required>
            <span uiSwitchThumb></span>
          </button>
          <input [uiSwitchInput]="twoFactor" />
        </div>
        <div *uiFieldError="let state; match: 'valueMissing'">
          Turn this on to continue.
        </div>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Continue</button>
      </div>
    </form>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.log(
      `Submitted two-factor=${new FormData(event.currentTarget as HTMLFormElement).get("two-factor")}`
    )
  }
}

export { Example }
