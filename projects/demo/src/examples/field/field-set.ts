import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldGroup,
  UiFieldLabel,
  UiFieldLegend,
  UiFieldSet,
  UiInput,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldGroup,
    UiFieldLabel,
    UiFieldLegend,
    UiFieldSet,
    UiInput,
  ],
  template: `
    <fieldset uiFieldSet>
      <legend uiFieldLegend>Address</legend>
      <p uiFieldDescription>We need your address to deliver your order.</p>
      <div uiFieldGroup>
        <div uiField name="street">
          <label uiFieldLabel>Street address</label>
          <input uiInput autocomplete="street-address" />
        </div>
        <div data-slot="grid">
          <div uiField name="city">
            <label uiFieldLabel>City</label>
            <input uiInput autocomplete="address-level2" />
          </div>
          <div uiField name="postal-code">
            <label uiFieldLabel>Postal code</label>
            <input uiInput autocomplete="postal-code" />
          </div>
        </div>
      </div>
    </fieldset>
  `,
})
class Example {}

export { Example }
