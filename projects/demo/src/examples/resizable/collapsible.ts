import { Component } from "@angular/core"
import { LucideFolder, LucideSearch, LucideSettings } from "@lucide/angular"
import {
  UiResizable,
  UiResizableHandle,
  UiResizablePanel,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    LucideFolder,
    LucideSearch,
    LucideSettings,
    UiResizable,
    UiResizableHandle,
    UiResizablePanel,
  ],
  template: `
    <div uiResizable>
      <div
        uiResizablePanel
        [defaultSize]="30"
        [minSize]="25"
        collapsible
        collapsedSize="48px"
      >
        <ul>
          <li data-slot="row">
            <svg lucideFolder aria-hidden="true"></svg>
            <span>Files</span>
          </li>
          <li data-slot="row">
            <svg lucideSearch aria-hidden="true"></svg>
            <span>Search</span>
          </li>
          <li data-slot="row">
            <svg lucideSettings aria-hidden="true"></svg>
            <span>Settings</span>
          </li>
        </ul>
      </div>
      <div uiResizableHandle aria-label="Resize sidebar">
        <div></div>
      </div>
      <div uiResizablePanel [minSize]="40">
        <h3>README.md</h3>
        <span data-slot="hint">Edited by Inès Moreau</span>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
