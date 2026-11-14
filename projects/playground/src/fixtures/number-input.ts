import { Component, signal } from "@angular/core"
import { serialize } from "tests/fixtures/slider"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import {
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputDecrement,
  UiNumberInputGroup,
  UiNumberInputIncrement,
  UiNumberInputScrubArea,
} from "@ngx-ui-sdk/core/number-input"

type Value = number | null

// Upstream's tests/fixtures/number-input.ts, inlined: it re-exports `serialize`
// with a ".ts" path, which this build can't compile. Its docs are there.
const numberInputFixture = {
  formLabel: "Order",
  quantity: {
    label: "Quantity",
    name: "quantity",
    defaultValue: 1,
    min: 1,
    max: 99,
    description: "Up to 99.",
    decrement: "Decrease quantity",
    increment: "Increase quantity",
  },
  amount: {
    label: "Amount",
    name: "amount",
    defaultValue: 1234.5,
    min: 0,
    step: 0.01,
    currency: "USD",
    scrub: "Drag to adjust",
    decrement: "Decrease amount",
    increment: "Increase amount",
  },
}

// Upstream's options, documented there.
function numberInputOptions() {
  const params = new URLSearchParams(location.search)
  const quantity = params.get("quantity")
  return {
    quantity:
      quantity === null
        ? numberInputFixture.quantity.defaultValue
        : quantity === ""
          ? null
          : Number(quantity),
    required: params.has("required"),
    wheel: params.has("wheel"),
    disabled: params.has("disabled"),
    readOnly: params.has("readonly"),
    disabledIncrement: params.has("disabled-increment"),
    disabledIncrementButton: params.get("disabled-increment") === "button",
    locale: params.get("locale") ?? "en-US",
    amountMin: params.has("negative")
      ? undefined
      : numberInputFixture.amount.min,
    cancel: params.get("cancel"),
    controlled: params.has("controlled"),
  }
}

const f = numberInputFixture

@Component({
  selector: "app-fixture",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiNumberInput,
    UiNumberInputControl,
    UiNumberInputDecrement,
    UiNumberInputGroup,
    UiNumberInputIncrement,
    UiNumberInputScrubArea,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        <!-- The field names the quantity, so the field's name reaches the form. -->
        <div uiField [name]="f.quantity.name">
          <label uiFieldLabel>{{ f.quantity.label }}</label>
          <div
            uiNumberInput
            [wheel]="o.wheel"
            [disabled]="o.disabled"
            [readOnly]="o.readOnly"
            [locale]="o.locale"
            [min]="f.quantity.min"
            [max]="f.quantity.max"
            [required]="o.required"
            [value]="o.controlled ? quantity() : undefined"
            [defaultValue]="o.controlled ? undefined : o.quantity"
            (beforeValueChange)="
              report(f.quantity.name, $event.value, $event.details)
            "
            (valueChange)="quantity.set($event)"
            (valueCommit)="commit(f.quantity.name, $event.value)"
          >
            <div uiNumberInputGroup class="number-input-group">
              <button
                uiNumberInputDecrement
                [attr.aria-label]="f.quantity.decrement"
              >
                −
              </button>
              <input uiNumberInputControl class="number-input-control" />
              <button
                uiNumberInputIncrement
                [attr.aria-label]="f.quantity.increment"
                [disabled]="o.disabledIncrement"
              >
                +
              </button>
            </div>
          </div>
          <p uiFieldDescription>{{ f.quantity.description }}</p>
        </div>

        <div uiField>
          <label uiFieldLabel>{{ f.amount.label }}</label>
          <div
            uiNumberInput
            [wheel]="o.wheel"
            [disabled]="o.disabled"
            [readOnly]="o.readOnly"
            [locale]="o.locale"
            [name]="f.amount.name"
            [defaultValue]="f.amount.defaultValue"
            [min]="o.amountMin"
            [step]="f.amount.step"
            [format]="currency"
            (beforeValueChange)="
              report(f.amount.name, $event.value, $event.details)
            "
            (valueCommit)="commit(f.amount.name, $event.value)"
          >
            <span uiNumberInputScrubArea class="number-input-scrub">{{
              f.amount.scrub
            }}</span>
            <div uiNumberInputGroup class="number-input-group">
              <button
                uiNumberInputDecrement
                [attr.aria-label]="f.amount.decrement"
              >
                −
              </button>
              <input uiNumberInputControl class="number-input-control" />
              <button
                uiNumberInputIncrement
                [attr.aria-label]="f.amount.increment"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Committed">{{
        commits().join(" ")
      }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly o = numberInputOptions()
  protected readonly action = signal("")
  protected readonly commits = signal<string[]>([])
  protected readonly submitted = signal("")
  protected readonly quantity = signal<Value>(this.o.quantity)
  protected readonly currency = {
    style: "currency" as const,
    currency: f.amount.currency,
  }

  // Records a change, or cancels it when the URL asks.
  protected report(name: string, value: Value, details: { cancel: () => void }) {
    if (this.o.cancel === name) {
      return details.cancel()
    }
    this.action.set(`${name}:${String(value)}`)
  }

  protected commit(name: string, value: Value) {
    this.commits.set([...this.commits(), `${name}:${String(value)}`])
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(serialize(event.currentTarget as HTMLFormElement))
  }
}

export { Fixture }
