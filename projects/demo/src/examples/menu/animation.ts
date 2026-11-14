import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuSeparator,
  UiMenuSub,
  UiMenuSubTrigger,
  UiMenuTrigger,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronRight,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuSeparator,
    UiMenuSub,
    UiMenuSubTrigger,
    UiMenuTrigger,
  ],
  template: `
    <ng-container
      uiMenu
      (openChange)="log($event ? 'Opening' : 'Closing')"
      (openChangeComplete)="
        log($event ? 'Finished opening' : 'Finished closing')
      "
    >
      <button uiMenuTrigger>Animated</button>
      <div *uiMenuContent="let state; keepMounted: true">
        <div uiMenuItem>Back</div>
        <div uiMenuItem>Forward</div>
        <div uiMenuItem>Reload</div>
        <div uiMenuSeparator></div>
        <ng-container uiMenuSub>
          <div uiMenuSubTrigger>
            More tools
            <svg lucideChevronRight aria-hidden="true"></svg>
          </div>
          <div *uiMenuSubContent>
            <div uiMenuItem>Save page as…</div>
            <div uiMenuItem>Developer tools</div>
          </div>
        </ng-container>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly log = injectLog()
}

export { Example }
