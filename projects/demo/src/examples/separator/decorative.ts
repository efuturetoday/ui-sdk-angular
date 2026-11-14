import { Component } from "@angular/core"
import { UiSeparator } from "ngx-ui-sdk/separator"

@Component({
  selector: "app-example",
  imports: [UiSeparator],
  template: `
    <div data-slot="stack">
      <button type="button" data-variant="solid">Sign In with Passkey</button>
      <div data-slot="row">
        <div uiSeparator decorative></div>
        <span>or</span>
        <div uiSeparator decorative></div>
      </div>
      <button type="button">Email Me a Link</button>
    </div>
  `,
})
class Example {}

export { Example }
