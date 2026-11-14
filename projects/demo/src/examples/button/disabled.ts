import { Component } from "@angular/core"
import { UiButton } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiButton],
  template: `<button uiButton disabled>Disabled</button>`,
})
class Example {}

export { Example }
