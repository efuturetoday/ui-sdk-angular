import { Component } from "@angular/core"
import { UiButton } from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [UiButton],
  template: `<button uiButton disabled>Disabled</button>`,
})
class Example {}

export { Example }
