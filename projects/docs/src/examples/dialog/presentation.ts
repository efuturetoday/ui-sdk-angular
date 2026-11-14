import { Component } from "@angular/core"
import {
  UiDialog,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
} from "@ngx-ui-sdk/core/dialog"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import { UiInput } from "@ngx-ui-sdk/core/input"

@Component({
  selector: "app-example",
  imports: [
    UiDialog,
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
    <ng-container uiDialog presentation="sheet">
      <button uiDialogTrigger>Edit Profile</button>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>Edit profile</h2>
          <p uiDialogDescription>
            Make changes to your profile here. Save when you're done.
          </p>
        </div>
        <div uiField>
          <label uiFieldLabel>Name</label>
          <input uiInput defaultValue="Hollis Grant" />
        </div>
        <div uiField>
          <label uiFieldLabel>Username</label>
          <input uiInput defaultValue="@hollis" />
        </div>
        <div data-slot="row">
          <button uiDialogClose>Cancel</button>
          <button uiDialogClose data-variant="solid" value="save">
            Save Changes
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
