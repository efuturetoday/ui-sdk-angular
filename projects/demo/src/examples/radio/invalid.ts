import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import {
  UiRadio,
  UiRadioGroup,
  UiRadioIndicator,
  UiRadioInput,
} from "@ngx-ui-sdk/core/radio"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
    UiRadio,
    UiRadioGroup,
    UiRadioIndicator,
    UiRadioInput,
  ],
  template: `
    <form data-slot="stack" (submit)="submit($event)">
      <div uiField>
        <label uiFieldLabel>Order updates</label>
        <p uiFieldDescription>Choose how we tell you about your orders.</p>
        <div uiRadioGroup name="updates" required>
          @for (channel of channels; track channel.value) {
            <label data-slot="label">
              <button uiRadio #radio="uiRadio" [value]="channel.value">
                <span *uiRadioIndicator></span>
              </button>
              <input [uiRadioInput]="radio" />
              {{ channel.label }}
            </label>
          }
        </div>
        <div *uiFieldError>Choose how to get order updates.</div>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Save</button>
      </div>
    </form>
  `,
})
class Example {
  protected readonly channels = [
    { value: "email", label: "Email only" },
    { value: "sms", label: "SMS only" },
    { value: "both", label: "Email and SMS" },
  ]
  protected readonly log = injectLog()

  protected submit(event: Event) {
    event.preventDefault()
    this.log(
      `Saved updates=${new FormData(event.currentTarget as HTMLFormElement).get("updates")}`
    )
  }
}

export { Example }
