import { Component } from "@angular/core"
import {
  UiAlertDialog,
  UiAlertDialogBackdrop,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogDescription,
  UiAlertDialogTitle,
  UiAlertDialogTrigger,
} from "@ngx-ui-sdk/core/alert-dialog"

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
      <ng-container uiAlertDialog pendingAnnouncement="Deleting project">
        <button uiAlertDialogTrigger>Delete Project</button>
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent>
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>Delete project?</h2>
            <p uiAlertDialogDescription>
              This permanently deletes the project, its files and its deployment
              history for everyone on your team.
            </p>
          </div>
          <div data-slot="stack">
            <p data-slot="hint" role="alert">
              {{ errorOf(remove.state().error) }}
            </p>
            <div data-slot="row">
              <button uiAlertDialogClose>Cancel</button>
              <button
                uiAlertDialogClose
                #remove="uiAlertDialogClose"
                data-variant="solid"
                value="confirm"
                [action]="deleteProject"
              >
                {{
                  remove.state().pending
                    ? "Deleting…"
                    : remove.state().error
                      ? "Try Again"
                      : "Delete"
                }}
              </button>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  #attempts = 0

  protected readonly deleteProject = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    if (this.#attempts++ === 0) {
      throw new Error("Couldn't delete the project.")
    }
  }

  protected errorOf(error: unknown) {
    return error instanceof Error ? error.message : ""
  }
}

export { Example }
