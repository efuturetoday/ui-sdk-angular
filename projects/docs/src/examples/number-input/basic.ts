import { Component } from "@angular/core"
import { LucideMinus, LucideMoveHorizontal, LucidePlus } from "@lucide/angular"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputDecrement,
  UiNumberInputGroup,
  UiNumberInputIncrement,
  UiNumberInputScrubArea,
  UiNumberInputScrubAreaCursor,
} from "@ngx-ui-sdk/core/number-input"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideMinus,
    LucideMoveHorizontal,
    LucidePlus,
    UiField,
    UiFieldLabel,
    UiNumberInput,
    UiNumberInputControl,
    UiNumberInputDecrement,
    UiNumberInputGroup,
    UiNumberInputIncrement,
    UiNumberInputScrubArea,
    UiNumberInputScrubAreaCursor,
  ],
  template: `
    <div uiField>
      <div
        uiNumberInput
        [defaultValue]="1"
        [min]="1"
        (valueCommit)="log('Quantity ' + ($event.value ?? 'empty'))"
      >
        <span uiNumberInputScrubArea [pixelsPerStep]="4">
          <label uiFieldLabel>Quantity</label>
          <span *uiNumberInputScrubAreaCursor>
            <svg lucideMoveHorizontal aria-hidden="true"></svg>
          </span>
        </span>
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
  `,
})
class Example {
  protected readonly log = injectLog()
}

export { Example }
