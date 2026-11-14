import { Component } from "@angular/core"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuTrigger,
  UiMenubar,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiMenu, UiMenuContent, UiMenuItem, UiMenuTrigger, UiMenubar],
  template: `
    <div uiMenubar orientation="vertical">
      @for (label of labels; track label) {
        <ng-container uiMenu>
          <button uiMenuTrigger>{{ label }}</button>
          <div *uiMenuContent="let state">
            <div uiMenuItem>Open {{ label }}</div>
            <div uiMenuItem>Mark all as read</div>
          </div>
        </ng-container>
      }
    </div>
  `,
})
class Example {
  protected readonly labels = ["Inbox", "Drafts", "Archive"]
}

export { Example }
