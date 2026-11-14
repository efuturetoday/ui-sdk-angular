import { Component } from "@angular/core"
import { LucideCheck, LucideMessageSquare } from "@lucide/angular"
import {
  UiToolbar,
  UiToolbarButton,
  UiToolbarLink,
  UiToolbarSeparator,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideMessageSquare,
    UiToolbar,
    UiToolbarButton,
    UiToolbarLink,
    UiToolbarSeparator,
  ],
  template: `
    <div uiToolbar aria-label="Pull request">
      <button uiToolbarButton aria-label="Approve" (click)="log('Approved')">
        <svg lucideCheck aria-hidden="true"></svg>
      </button>
      <button uiToolbarButton aria-label="Comment" (click)="log('Comment')">
        <svg lucideMessageSquare aria-hidden="true"></svg>
      </button>
      <div uiToolbarSeparator></div>
      <a uiToolbarLink href="#files" (click)="follow($event)">Files Changed</a>
      <a uiToolbarLink href="#checks" (click)="follow($event)">Checks</a>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected follow(event: MouseEvent) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
    this.log(`Opened ${(event.currentTarget as HTMLAnchorElement).textContent}`)
  }
}

export { Example }
