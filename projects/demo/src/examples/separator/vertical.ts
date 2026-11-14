import { Component } from "@angular/core"
import { UiSeparator } from "ngx-ui-sdk/separator"

@Component({
  selector: "app-example",
  imports: [UiSeparator],
  template: `
    <nav aria-label="Legal" data-slot="row">
      <a href="#">Privacy</a>
      <div uiSeparator orientation="vertical"></div>
      <a href="#">Terms</a>
      <div uiSeparator orientation="vertical"></div>
      <a href="#">Cookies</a>
    </nav>
  `,
})
class Example {}

export { Example }
