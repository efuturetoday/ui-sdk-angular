import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
  UiInput,
} from "ui-sdk-angular"

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
