import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import { UiInput } from "@ngx-ui-sdk/core/input"

@Component({
  selector: "app-example",
  imports: [UiField, UiFieldDescription, UiFieldLabel, UiInput],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Username</label>
        <input
          uiInput
          name="username"
          placeholder="hollis"
          autocomplete="username"
        />
        <p uiFieldDescription>Choose a unique username for your account.</p>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
