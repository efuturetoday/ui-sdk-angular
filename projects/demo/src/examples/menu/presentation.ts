import { Component } from "@angular/core"
import {
  LucideChevronRight,
  LucideDownload,
  LucideLink,
  LucideShare,
  LucideTrash,
} from "@lucide/angular"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuSeparator,
  UiMenuSub,
  UiMenuSubTrigger,
  UiMenuTrigger,
} from "ngx-ui-sdk/menu"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronRight,
    LucideDownload,
    LucideLink,
    LucideShare,
    LucideTrash,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuSeparator,
    UiMenuSub,
    UiMenuSubTrigger,
    UiMenuTrigger,
  ],
  template: `
    <ng-container uiMenu presentation="sheet" [onAction]="onAction">
      <button uiMenuTrigger>Options</button>
      <div *uiMenuContent="let state">
        <div uiMenuItem value="share">
          <svg lucideShare></svg>
          Share
        </div>
        <div uiMenuItem value="copy-link">
          <svg lucideLink></svg>
          Copy link
        </div>
        <ng-container uiMenuSub>
          <div uiMenuSubTrigger>
            <svg lucideDownload></svg>
            Move to
            <svg lucideChevronRight aria-hidden="true"></svg>
          </div>
          <div *uiMenuSubContent>
            <div uiMenuItem value="inbox">Inbox</div>
            <div uiMenuItem value="archive">Archive</div>
          </div>
        </ng-container>
        <div uiMenuSeparator></div>
        <div uiMenuItem value="delete" destructive>
          <svg lucideTrash aria-hidden="true"></svg>
          Delete
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly #log = injectLog()
  protected readonly onAction = (value: string) => this.#log(`Chose ${value}`)
}

export { Example }
