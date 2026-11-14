import { Component, signal } from "@angular/core"
import { fieldRadiosFixture as f, fieldRadiosOptions } from "tests/fixtures/field"
import {
  UiField,
  UiFieldLabel,
} from "ngx-ui-sdk/field"
import {
  UiRadio,
  UiRadioInput,
  UiRadioGroup,
  UiRadioIndicator,
} from "ngx-ui-sdk/radio"

@Component({
  selector: "app-fixture",
  imports: [
    UiField,
    UiFieldLabel,
    UiRadio,
    UiRadioGroup,
    UiRadioIndicator,
    UiRadioInput,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiField>
        <label uiFieldLabel>{{ f.label }}</label>
        <div uiRadioGroup class="form" [name]="f.name">
          @for (size of f.sizes; track size.value; let index = $index) {
            <div
              uiField
              class="row"
              [disabled]="index === 0 && options.disabledField"
            >
              <button

                uiRadio

                #radio="uiRadio"
                class="radio"
                [value]="size.value"
                [disabled]="index === 0 && firstDisabled()"
              >
                <span *uiRadioIndicator class="radio-indicator"></span>
              </button>

              <input [uiRadioInput]="radio" />
              <label uiFieldLabel>{{ size.label }}</label>
            </div>
          }
        </div>
      </div>
      <button>After</button>
      <button (click)="firstDisabled.set(!firstDisabled())">
        {{ f.disableFirst }}
      </button>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly options = fieldRadiosOptions()
  protected readonly firstDisabled = signal(false)
}

export { Fixture }
