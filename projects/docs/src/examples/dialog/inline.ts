import { Component } from "@angular/core"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
} from "@ngx-ui-sdk/core/dialog"

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
  ],
  template: `
    <div data-slot="dialog-frame">
      <ng-container uiDialog modal="trap-focus" [closeOnOutsidePress]="false">
        <button uiDialogTrigger>Delete Draft</button>
        <div *uiDialogBackdrop></div>
        <div *uiDialogContent="let state; inline: true">
          <div data-slot="stack">
            <h2 uiDialogTitle>Delete this draft?</h2>
            <p uiDialogDescription>
              The preview keeps its dialog inside the frame.
            </p>
          </div>
          <div data-slot="row">
            <button uiDialogClose>Cancel</button>
            <button uiDialogClose data-variant="destructive">Delete</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
