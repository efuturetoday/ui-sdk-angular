import { Component } from "@angular/core"
import {
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverShortcut,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ngx-ui-sdk/popover"

@Component({
  selector: "app-example",
  imports: [
    UiPopover,
    UiPopoverClose,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverShortcut,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <ng-container uiPopover>
      <button uiPopoverTrigger #trigger="uiPopoverTrigger" shortcut="mod+u">
        {{ trigger.state().open ? "Hide Updates" : "Show Updates" }}
        <span uiPopoverShortcut #shortcut="uiPopoverShortcut">{{
          shortcut.state().text
        }}</span>
      </button>
      <div *uiPopoverContent>
        <h3 uiPopoverTitle>Updates</h3>
        <p uiPopoverDescription>Version 2.4 adds threaded comments.</p>
        <a uiPopoverClose href="#">Read the Changelog</a>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
