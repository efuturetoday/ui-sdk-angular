import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
} from "ngx-ui-sdk/checkbox"

@Component({
  selector: "app-example",
  imports: [UiCheckboxInput, LucideCheck, UiCheckbox, UiCheckboxIndicator],
  template: `
    <div data-slot="stack" dir="rtl">
      <label data-slot="label">
        <button uiCheckbox #box="uiCheckbox">
          <span *uiCheckboxIndicator>
            <svg lucideCheck></svg>
          </span>
        </button>
        <input [uiCheckboxInput]="box" />
        قبول الشروط والأحكام
      </label>
      <label data-slot="label">
        <button uiCheckbox #box2="uiCheckbox" defaultChecked>
          <span *uiCheckboxIndicator>
            <svg lucideCheck></svg>
          </span>
        </button>
        <input [uiCheckboxInput]="box2" />
        تفعيل الإشعارات
      </label>
    </div>
  `,
})
class Example {}

export { Example }
