import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxGroup,
  UiCheckboxGroupInput,
  UiCheckboxIndicator,
  UiCheckboxInput,
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxGroup,
    UiCheckboxGroupInput,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Notifications</label>
        <p uiFieldDescription>Choose how we tell you about your orders.</p>
        <div uiCheckboxGroup name="notifications" required>
          <input uiCheckboxGroupInput />
          @for (channel of channels; track channel.value) {
            <label data-slot="label">
              <button uiCheckbox #box="uiCheckbox" [value]="channel.value">
                <span *uiCheckboxIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </button>
              <input [uiCheckboxInput]="box" />
              {{ channel.label }}
            </label>
          }
        </div>
        <div>
          <div *uiFieldError>Choose at least one way to be notified.</div>
        </div>
      </div>
      <button type="submit">Save</button>
    </form>
  `,
})
class Example {
  protected readonly channels = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push notifications" },
  ]
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    const entries = [
      ...new FormData(event.currentTarget as HTMLFormElement),
    ].map(([name, value]) => `${name}=${value}`)
    this.log(`Saved ${entries.join("&")}`)
  }
}

export { Example }
