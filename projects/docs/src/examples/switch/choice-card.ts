import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import { UiSwitch, UiSwitchInput, UiSwitchThumb } from "@ngx-ui-sdk/core/switch"

@Component({
  selector: "app-example",
  imports: [
    UiSwitchInput,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiSwitch,
    UiSwitchThumb,
  ],
  template: `
    <div data-slot="stack">
      @for (setting of settings; track setting.label) {
        <div uiField data-variant="card">
          <div data-slot="stack">
            <label uiFieldLabel>{{ setting.label }}</label>
            <p uiFieldDescription>{{ setting.description }}</p>
          </div>
          <button
            uiSwitch
            #toggle="uiSwitch"
            [defaultChecked]="setting.defaultChecked"
          >
            <span uiSwitchThumb></span>
          </button>
          <input [uiSwitchInput]="toggle" />
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly settings = [
    {
      label: "Public profile",
      description: "Anyone can see your name and photo.",
      defaultChecked: false,
    },
    {
      label: "Show activity status",
      description: "Teammates can see when you're online.",
      defaultChecked: true,
    },
  ]
}

export { Example }
