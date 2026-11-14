import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { LucideCheck, LucideChevronRight } from "@lucide/angular"
import {
  UiMenu,
  UiMenuCheckboxItem,
  UiMenuContent,
  UiMenuGroupLabel,
  UiMenuItem,
  UiMenuItemIndicator,
  UiMenuRadioGroup,
  UiMenuRadioItem,
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
    UiText,
    LucideCheck,
    LucideChevronRight,
    UiMenu,
    UiMenuCheckboxItem,
    UiMenuContent,
    UiMenuGroupLabel,
    UiMenuItem,
    UiMenuItemIndicator,
    UiMenuRadioGroup,
    UiMenuRadioItem,
    UiMenuSeparator,
    UiMenuShortcut,
    UiMenuSub,
    UiMenuSubTrigger,
    UiMenuTrigger,
  ],
  template: `
    <div data-slot="row">
      <ng-container uiMenu [onAction]="onAction">
        <button uiMenuTrigger>Document</button>
        <div *uiMenuContent="let state">
          <div uiMenuItem value="undo" shortcut="mod+z" disabled>
            Undo
            <span uiMenuShortcut uiText></span>
          </div>
          <div uiMenuItem value="redo" shortcut="mod+shift+z">
            Redo
            <span uiMenuShortcut uiText></span>
          </div>
          <div uiMenuSeparator></div>
          <div uiMenuCheckboxItem value="autosave" defaultChecked disabled>
            <span *uiMenuItemIndicator>
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
            Autosave
          </div>
          <div uiMenuSeparator></div>
          <div uiMenuRadioGroup defaultValue="pdf">
            <div uiMenuGroupLabel>Export as</div>
            <div uiMenuRadioItem value="pdf">
              <span *uiMenuItemIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
              </span>
              PDF
            </div>
            <div uiMenuRadioItem value="docx" disabled>
              <span *uiMenuItemIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
              </span>
              Word
            </div>
            <div uiMenuRadioItem value="markdown">
              <span *uiMenuItemIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
              </span>
              Markdown
            </div>
          </div>
          <div uiMenuSeparator></div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger disabled>
              Move to
              <svg lucideChevronRight aria-hidden="true"></svg>
            </div>
            <div *uiMenuSubContent>
              <div uiMenuItem>Archive</div>
            </div>
          </ng-container>
        </div>
      </ng-container>
      <ng-container uiMenu>
        <button uiMenuTrigger disabled>Locked</button>
        <div *uiMenuContent="let state">
          <div uiMenuItem>Unlock</div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly #log = injectLog()
  protected readonly onAction = (value: string) => this.#log(`Chose ${value}`)
}

export { Example }
