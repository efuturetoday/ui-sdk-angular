import { Component, signal } from "@angular/core"
import {
  formsFixture as f,
  formsOptions,
  serialize,
} from "tests/fixtures/forms"
import {
  UiCheckbox,
  UiCheckboxInput,
  UiCheckboxGroup,
  UiCheckboxGroupInput,
  UiCheckboxIndicator,
  UiField,
  UiFieldControl,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
  UiRadio,
  UiRadioInput,
  UiRadioGroup,
  UiRadioIndicator,
  UiSwitch,
  UiSwitchInput,
  UiSwitchThumb,
  type CheckedState,
} from "ngx-ui-sdk"

type Details = { cancel: () => void; canceled: boolean; source: string }

@Component({
  selector: "app-fixture",
  imports: [
    UiCheckbox,
  UiCheckboxInput,
    UiCheckboxGroup,
  UiCheckboxGroupInput,
    UiCheckboxIndicator,
    UiField,
    UiFieldControl,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
    UiRadio,
  UiRadioInput,
    UiRadioGroup,
    UiRadioIndicator,
    UiSwitch,
  UiSwitchInput,
    UiSwitchThumb,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        [id]="f.formId"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        <div uiField>
          <div class="row">
            <button

              uiCheckbox

              #termsBox="uiCheckbox"
              class="checkbox"
              [name]="f.terms.name"
              [value]="f.terms.value"
              required
              [readOnly]="options.readOnly"
              [checked]="options.controlled ? terms() : undefined"
              (beforeCheckedChange)="onTerms($event)"
            >
              <span *uiCheckboxIndicator class="checkbox-indicator"></span>
            </button>

            <input [uiCheckboxInput]="termsBox" />
            <label uiFieldLabel>{{ f.terms.label }}</label>
          </div>
          <p uiFieldDescription>{{ f.terms.description }}</p>
          <div *uiFieldError="let state; match: 'valueMissing'" class="field-error">{{ f.terms.error }}</div>
        </div>

        <fieldset>
          <legend [id]="f.toppings.legendId">{{ f.toppings.legend }}</legend>
          <div
            uiCheckboxGroup
            class="form"
            [attr.aria-labelledby]="f.toppings.legendId"
            [name]="f.toppings.name"
            [defaultValue]="f.toppings.defaultValue"
            [allValues]="all"
            [required]="options.toppingsRequired"
            (beforeValueChange)="report(f.toppings.name, $event.value.join(','), $event.details)"
          >
            <input uiCheckboxGroupInput />
            <label>
              <button

                uiCheckbox

                #parentBox="uiCheckbox" class="checkbox" parent>
                <span *uiCheckboxIndicator class="checkbox-indicator"></span>
              </button>

              <input [uiCheckboxInput]="parentBox" />
              {{ f.toppings.parent }}
            </label>
            @for (item of f.toppings.items; track item.value) {
              <label>
                <button

                  uiCheckbox

                  #box="uiCheckbox" class="checkbox" [value]="item.value">
                  <span *uiCheckboxIndicator class="checkbox-indicator"></span>
                </button>

                <input [uiCheckboxInput]="box" />
                {{ item.label }}
              </label>
            }
          </div>
        </fieldset>

        @for (item of f.switches; track item.name) {
          <label>
            <button

              uiSwitch

              #toggle="uiSwitch"
              class="switch"
              [name]="item.name"
              [defaultChecked]="item.defaultChecked"
              (beforeCheckedChange)="report(item.name, $event.checked, $event.details)"
            >
              <span uiSwitchThumb class="switch-thumb"></span>
            </button>

            <input [uiSwitchInput]="toggle" />
            {{ item.label }}
          </label>
        }

        <div uiField>
          <label uiFieldLabel>{{ f.plan.label }}</label>
          <div
            uiRadioGroup
            class="form"
            [name]="f.plan.name"
            required
            [defaultValue]="options.plan"
            [readOnly]="options.readOnly"
            [disabled]="options.disabled"
            [loop]="options.loop"
            (beforeValueChange)="report(f.plan.name, $event.value, $event.details)"
          >
            @for (item of f.plan.items; track item.value) {
              <label>
                <button

                  uiRadio

                  #radio="uiRadio" class="radio" [value]="item.value" [disabled]="item.disabled">
                  <span *uiRadioIndicator class="radio-indicator"></span>
                </button>

                <input [uiRadioInput]="radio" />
                {{ item.label }}
              </label>
            }
          </div>
          <p uiFieldDescription>{{ f.plan.description }}</p>
          <div *uiFieldError class="field-error"></div>
        </div>

        <div uiField [invalid]="options.invalid">
          <label uiFieldLabel>{{ f.email.label }}</label>
          <input uiFieldControl type="email" [name]="f.email.name" required />
          <p uiFieldDescription>{{ f.email.description }}</p>
          <div *uiFieldError class="field-error"></div>
        </div>

        @if (options.nickname) {
          <div uiField>
            <label uiFieldLabel>{{ f.nickname.label }}</label>
            <input uiFieldControl [name]="f.nickname.name" required />
          </div>
        }

        <fieldset [disabled]="shipping()">
          <legend>{{ f.shipping.legend }}</legend>
          <label>
            <button

              uiCheckbox

              #giftBox="uiCheckbox" class="checkbox" [name]="f.shipping.name">
              <span *uiCheckboxIndicator class="checkbox-indicator"></span>
            </button>

            <input [uiCheckboxInput]="giftBox" />
            {{ f.shipping.label }}
          </label>
        </fieldset>

        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <label>
        <button

          uiCheckbox

          #newsletterBox="uiCheckbox"
          class="checkbox"
          [form]="f.formId"
          [name]="f.newsletter.name"
          [value]="f.newsletter.value"
        >
          <span *uiCheckboxIndicator class="checkbox-indicator"></span>
        </button>

        <input [uiCheckboxInput]="newsletterBox" />
        {{ f.newsletter.label }}
      </label>
      <button type="button" (click)="shipping.set(!shipping())">Toggle shipping</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Last source">{{ source() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly options = formsOptions()
  protected readonly all = f.toppings.items.map((item) => item.value)
  protected readonly action = signal("")
  protected readonly source = signal("")
  protected readonly submitted = signal("")
  protected readonly terms = signal<CheckedState>(false)
  protected readonly shipping = signal(false)

  // Records a change, or cancels it when the URL asks.
  protected report(name: string, value: unknown, details: Details) {
    if (this.options.cancel === name) {
      return details.cancel()
    }
    this.action.set(`${name}:${String(value)}`)
    this.source.set(details.source)
  }

  protected onTerms({
    checked,
    details,
  }: {
    checked: CheckedState
    details: Details
  }) {
    this.report(f.terms.name, checked, details)
    if (!details.canceled) {
      this.terms.set(checked)
    }
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(serialize(event.currentTarget as HTMLFormElement))
  }
}

export { Fixture }
