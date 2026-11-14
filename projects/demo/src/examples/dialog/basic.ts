import { Component } from "@angular/core"
import { LucideX } from "@lucide/angular"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
  UiField,
  UiFieldLabel,
  UiInput,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideX,
    UiDialog,
    UiDialogBackdrop,
    UiDialogClose,
    UiDialogContent,
    UiDialogDescription,
    UiDialogTitle,
    UiDialogTrigger,
    UiField,
    UiFieldLabel,
    UiInput,
  ],
  template: `
    <ng-container uiDialog>
      <button uiDialogTrigger>Share</button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>Share link</h2>
          <p uiDialogDescription>
            Anyone who has this link will be able to view this.
          </p>
        </div>
        <div uiField>
          <label uiFieldLabel>Link</label>
          <input uiInput defaultValue="https://example.com/project" readonly />
        </div>
        <div data-slot="row">
          <button uiDialogClose data-variant="solid">Done</button>
        </div>
        <button uiDialogClose aria-label="Close">
          <svg lucideX aria-hidden="true"></svg>
        </button>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
