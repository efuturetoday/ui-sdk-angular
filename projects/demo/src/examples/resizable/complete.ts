import { Component } from "@angular/core"
import {
  type ResizableLayoutCommitDetails,
  UiResizable,
  UiResizableHandle,
  UiResizablePanel,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiResizable, UiResizableHandle, UiResizablePanel],
  template: `
    <div
      uiResizable
      (layoutCommit)="onLayoutCommit($event.layout, $event.details)"
    >
      <div uiResizablePanel [defaultSize]="40" [minSize]="20">
        <h3>Files</h3>
        <ul>
          <li>page.tsx</li>
          <li>layout.tsx</li>
          <li>globals.css</li>
        </ul>
      </div>
      <div uiResizableHandle aria-label="Resize files"></div>
      <div uiResizablePanel [minSize]="20">
        <h3>page.tsx</h3>
        <span data-slot="hint">Saved just now</span>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onLayoutCommit(
    layout: number[],
    details: ResizableLayoutCommitDetails
  ) {
    this.log(`Saved ${layout.map(Math.round).join(" / ")} (${details.reason})`)
  }
}

export { Example }
