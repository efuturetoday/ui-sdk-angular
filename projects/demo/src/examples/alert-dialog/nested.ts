import { Component, signal } from "@angular/core"
import {
  UiAlertDialog,
  UiAlertDialogBackdrop,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogDescription,
  UiAlertDialogTitle,
  UiAlertDialogTrigger,
} from "ngx-ui-sdk/alert-dialog"

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
    <ng-container uiAlertDialog [(open)]="open">
      <button uiAlertDialogTrigger>Delete Workspace</button>
      <div *uiAlertDialogBackdrop></div>
      <div *uiAlertDialogContent>
        <div data-slot="stack">
          <h2 uiAlertDialogTitle>Delete this workspace?</h2>
          <p uiAlertDialogDescription>
            All 12 projects and their deployments will be deleted for everyone
            on your team.
          </p>
        </div>
        <div data-slot="row">
          <button uiAlertDialogClose>Cancel</button>
          <ng-container
            uiAlertDialog
            (beforeOpenChange)="onNestedOpenChange($event.open, $event.details)"
          >
            <button uiAlertDialogTrigger data-variant="solid">Delete</button>
            <div *uiAlertDialogBackdrop></div>
            <div *uiAlertDialogContent>
              <div data-slot="stack">
                <h2 uiAlertDialogTitle>Are you absolutely sure?</h2>
                <p uiAlertDialogDescription>
                  There's no way to get the workspace back.
                </p>
              </div>
              <div data-slot="row">
                <button uiAlertDialogClose>Go Back</button>
                <button uiAlertDialogClose data-variant="solid" value="confirm">
                  Delete Workspace
                </button>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly open = signal(false)

  protected onNestedOpenChange(
    nested: boolean,
    details: { returnValue?: string }
  ) {
    if (!nested && details.returnValue === "confirm") {
      this.open.set(false)
    }
  }
}

export { Example }
