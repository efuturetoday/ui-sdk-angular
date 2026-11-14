import { Component } from "@angular/core"
import { UiToggle } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiToggle],
  template: `<button uiToggle data-variant="outline">Bookmark</button>`,
})
class Example {}

export { Example }
