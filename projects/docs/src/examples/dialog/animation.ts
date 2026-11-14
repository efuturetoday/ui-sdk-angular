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
import { injectLog } from "../../shared/log"

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
    <ng-container
      uiDialog
      (openChangeComplete)="
        log($event ? 'Finished opening' : 'Finished closing')
      "
    >
      <button uiDialogTrigger>Slide In</button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent="let state; keepMounted: true">
        <div data-slot="stack">
          <h2 uiDialogTitle>Slide and fade</h2>
          <p uiDialogDescription>
            300ms in and out. Focus returns as soon as it starts closing.
          </p>
        </div>
        <div data-slot="row">
          <button uiDialogClose data-variant="solid">Close</button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly log = injectLog()
}

export { Example }
