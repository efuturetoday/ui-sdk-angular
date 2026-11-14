import { Component } from "@angular/core"
import { UiButton } from "ngx-ui-sdk/button"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiButton],
  template: `<button uiButton (click)="log('Pressed')">Button</button>`,
})
class Example {
  protected readonly log = injectLog()
}

export { Example }
