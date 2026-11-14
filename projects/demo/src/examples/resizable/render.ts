import { Component } from "@angular/core"
import { UiResizable, UiResizableHandle, UiResizablePanel } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiResizable, UiResizableHandle, UiResizablePanel],
  template: `
    <div uiResizable>
      <div
        uiResizablePanel
        #files="uiResizablePanel"
        [defaultSize]="35"
        [minSize]="20"
        collapsible
      >
        <h3>Files</h3>
        <span data-slot="hint">{{
          files.state().collapsed
            ? "Collapsed"
            : round(files.state().size) + "%"
        }}</span>
      </div>
      <div uiResizableHandle aria-label="Resize files"></div>
      <div uiResizablePanel #editor="uiResizablePanel" [minSize]="30">
        <h3>Editor</h3>
        <span data-slot="hint">{{ round(editor.state().size) + "%" }}</span>
      </div>
    </div>
  `,
})
class Example {
  protected readonly round = Math.round
}

export { Example }
