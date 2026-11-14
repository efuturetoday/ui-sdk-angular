import { Component } from "@angular/core"
import { UiButton } from "ui-sdk-angular"
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
