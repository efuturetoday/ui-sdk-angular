import { Component } from "@angular/core"
import { LucideArchive } from "@lucide/angular"
import {
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "ngx-ui-sdk/tooltip"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [LucideArchive, UiTooltip, UiTooltipContent, UiTooltipTrigger],
  template: `
    <ng-container
      uiTooltip
      (openChange)="log($event ? 'Opening' : 'Closing')"
      (openChangeComplete)="log($event ? 'Open' : 'Closed')"
    >
      <button uiTooltipTrigger aria-label="Archive">
        <svg lucideArchive aria-hidden="true"></svg>
      </button>
      <div *uiTooltipContent>Archive</div>
    </ng-container>
  `,
})
class Example {
  protected readonly log = injectLog()
}

export { Example }
