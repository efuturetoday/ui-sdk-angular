import { Component } from "@angular/core"
import {
  LucideClipboard,
  LucideCopy,
  LucideRedo,
  LucideScissors,
  LucideUndo,
} from "@lucide/angular"
import {
  UiToolbar,
  UiToolbarButton,
  UiToolbarGroup,
  UiToolbarSeparator,
} from "ngx-ui-sdk/toolbar"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideClipboard,
    LucideCopy,
    LucideRedo,
    LucideScissors,
    LucideUndo,
    UiToolbar,
    UiToolbarButton,
    UiToolbarGroup,
    UiToolbarSeparator,
  ],
  template: `
    <div uiToolbar aria-label="Edit">
      <div uiToolbarGroup aria-label="Clipboard">
        <button uiToolbarButton aria-label="Cut" (click)="log('Cut')">
          <svg lucideScissors aria-hidden="true"></svg>
        </button>
        <button uiToolbarButton aria-label="Copy" (click)="log('Copy')">
          <svg lucideCopy aria-hidden="true"></svg>
        </button>
        <button uiToolbarButton aria-label="Paste" (click)="log('Paste')">
          <svg lucideClipboard aria-hidden="true"></svg>
        </button>
      </div>
      <div uiToolbarSeparator></div>
      <div uiToolbarGroup disabled aria-label="History">
        <button uiToolbarButton aria-label="Undo">
          <svg lucideUndo aria-hidden="true"></svg>
        </button>
        <button uiToolbarButton aria-label="Redo">
          <svg lucideRedo aria-hidden="true"></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
}

export { Example }
