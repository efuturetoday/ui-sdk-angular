import { Component } from "@angular/core"
import {
  type DialogOpenChangeDetails,
  UiDialog,
  UiDialogBackdrop,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
} from "ngx-ui-sdk/dialog"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import { UiInput } from "ngx-ui-sdk/input"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiDialog,
    UiDialogBackdrop,
    UiDialogContent,
    UiDialogDescription,
    UiDialogTitle,
    UiDialogTrigger,
    UiField,
    UiFieldLabel,
    UiInput,
  ],
  template: `
    <ng-container
      uiDialog
      (beforeOpenChange)="onOpenChange($event.open, $event.details)"
    >
      <button uiDialogTrigger>New Article</button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>New article</h2>
          <p uiDialogDescription>Save it as a draft or publish it now.</p>
        </div>
        <form data-slot="stack" method="dialog">
          <div uiField>
            <label uiFieldLabel>Title</label>
            <input
              uiInput
              required
              defaultValue="Shipping updates for spring"
            />
          </div>
          <div data-slot="row">
            <button type="submit" value="draft">Save Draft</button>
            <button data-variant="solid" type="submit" value="published">
              Publish
            </button>
          </div>
        </form>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onOpenChange(open: boolean, details: DialogOpenChangeDetails) {
    if (!open) {
      this.log(
        details.returnValue
          ? `Saved as ${details.returnValue}`
          : `Closed (${details.reason})`
      )
    }
  }
}

export { Example }
