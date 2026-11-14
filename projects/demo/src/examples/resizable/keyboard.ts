import { Component } from "@angular/core"
import {
  UiResizable,
  UiResizableHandle,
  UiResizablePanel,
} from "ngx-ui-sdk/resizable"

@Component({
  selector: "app-example",
  imports: [UiResizable, UiResizableHandle, UiResizablePanel],
  template: `
    <div uiResizable [step]="5" [largeStep]="25">
      <div uiResizablePanel [defaultSize]="50" [minSize]="20">
        <h3>Original</h3>
        <span data-slot="hint">v1.2.0</span>
      </div>
      <div uiResizableHandle aria-label="Resize original"></div>
      <div uiResizablePanel [defaultSize]="50" [minSize]="20">
        <h3>Changes</h3>
        <span data-slot="hint">v1.3.0</span>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
