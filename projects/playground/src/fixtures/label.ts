import { Component } from "@angular/core"
import { labelFixture } from "tests/fixtures/label"
import {
  UiCheckbox,
  UiCheckboxInput,
} from "ngx-ui-sdk/checkbox"
import {
  UiLabel,
} from "ngx-ui-sdk/label"
import {
  UiRadio,
  UiRadioGroup,
  UiRadioInput,
} from "ngx-ui-sdk/radio"

@Component({
  selector: "app-fixture",
  imports: [
    UiCheckbox,
    UiCheckboxInput,
    UiLabel,
    UiRadio,
    UiRadioGroup,
    UiRadioInput,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <label uiLabel [for]="email.id">{{ email.label }}</label>
      <input [id]="email.id" />
      <label uiLabel [for]="plan.id">{{ plan.label }}</label>
      <div
        uiRadioGroup
        [id]="plan.id"
        class="radio-group"
        [defaultValue]="plan.defaultValue"
      >
        @for (item of plan.items; track item.value) {
          <button uiRadio #radio="uiRadio" class="radio" [value]="item.value">
            {{ item.label }}
          </button>
          <input [uiRadioInput]="radio" />
        }
      </div>
      <label uiLabel>
        <button uiCheckbox #terms="uiCheckbox" class="checkbox"></button>
        <input [uiCheckboxInput]="terms" />
        {{ f.terms.label }}
      </label>
      <label uiLabel [for]="region.id">{{ region.label }}</label>
      <div uiRadioGroup [id]="region.id" class="radio-group" disabled>
        @for (item of region.items; track item.value) {
          <button uiRadio #radio="uiRadio" class="radio" [value]="item.value">
            {{ item.label }}
          </button>
          <input [uiRadioInput]="radio" />
        }
      </div>
      <label uiLabel [for]="delivery.id">{{ delivery.label }}</label>
      <div
        uiRadioGroup
        [id]="delivery.id"
        class="radio-group"
        [attr.aria-label]="delivery.name"
      >
        @for (item of delivery.items; track item.value) {
          <button uiRadio #radio="uiRadio" class="radio" [value]="item.value">
            {{ item.label }}
          </button>
          <input [uiRadioInput]="radio" />
        }
      </div>
      <button>After</button>
    </div>
  `,
})
class Fixture {
  protected readonly f = labelFixture
  protected readonly email = labelFixture.email
  protected readonly plan = labelFixture.plan
  protected readonly region = labelFixture.region
  protected readonly delivery = labelFixture.delivery
}

export { Fixture }
