import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuSeparator,
  UiMenuShortcut,
  UiMenuSub,
  UiMenuSubTrigger,
  UiMenuTrigger,
} from "@ngx-ui-sdk/core/menu"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronRight,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuSeparator,
    UiMenuShortcut,
    UiMenuSub,
    UiMenuSubTrigger,
    UiMenuTrigger,
  ],
  template: `
    <ng-container uiMenu [onAction]="onAction">
      <button uiMenuTrigger>Edit</button>
      <div *uiMenuContent="let state">
        <div uiMenuItem value="undo" shortcut="mod+z">
          Undo<span uiMenuShortcut></span>
        </div>
        <div uiMenuItem value="redo" shortcut="mod+shift+z">
          Redo<span uiMenuShortcut></span>
        </div>
        <div uiMenuSeparator></div>
        <ng-container uiMenuSub>
          <div uiMenuSubTrigger>
            Find
            <svg lucideChevronRight aria-hidden="true"></svg>
          </div>
          <div *uiMenuSubContent>
            <div uiMenuItem value="find" shortcut="mod+f">
              Find…<span uiMenuShortcut></span>
            </div>
            <div uiMenuItem value="find-next" shortcut="mod+g">
              Find next<span uiMenuShortcut></span>
            </div>
            <div uiMenuItem value="find-previous" shortcut="mod+shift+g">
              Find previous<span uiMenuShortcut></span>
            </div>
          </div>
        </ng-container>
        <ng-container uiMenuSub>
          <div uiMenuSubTrigger>
            Transform
            <svg lucideChevronRight aria-hidden="true"></svg>
          </div>
          <div *uiMenuSubContent>
            <ng-container uiMenuSub>
              <div uiMenuSubTrigger>
                Case
                <svg lucideChevronRight aria-hidden="true"></svg>
              </div>
              <div *uiMenuSubContent>
                <div uiMenuItem value="uppercase">Uppercase</div>
                <div uiMenuItem value="lowercase">Lowercase</div>
              </div>
            </ng-container>
            <div uiMenuItem value="trim">Trim whitespace</div>
          </div>
        </ng-container>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly #log = injectLog()
  protected readonly onAction = (value: string) => this.#log(`Chose ${value}`)
}

export { Example }
