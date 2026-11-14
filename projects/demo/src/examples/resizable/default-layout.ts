import { Component } from "@angular/core"
import { UiResizable, UiResizableHandle, UiResizablePanel } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiResizable, UiResizableHandle, UiResizablePanel],
  template: `
    <div uiResizable [defaultLayout]="[25, 35, 40]">
      <div uiResizablePanel [minSize]="15">
        <h3>Mail</h3>
        <ul>
          <li>Inbox</li>
          <li>Drafts</li>
          <li>Sent</li>
        </ul>
      </div>
      <div uiResizableHandle aria-label="Resize folders"></div>
      <div uiResizablePanel [minSize]="15">
        <h3>Inbox</h3>
        <ul>
          <li>Hollis Grant</li>
          <li>Inès Moreau</li>
          <li>Kofi Mensah</li>
        </ul>
      </div>
      <div uiResizableHandle aria-label="Resize inbox"></div>
      <div uiResizablePanel [minSize]="15">
        <h3>Quarterly report</h3>
        <span data-slot="hint">From Hollis Grant</span>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
