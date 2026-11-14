import { Component } from "@angular/core"
import { UiButton, UiField, UiFieldLabel, UiInput } from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiButton, UiField, UiFieldLabel, UiInput],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Email</label>
        <input
          uiInput
          name="email"
          type="email"
          defaultValue="ada@example.com"
        />
      </div>
      <div data-slot="row">
        <button uiButton type="submit">Subscribe</button>
        <button uiButton type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    const email = String(
      new FormData(event.currentTarget as HTMLFormElement).get("email")
    )
    this.log(`Subscribed ${email}`)
  }
}

export { Example }
