import { Component, signal } from "@angular/core"
import {
  UiAlertDialog,
  UiAlertDialogBackdrop,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogDescription,
  UiAlertDialogTitle,
  UiAlertDialogTrigger,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiAlertDialog,
    UiAlertDialogBackdrop,
    UiAlertDialogClose,
    UiAlertDialogContent,
    UiAlertDialogDescription,
    UiAlertDialogTitle,
    UiAlertDialogTrigger,
  ],
  template: `
    <div data-slot="stack">
      <ng-container uiAlertDialog [(open)]="open">
        <button uiAlertDialogTrigger>Review Changes</button>
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent>
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>Discard unsaved changes?</h2>
            <p uiAlertDialogDescription>
              Your edits will be lost if you leave without saving.
            </p>
          </div>
          <div data-slot="row">
            <button uiAlertDialogClose>Keep Editing</button>
            <button uiAlertDialogClose data-variant="solid" value="confirm">
              Discard
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly open = signal(false)
}

export { Example }
