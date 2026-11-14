import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import {
  createNumberInputController,
  UiField,
  UiFieldLabel,
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputDecrement,
  UiNumberInputGroup,
  UiNumberInputIncrement,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

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
      <div data-slot="controls">
        <button type="button" (click)="zoom.decrement({ large: true })">
          Zoom Out
        </button>
        <button type="button" (click)="zoom.increment({ large: true })">
          Zoom In
        </button>
        <button type="button" (click)="zoom.setValue(100)">Actual Size</button>
        <button type="button" (click)="log('Zoom is ' + zoom.getValue() + '%')">
          Read
        </button>
        <button type="button" (click)="zoom.focus()">Focus</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Zoom</label>
        <div
          uiNumberInput
          [defaultValue]="100"
          [min]="10"
          [max]="400"
          [step]="10"
          [format]="{ style: 'unit', unit: 'percent' }"
          [controller]="zoom"
          (beforeValueChange)="
            log(
              'Zoom ' +
                ($event.value ?? 'empty') +
                '% (' +
                $event.details.reason +
                ')'
            )
          "
        >
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
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly zoom = createNumberInputController()
}

export { Example }
