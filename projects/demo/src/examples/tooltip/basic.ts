import { Component } from "@angular/core"
import { LucideBookmark } from "@lucide/angular"
import { UiTooltip, UiTooltipContent, UiTooltipTrigger } from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [LucideBookmark, UiTooltip, UiTooltipContent, UiTooltipTrigger],
  template: `
    <ng-container uiTooltip defaultOpen>
      <button uiTooltipTrigger aria-label="Add to library">
        <svg lucideBookmark aria-hidden="true"></svg>
      </button>
      <div *uiTooltipContent>Add to library</div>
    </ng-container>
  `,
})
class Example {}

export { Example }
