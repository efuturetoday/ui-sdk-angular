import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiMenu,
  UiMenuCheckboxItem,
  UiMenuContent,
  UiMenuItemIndicator,
  UiMenuTrigger,
  UiMenubar,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiMenu,
    UiMenuCheckboxItem,
    UiMenuContent,
    UiMenuItemIndicator,
    UiMenuTrigger,
    UiMenubar,
  ],
  template: `
    <div data-slot="stack">
      <div uiMenubar>
        <ng-container uiMenu>
          <button uiMenuTrigger>View</button>
          <div *uiMenuContent="let state">
            <div uiMenuCheckboxItem [(checked)]="statusBar" value="status-bar">
              <span *uiMenuItemIndicator><svg lucideCheck></svg></span>
              Status Bar
            </div>
            <div uiMenuCheckboxItem value="activity-bar" defaultChecked>
              <span *uiMenuItemIndicator><svg lucideCheck></svg></span>
              Activity Bar
            </div>
          </div>
        </ng-container>
        <ng-container uiMenu>
          <button uiMenuTrigger>Format</button>
          <div *uiMenuContent="let state">
            <div uiMenuCheckboxItem value="strikethrough">
              <span *uiMenuItemIndicator><svg lucideCheck></svg></span>
              Strikethrough
            </div>
            <div uiMenuCheckboxItem value="code">
              <span *uiMenuItemIndicator><svg lucideCheck></svg></span>
              Code
            </div>
          </div>
        </ng-container>
      </div>
      <output data-slot="output"
        >Status bar {{ statusBar() ? "shown" : "hidden" }}</output
      >
    </div>
  `,
})
class Example {
  protected readonly statusBar = signal(true)
}

export { Example }
