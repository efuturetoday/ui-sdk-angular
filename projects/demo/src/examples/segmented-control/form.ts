import { Component } from "@angular/core"
import { injectLog } from "../../shared/log"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
  UiSegmentedControl,
  UiSegmentedControlIndicator,
  UiSegmentedControlInput,
  UiSegmentedControlItem,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiSegmentedControl,
    UiSegmentedControlIndicator,
    UiSegmentedControlInput,
    UiSegmentedControlItem,
  ],
  template: `
    <form data-slot="stack" (submit)="submit($event)">
      <div uiField>
        <label uiFieldLabel>Theme</label>
        <div uiSegmentedControl name="theme" required defaultValue="system">
          <span uiSegmentedControlIndicator></span>
          <button
            uiSegmentedControlItem
            #light="uiSegmentedControlItem"
            value="light"
          >
            Light
          </button>
          <input [uiSegmentedControlInput]="light" />
          <button
            uiSegmentedControlItem
            #dark="uiSegmentedControlItem"
            value="dark"
          >
            Dark
          </button>
          <input [uiSegmentedControlInput]="dark" />
          <button
            uiSegmentedControlItem
            #system="uiSegmentedControlItem"
            value="system"
          >
            System
          </button>
          <input [uiSegmentedControlInput]="system" />
        </div>
        <p uiFieldDescription>System follows your device's setting.</p>
      </div>
      <div uiField>
        <label uiFieldLabel>Density</label>
        <div uiSegmentedControl name="density" defaultValue="comfortable">
          <span uiSegmentedControlIndicator></span>
          <button
            uiSegmentedControlItem
            #compact="uiSegmentedControlItem"
            value="compact"
          >
            Compact
          </button>
          <input [uiSegmentedControlInput]="compact" />
          <button
            uiSegmentedControlItem
            #comfortable="uiSegmentedControlItem"
            value="comfortable"
          >
            Comfortable
          </button>
          <input [uiSegmentedControlInput]="comfortable" />
        </div>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected submit(event: Event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    this.log(`Saved theme=${data.get("theme")}, density=${data.get("density")}`)
  }
}

export { Example }
