import { Component } from "@angular/core"
import {
  LucideCircleHelp,
  LucideFile,
  LucideFolder,
  LucideRedo,
  LucideSave,
  LucideSettings,
  LucideTrash,
  LucideUndo,
} from "@lucide/angular"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuItemIcon,
  UiMenuSeparator,
  UiMenuTrigger,
} from "@ngx-ui-sdk/core/menu"
import { UiMenubar } from "@ngx-ui-sdk/core/menubar"

@Component({
  selector: "app-example",
  imports: [
    LucideCircleHelp,
    LucideFile,
    LucideFolder,
    LucideRedo,
    LucideSave,
    LucideSettings,
    LucideTrash,
    LucideUndo,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuItemIcon,
    UiMenuSeparator,
    UiMenuTrigger,
    UiMenubar,
  ],
  template: `
    <div uiMenubar>
      <ng-container uiMenu>
        <button uiMenuTrigger>File</button>
        <div *uiMenuContent="let state">
          <div uiMenuItem>
            <span uiMenuItemIcon><svg lucideFile></svg></span>
            New File
          </div>
          <div uiMenuItem>
            <span uiMenuItemIcon><svg lucideFolder></svg></span>
            Open Folder
          </div>
          <div uiMenuItem>
            <span uiMenuItemIcon><svg lucideSave></svg></span>
            Save
          </div>
        </div>
      </ng-container>
      <ng-container uiMenu>
        <button uiMenuTrigger>Edit</button>
        <div *uiMenuContent="let state">
          <div uiMenuItem>
            <span uiMenuItemIcon mirror><svg lucideUndo></svg></span>
            Undo
          </div>
          <div uiMenuItem>
            <span uiMenuItemIcon mirror><svg lucideRedo></svg></span>
            Redo
          </div>
        </div>
      </ng-container>
      <ng-container uiMenu>
        <button uiMenuTrigger>More</button>
        <div *uiMenuContent="let state">
          <div uiMenuItem>
            <span uiMenuItemIcon><svg lucideSettings></svg></span>
            Settings
          </div>
          <div uiMenuItem>
            <span uiMenuItemIcon><svg lucideCircleHelp></svg></span>
            Help
          </div>
          <div uiMenuSeparator></div>
          <div uiMenuItem destructive>
            <span uiMenuItemIcon><svg lucideTrash></svg></span>
            Delete
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
