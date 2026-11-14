import { Component } from "@angular/core"
import {
  UiFieldDescription,
  UiFieldLegend,
  UiFieldSet,
  UiRadio,
  UiRadioInput,
  UiRadioGroup,
  UiRadioIndicator,
} from "ngx-ui-sdk"
import { uniqueId } from "../../shared/id"

@Component({
  selector: "app-example",
  imports: [
    UiFieldDescription,
    UiFieldLegend,
    UiFieldSet,
    UiRadio,
    UiRadioInput,
    UiRadioGroup,
    UiRadioIndicator,
  ],
  template: `
    <fieldset uiFieldSet>
      <legend uiFieldLegend [id]="id + '-legend'">Billing period</legend>
      <p uiFieldDescription [id]="id + '-description'">
        Yearly billing gets you two months free.
      </p>
      <div
        uiRadioGroup
        defaultValue="monthly"
        [attr.aria-labelledby]="id + '-legend'"
        [attr.aria-describedby]="id + '-description'"
      >
        @for (period of periods; track period.value) {
          <label data-slot="label">
            <button uiRadio #radio="uiRadio" [value]="period.value">
              <span *uiRadioIndicator></span>
            </button>
            <input [uiRadioInput]="radio" />
            {{ period.label }}
            <span data-slot="hint">({{ period.price }})</span>
          </label>
        }
      </div>
    </fieldset>
  `,
})
class Example {
  protected readonly periods = [
    { value: "monthly", label: "Monthly", price: "$12 per month" },
    { value: "yearly", label: "Yearly", price: "$120 per year" },
  ]
  protected readonly id = uniqueId()
}

export { Example }
