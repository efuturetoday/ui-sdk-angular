import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuSub,
  UiMenuSubTrigger,
  UiMenuTrigger,
} from "ngx-ui-sdk/menu"
import { UiMenubar } from "ngx-ui-sdk/menubar"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronRight,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuSub,
    UiMenuSubTrigger,
    UiMenuTrigger,
    UiMenubar,
  ],
  template: `
    <div uiMenubar>
      <ng-container uiMenu>
        <button uiMenuTrigger>File</button>
        <div *uiMenuContent="let state">
          <div uiMenuItem>New File</div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger>
              Share
              <svg lucideChevronRight aria-hidden="true"></svg>
            </div>
            <div *uiMenuSubContent>
              <div uiMenuItem>Email link</div>
              <div uiMenuItem>Messages</div>
            </div>
          </ng-container>
        </div>
      </ng-container>
      <ng-container uiMenu>
        <button uiMenuTrigger>Edit</button>
        <div *uiMenuContent="let state">
          <div uiMenuItem>Undo</div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger>
              Find
              <svg lucideChevronRight aria-hidden="true"></svg>
            </div>
            <div *uiMenuSubContent>
              <div uiMenuItem>Find…</div>
              <div uiMenuItem>Find Next</div>
            </div>
          </ng-container>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
