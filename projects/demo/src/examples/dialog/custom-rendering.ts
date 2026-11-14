import { Component } from "@angular/core"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
  UiDialogShortcut,
} from "ngx-ui-sdk/dialog"

@Component({
  selector: "app-example",
  imports: [
    UiDialog,
    UiDialogBackdrop,
    UiDialogClose,
    UiDialogContent,
    UiDialogDescription,
    UiDialogTitle,
    UiDialogTrigger,
    UiDialogShortcut,
  ],
  template: `
    <ng-container uiDialog>
      <button uiDialogTrigger shortcut="mod+i" #trigger="uiDialogTrigger">
        {{ trigger.state().open ? "Viewing" : "View Details" }}
        <span uiDialogShortcut #shortcut="uiDialogShortcut">{{
          shortcut.state().text
        }}</span>
      </button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent="let state">
        <div data-slot="stack">
          <h3 uiDialogTitle>Details</h3>
          <p uiDialogDescription>
            {{
              state().nested
                ? "Opened from another dialog."
                : "Quarterly report, updated today."
            }}
          </p>
        </div>
        <div data-slot="row">
          <button uiDialogClose>Close</button>
          <a
            uiDialogClose
            data-variant="solid"
            href="https://example.com/details"
            >Open the Full Page</a
          >
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
