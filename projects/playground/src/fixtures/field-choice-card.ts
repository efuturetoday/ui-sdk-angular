import { Component, DestroyRef, inject, signal } from "@angular/core"
import {
  fieldChoiceCardFixture as f,
  fieldChoiceCardOptions,
} from "tests/fixtures/field"
import {
  UiCheckbox,
  UiCheckboxInput,
  UiCheckboxIndicator,
} from "ngx-ui-sdk/checkbox"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "ngx-ui-sdk/field"

@Component({
  selector: "app-fixture",
  imports: [
    UiCheckbox,
  UiCheckboxInput,
    UiCheckboxIndicator,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      @for (card of f.cards; track card.name) {
        <label uiFieldLabel class="choice-card">
          <div uiField>
            <button

              uiCheckbox

              #box="uiCheckbox" class="checkbox" [name]="card.name">
              <span *uiCheckboxIndicator class="checkbox-indicator"></span>
            </button>

            <input [uiCheckboxInput]="box" />
            <span>{{ card.title }}</span>
            <p uiFieldDescription>{{ card.description }}</p>
          </div>
        </label>
      }
      @if (options.later) {
        <label uiFieldLabel class="choice-card">
          <div uiField>
            @if (ready()) {
              <button

                uiCheckbox

                #box="uiCheckbox" class="checkbox" [name]="f.later.name">
                <span *uiCheckboxIndicator class="checkbox-indicator"></span>
              </button>

              <input [uiCheckboxInput]="box" />
            }
            <span>{{ f.later.title }}</span>
            <p uiFieldDescription>{{ f.later.description }}</p>
          </div>
        </label>
      }
      @if (options.alone) {
        <label uiFieldLabel>{{ f.alone }}</label>
      }
      <button>After</button>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly options = fieldChoiceCardOptions()
  protected readonly ready = signal(false)

  constructor() {
    const timer = setTimeout(() => this.ready.set(true), f.later.delay)
    inject(DestroyRef).onDestroy(() => clearTimeout(timer))
  }
}

export { Fixture }
