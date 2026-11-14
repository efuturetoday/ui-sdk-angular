import { Component } from "@angular/core"
import { LucidePlus } from "@lucide/angular"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogShortcut,
  UiDialogTitle,
  UiDialogTrigger,
} from "@ngx-ui-sdk/core/dialog"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import { UiInput } from "@ngx-ui-sdk/core/input"

@Component({
  selector: "app-example",
  imports: [
    LucidePlus,
    UiDialog,
    UiDialogBackdrop,
    UiDialogClose,
    UiDialogContent,
    UiDialogDescription,
    UiDialogShortcut,
    UiDialogTitle,
    UiDialogTrigger,
    UiField,
    UiFieldLabel,
    UiInput,
  ],
  template: `
    <ng-container uiDialog>
      <button uiDialogTrigger shortcut="mod+j">
        <svg lucidePlus aria-hidden="true"></svg>
        New Contact
        <span uiDialogShortcut></span>
      </button>
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>New contact</h2>
          <p uiDialogDescription>Add someone to your address book.</p>
        </div>
        <form data-slot="stack" method="dialog">
          <div uiField>
            <label uiFieldLabel>Name</label>
            <input uiInput name="name" required placeholder="Kofi Mensah" />
          </div>
          <div uiField>
            <label uiFieldLabel>Email</label>
            <input
              uiInput
              name="email"
              type="email"
              required
              placeholder="kofi@example.com" />
          </div>
          <div data-slot="row">
            <button uiDialogClose>Cancel</button>
            <button data-variant="solid" type="submit" value="save">
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
