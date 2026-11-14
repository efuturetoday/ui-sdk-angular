import { Component } from "@angular/core"
import { UiButton } from "ngx-ui-sdk/button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

@Component({
  selector: "app-example",
  imports: [UiButton],
  template: `
    <button uiButton [action]="save" pendingAnnouncement="Saving">Save</button>
  `,
})
class Example {
  protected readonly save = () => wait(1500)
}

export { Example }
