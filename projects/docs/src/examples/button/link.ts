import { Component } from "@angular/core"
import { UiButton } from "@ngx-ui-sdk/core/button"

@Component({
  selector: "app-example",
  imports: [UiButton],
  template: `
    <div data-slot="row">
      <a uiButton href="#installation">Get Started</a>
      <a uiButton [disabled]="true" href="#changelog">Changelog</a>
    </div>
  `,
})
class Example {}

export { Example }
