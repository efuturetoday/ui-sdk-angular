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
    <div uiField>
      <label uiFieldLabel>Theme</label>
      <div uiRadioGroup defaultValue="system">
        @for (theme of themes; track theme.value) {
          <label data-slot="label">
            <button uiRadio #radio="uiRadio" [value]="theme.value">
              <span *uiRadioIndicator="let state; keepMounted: true"></span>
            </button>
            <input [uiRadioInput]="radio" />
            {{ theme.label }}
          </label>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]
}

export { Example }
