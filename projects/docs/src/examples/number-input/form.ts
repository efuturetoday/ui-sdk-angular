import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputDecrement,
  UiNumberInputGroup,
  UiNumberInputIncrement,
} from "@ngx-ui-sdk/core/number-input"
import { injectLog } from "../../shared/log"
import { uniqueId } from "../../shared/id"

@Component({
  selector: "app-example",
  imports: [
    LucideMinus,
    LucidePlus,
    UiField,
    UiFieldLabel,
    UiNumberInput,
    UiNumberInputControl,
    UiNumberInputDecrement,
    UiNumberInputGroup,
    UiNumberInputIncrement,
  ],
  template: `
    <div data-slot="stack">
      <form [id]="form" data-slot="stack" (submit)="onSubmit($event)">
        <div uiField>
          <label uiFieldLabel>Quantity</label>
          <div uiNumberInput name="quantity" [defaultValue]="2" [min]="1">
            <div uiNumberInputGroup>
              <button uiNumberInputDecrement aria-label="Decrease">
                <svg lucideMinus aria-hidden="true"></svg>
              </button>
              <input uiNumberInputControl />
              <button uiNumberInputIncrement aria-label="Increase">
                <svg lucidePlus aria-hidden="true"></svg>
              </button>
            </div>
          </div>
        </div>
        <div uiField>
          <label uiFieldLabel>Tip</label>
          <div
            uiNumberInput
            name="tip"
            [defaultValue]="4.5"
            [min]="0"
            [step]="0.5"
            [format]="{ style: 'currency', currency: 'USD' }">
            <div uiNumberInputGroup>
              <button uiNumberInputDecrement aria-label="Decrease">
                <svg lucideMinus aria-hidden="true"></svg>
              </button>
              <input uiNumberInputControl />
              <button uiNumberInputIncrement aria-label="Increase">
                <svg lucidePlus aria-hidden="true"></svg>
              </button>
            </div>
          </div>
        </div>
      </form>
      <div uiField>
        <label uiFieldLabel>Gift cards</label>
        <div
          uiNumberInput
          name="gift-cards"
          [form]="form"
          [defaultValue]="0"
          [min]="0">
          <div uiNumberInputGroup>
            <button uiNumberInputDecrement aria-label="Decrease">
              <svg lucideMinus aria-hidden="true"></svg>
            </button>
            <input uiNumberInputControl />
            <button uiNumberInputIncrement aria-label="Increase">
              <svg lucidePlus aria-hidden="true"></svg>
            </button>
          </div>
        </div>
      </div>
      <div data-slot="row">
        <button type="reset" [attr.form]="form">Reset</button>
        <button type="submit" [attr.form]="form" data-variant="solid">
          Save
        </button>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly form = uniqueId()

  protected onSubmit(event: Event) {
    event.preventDefault()
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`
    )
    this.log(`Submitted ${data.join(", ")}`)
  }
}

export { Example }
