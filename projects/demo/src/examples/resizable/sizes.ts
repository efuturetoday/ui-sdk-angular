import { Component } from "@angular/core"
import {
  UiResizable,
  UiResizableHandle,
  UiResizablePanel,
} from "@ngx-ui-sdk/core/resizable"

@Component({
  selector: "app-example",
  imports: [UiResizable, UiResizableHandle, UiResizablePanel],
  template: `
    <div uiResizable>
      <div uiResizablePanel defaultSize="200px" minSize="160px" maxSize="320px">
        <h3>Docs</h3>
        <ul>
          <li>Getting Started</li>
          <li>Components</li>
          <li>Guides</li>
        </ul>
      </div>
      <div uiResizableHandle aria-label="Resize navigation">
        <div></div>
      </div>
      <div uiResizablePanel [minSize]="30">
        <h3>Getting Started</h3>
        <span data-slot="hint">Install the packages</span>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
