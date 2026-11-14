import { Component } from "@angular/core"
import {
  LucideCode,
  LucideDownload,
  LucideLink,
  LucideMail,
  LucideReply,
  LucideShare,
} from "@lucide/angular"
import {
  UiMenu,
  UiMenuContent,
  UiMenuItem,
  UiMenuItemIcon,
  UiMenuSeparator,
  UiMenuTrigger,
} from "ngx-ui-sdk/menu"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCode,
    LucideDownload,
    LucideLink,
    LucideMail,
    LucideReply,
    LucideShare,
    UiMenu,
    UiMenuContent,
    UiMenuItem,
    UiMenuItemIcon,
    UiMenuSeparator,
    UiMenuTrigger,
  ],
  template: `
    <ng-container uiMenu [onAction]="onAction">
      <button uiMenuTrigger>
        <svg lucideShare></svg>
        Share
      </button>
      <div *uiMenuContent="let state">
        <div uiMenuItem value="copy-link">
          <span uiMenuItemIcon>
            <svg lucideLink></svg>
          </span>
          Copy link
        </div>
        <div uiMenuItem value="email">
          <span uiMenuItemIcon>
            <svg lucideMail></svg>
          </span>
          Email
        </div>
        <div uiMenuItem value="reply">
          <span uiMenuItemIcon mirror>
            <svg lucideReply></svg>
          </span>
          Reply
        </div>
        <div uiMenuSeparator></div>
        <div uiMenuItem value="download">
          <span uiMenuItemIcon>
            <svg lucideDownload></svg>
          </span>
          Download
        </div>
        <div uiMenuItem value="embed">
          <span uiMenuItemIcon>
            <svg lucideCode></svg>
          </span>
          Embed
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
