import { Component, signal } from "@angular/core"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuTrigger,
} from "@ngx-ui-sdk/core/menu"

@Component({
  selector: "app-fixture",
  imports: [UiMenu, UiMenuContent, UiMenuItem, UiMenuTrigger],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiMenu [open]="open()" (openChange)="open.set($event)">
        <button uiMenuTrigger>Actions</button>
        @if (open()) {
          <div *uiMenuContent class="popup fill-in">
            <div uiMenuItem class="item" value="rename">Rename</div>
            <div uiMenuItem class="item" value="delete">Delete</div>
          </div>
        }
      </ng-container>
    </div>
  `,
})
class Fixture {
  protected readonly open = signal(false)
}

export { Fixture }
