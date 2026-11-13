import { Component } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiRadio,
  UiRadioGroup,
  UiRadioIndicator,
  UiRadioInput,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"
import { uniqueId } from "../../shared/id"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldLabel,
    UiRadio,
    UiRadioGroup,
    UiRadioIndicator,
    UiRadioInput,
  ],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Shipping speed</label>
        <div
          uiRadioGroup
          name="shipping"
          [form]="id + '-checkout'"
          required
          defaultValue="standard"
        >
          @for (speed of speeds; track speed.value) {
            <label data-slot="label">
              <button uiRadio #radio="uiRadio" [value]="speed.value">
                <span *uiRadioIndicator></span>
              </button>
              <input [uiRadioInput]="radio" />
              {{ speed.label }}
              <span data-slot="hint">({{ speed.detail }})</span>
            </label>
          }
        </div>
      </div>
      <form [id]="id + '-checkout'" data-slot="row" (submit)="submit($event)">
        <button type="submit" data-variant="solid">Continue</button>
        <button type="reset">Reset</button>
      </form>
    </div>
  `,
})
class Example {
  protected readonly speeds = [
    { value: "standard", label: "Standard", detail: "Free, 5 to 7 days" },
    { value: "express", label: "Express", detail: "$9, 2 days" },
    { value: "overnight", label: "Overnight", detail: "$24, next day" },
  ]
  protected readonly log = injectLog()
  protected readonly id = uniqueId()

  protected submit(event: Event) {
    event.preventDefault()
    this.log(
      `Submitted shipping=${new FormData(event.currentTarget as HTMLFormElement).get("shipping")}`
    )
  }
}

export { Example }
