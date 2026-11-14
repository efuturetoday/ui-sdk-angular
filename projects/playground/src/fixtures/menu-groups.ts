import { Component, DestroyRef, inject, signal } from "@angular/core"
import { onItemsChange } from "tests/fixtures/items"
import { changedMenuGroups, menuGroups } from "tests/fixtures/menu-groups"
import {
  UiMenu,
  UiMenuContent,
  UiMenuGroup,
  UiMenuGroupLabel,
  UiMenuItem,
  UiMenuTrigger,
} from "ngx-ui-sdk/menu"

// Groups of items the specs reorder while the menu is open.
@Component({
  selector: "app-fixture",
  imports: [
    UiMenu,
    UiMenuContent,
    UiMenuGroup,
    UiMenuGroupLabel,
    UiMenuItem,
    UiMenuTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiMenu>
        <button uiMenuTrigger>Actions</button>
        <div *uiMenuContent class="popup">
          @for (group of groups(); track group.label) {
            <div uiMenuGroup>
              <div uiMenuGroupLabel class="label">{{ group.label }}</div>
              @for (item of group.items; track item.value) {
                <div uiMenuItem class="item" [value]="item.value">{{ item.label }}</div>
              }
            </div>
          }
        </div>
      </ng-container>
    </div>
  `,
})
class Fixture {
  protected readonly groups = signal(menuGroups)

  constructor() {
    inject(DestroyRef).onDestroy(
      onItemsChange(changedMenuGroups, (next) => this.groups.set(next))
    )
  }
}

export { Fixture }
