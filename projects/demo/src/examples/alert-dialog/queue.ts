import { Component } from "@angular/core"
import {
  UiAlertDialog,
  UiAlertDialogBackdrop,
  UiAlertDialogClose,
  UiAlertDialogContent,
  UiAlertDialogDescription,
  UiAlertDialogTitle,
  createConfirm,
} from "ngx-ui-sdk/alert-dialog"
import { injectLog } from "../../shared/log"

type Project = { name: string }

@Component({
  selector: "app-example",
  imports: [
    UiAlertDialog,
    UiAlertDialogBackdrop,
    UiAlertDialogClose,
    UiAlertDialogContent,
    UiAlertDialogDescription,
    UiAlertDialogTitle,
  ],
  template: `
    <div data-slot="stack">
      <button type="button" (click)="review()">Review Two Projects</button>
      <ng-container uiAlertDialog [controller]="confirm.controller">
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent="let state">
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>
              Archive {{ projectOf(state().payload)?.name }}?
            </h2>
            <p uiAlertDialogDescription>
              Archived projects leave the active list. You can restore them
              later.
            </p>
          </div>
          <div data-slot="row">
            <button uiAlertDialogClose>Cancel</button>
            <button uiAlertDialogClose data-variant="solid" value="confirm">
              Archive
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly confirm = createConfirm<Project>()
  protected readonly log = injectLog()

  protected projectOf(payload: unknown) {
    return payload as Project | undefined
  }

  protected async review() {
    const acme = this.confirm({ name: "Acme" })
    const globex = this.confirm({ name: "Globex" })
    const [first, second] = await Promise.all([acme, globex])
    this.log(`Acme: ${first ? "confirmed" : "canceled"}`)
    this.log(`Globex: ${second ? "confirmed" : "canceled"}`)
  }
}

export { Example }
