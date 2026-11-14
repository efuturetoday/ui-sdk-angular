import { Component } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiRadio,
  UiRadioInput,
  UiRadioGroup,
  UiRadioIndicator,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiRadioInput,
    UiField,
    UiFieldLabel,
    UiRadio,
    UiRadioGroup,
    UiRadioIndicator,
  ],
  template: `
    <div dir="rtl">
      <div uiField>
        <label uiFieldLabel>سرعة الشحن</label>
        <div uiRadioGroup defaultValue="express">
          @for (speed of speeds; track speed.value) {
            <label data-slot="label">
              <button uiRadio #radio="uiRadio" [value]="speed.value">
                <span *uiRadioIndicator></span>
              </button>
              <input [uiRadioInput]="radio" />
              {{ speed.label }}
            </label>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly speeds = [
    { value: "standard", label: "عادي" },
    { value: "express", label: "سريع" },
    { value: "overnight", label: "خلال ليلة" },
  ]
}

export { Example }
