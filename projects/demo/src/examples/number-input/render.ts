import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import {
  UiField,
  UiFieldLabel,
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputDecrement,
  UiNumberInputGroup,
  UiNumberInputIncrement,
} from "ui-sdk-angular"

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
    <div uiField>
      <label uiFieldLabel>Temperature</label>
      <div
        uiNumberInput
        [defaultValue]="-2"
        [min]="-20"
        [max]="40"
        [format]="{ style: 'unit', unit: 'celsius' }"
      >
        <div uiNumberInputGroup>
          <button
            uiNumberInputDecrement
            #colder="uiNumberInputDecrement"
            aria-label="Colder"
            [title]="colder.state().atBound ? 'As cold as it goes' : 'Colder'"
          >
            <svg lucideMinus aria-hidden="true"></svg>
          </button>
          <input uiNumberInputControl />
          <button
            uiNumberInputIncrement
            #warmer="uiNumberInputIncrement"
            aria-label="Warmer"
          >
            @if (warmer.state().atBound) {
              <span>Max</span>
            } @else {
              <svg lucidePlus aria-hidden="true"></svg>
            }
          </button>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
