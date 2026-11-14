import { Component } from "@angular/core"
import { LucideCopy, LucideEllipsis, LucidePencil } from "@lucide/angular"
import {
  createDialogController,
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiField,
  UiFieldLabel,
  UiInput,
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuTrigger,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideCopy,
    LucideEllipsis,
    LucidePencil,
    UiDialog,
    UiDialogBackdrop,
    UiDialogClose,
    UiDialogContent,
    UiDialogDescription,
    UiDialogTitle,
    UiField,
    UiFieldLabel,
    UiInput,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuTrigger,
  ],
  template: `
    <ng-container uiMenu>
      <button uiMenuTrigger aria-label="File actions">
        <svg lucideEllipsis aria-hidden="true"></svg>
      </button>
      <div *uiMenuContent>
        <div uiMenuItem [onSelect]="openRename">
          <svg lucidePencil aria-hidden="true"></svg>
          Rename…
        </div>
        <div uiMenuItem>
          <svg lucideCopy aria-hidden="true"></svg>
          Duplicate
        </div>
      </div>
    </ng-container>
    <ng-container uiDialog [controller]="rename">
      <div *uiDialogBackdrop></div>
      <div *uiDialogContent>
        <div data-slot="stack">
          <h2 uiDialogTitle>Rename file</h2>
          <p uiDialogDescription>Names must be unique in a folder.</p>
        </div>
        <div uiField>
          <label uiFieldLabel>Name</label>
          <input uiInput defaultValue="report.pdf" />
        </div>
        <div data-slot="row">
          <button uiDialogClose>Cancel</button>
          <button uiDialogClose data-variant="solid" value="rename">
            Rename
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly rename = createDialogController()
  protected readonly openRename = () => {
    this.rename.open()
  }
}

export { Example }
