import { Component, signal } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import {
  type NumberInputValueChangeReason,
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
        <button type="button" (click)="value.set(4)">Reset to 4</button>
        <button type="button" (click)="value.set(null)">Clear</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Servings</label>
        <div
          uiNumberInput
          [(value)]="value"
          [min]="1"
          [max]="12"
          (beforeValueChange)="onValueChange($event.value, $event.details)"
          (valueCommit)="onValueCommit($event.value, $event.details)"
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
  protected readonly value = signal<number | null | undefined>(4)

  protected onValueChange(
    next: number | null,
    details: { reason: NumberInputValueChangeReason }
  ) {
    this.log(`Value ${next ?? "empty"} (${details.reason})`)
  }

  protected onValueCommit(
    next: number | null,
    details: { reason: NumberInputValueChangeReason }
  ) {
    this.log(`Committed ${next ?? "empty"} (${details.reason})`)
  }
}

export { Example }
