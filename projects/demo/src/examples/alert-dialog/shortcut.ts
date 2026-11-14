import { Component } from "@angular/core"
import {
  UiAlertDialog,
  UiAlertDialogBackdrop,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogDescription,
  UiAlertDialogShortcut,
  UiAlertDialogTitle,
  UiAlertDialogTrigger,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiAlertDialog,
    UiAlertDialogBackdrop,
    UiAlertDialogClose,
    UiAlertDialogContent,
    UiAlertDialogDescription,
    UiAlertDialogShortcut,
    UiAlertDialogTitle,
    UiAlertDialogTrigger,
  ],
  template: `
    <ng-container uiAlertDialog>
      <button uiAlertDialogTrigger shortcut="mod+shift+h">
        Clear History
        <span uiAlertDialogShortcut></span>
      </button>
      <div *uiAlertDialogBackdrop></div>
      <div *uiAlertDialogContent>
        <div data-slot="stack">
          <h2 uiAlertDialogTitle>Clear your history?</h2>
          <p uiAlertDialogDescription>
            Recent searches and visited pages are removed from this device.
          </p>
        </div>
        <div data-slot="row">
          <button uiAlertDialogClose>Cancel</button>
          <button uiAlertDialogClose data-variant="solid" value="confirm">
            Clear
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
