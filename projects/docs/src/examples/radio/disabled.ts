import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import {
  UiRadio,
  UiRadioInput,
  UiRadioGroup,
  UiRadioIndicator,
} from "@ngx-ui-sdk/core/radio"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiRadio,
    UiRadioInput,
    UiRadioGroup,
    UiRadioIndicator,
  ],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Theme</label>
        <p uiFieldDescription>Set by your organization.</p>
        <div uiRadioGroup defaultValue="light" disabled>
          @for (theme of themes; track theme.value) {
            <label data-slot="label">
              <button uiRadio #radio="uiRadio" [value]="theme.value">
                <span *uiRadioIndicator></span>
              </button>
              <input [uiRadioInput]="radio" />
              {{ theme.label }}
            </label>
          }
        </div>
      </div>
      <div uiField>
        <label uiFieldLabel>Backups</label>
        <p uiFieldDescription>Hourly backups need the Pro plan.</p>
        <div uiRadioGroup defaultValue="daily">
          @for (backup of backups; track backup.value) {
            <label data-slot="label">
              <button
                uiRadio
                #radio2="uiRadio"
                [value]="backup.value"
                [disabled]="backup.disabled">
                <span *uiRadioIndicator></span>
              </button>
              <input [uiRadioInput]="radio2" />
              {{ backup.label }}
            </label>
          }
        </div>
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
  protected readonly backups = [
    { value: "hourly", label: "Hourly", disabled: true },
    { value: "daily", label: "Daily", disabled: false },
    { value: "weekly", label: "Weekly", disabled: false },
  ]
}

export { Example }
