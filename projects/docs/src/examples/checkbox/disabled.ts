import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
} from "@ngx-ui-sdk/core/checkbox"

@Component({
  selector: "app-example",
  imports: [UiCheckboxInput, LucideCheck, UiCheckbox, UiCheckboxIndicator],
  template: `
    <div data-slot="stack">
      <label data-slot="label">
        <button uiCheckbox #box="uiCheckbox" defaultChecked>
          <span *uiCheckboxIndicator>
            <svg lucideCheck aria-hidden="true"></svg>
          </span>
        </button>
        <input [uiCheckboxInput]="box" />
        Product updates
      </label>
      <label data-slot="label">
        <button uiCheckbox #box2="uiCheckbox" defaultChecked disabled>
          <span *uiCheckboxIndicator>
            <svg lucideCheck aria-hidden="true"></svg>
          </span>
        </button>
        <input [uiCheckboxInput]="box2" />
        Security alerts
      </label>
    </div>
  `,
})
class Example {}

export { Example }
