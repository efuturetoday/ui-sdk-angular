import { Component } from "@angular/core"
import { UiFieldLegend, UiFieldSet } from "ngx-ui-sdk/field"
import { UiSwitch, UiSwitchInput, UiSwitchThumb } from "ngx-ui-sdk/switch"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiFieldLegend, UiFieldSet, UiSwitch, UiSwitchInput, UiSwitchThumb],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <fieldset uiFieldSet>
        <legend uiFieldLegend>Email notifications</legend>
        <label data-slot="label">
          Product updates
          <button uiSwitch #updates="uiSwitch" name="updates">
            <span uiSwitchThumb></span>
          </button>
          <input [uiSwitchInput]="updates" />
        </label>
        <label data-slot="label">
          Security alerts
          <button uiSwitch #security="uiSwitch" name="security" defaultChecked>
            <span uiSwitchThumb></span>
          </button>
          <input [uiSwitchInput]="security" />
        </label>
        <label data-slot="label">
          Weekly digest
          <button
            uiSwitch
            #digest="uiSwitch"
            name="digest"
            value="weekly"
            defaultChecked
          >
            <span uiSwitchThumb></span>
          </button>
          <input [uiSwitchInput]="digest" />
        </label>
      </fieldset>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    const entries = [
      ...new FormData(event.currentTarget as HTMLFormElement),
    ].map(([name, value]) => `${name}=${value}`)
    this.log(
      entries.length ? `Submitted ${entries.join("&")}` : "Submitted nothing"
    )
  }
}

export { Example }
