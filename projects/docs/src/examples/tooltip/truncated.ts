import { Component } from "@angular/core"
import { LucideFile } from "@lucide/angular"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "@ngx-ui-sdk/core/tooltip"

@Component({
  selector: "app-example",
  imports: [LucideFile, UiTooltip, UiTooltipContent, UiTooltipTrigger],
  template: `
    <ul>
      @for (file of files; track file) {
        <li>
          <ng-container
            uiTooltip
            type="label"
            (beforeOpenChange)="
              onOpenChange($event.open, $event.details, name)
            ">
            <button uiTooltipTrigger>
              <svg lucideFile aria-hidden="true"></svg>
              <span #name>{{ file }}</span>
            </button>
            <div *uiTooltipContent>{{ file }}</div>
          </ng-container>
        </li>
      }
    </ul>
  `,
})
class Example {
  protected readonly files = [
    "Quarterly report, final revised version for the board.pdf",
    "Notes.txt",
    "Design review recording, October 2nd.mp4",
    "Budget.xlsx",
  ]

  protected onOpenChange(
    open: boolean,
    details: ChangeDetails,
    name: HTMLElement
  ) {
    if (open && name.scrollWidth <= name.clientWidth) {
      details.cancel()
    }
  }
}

export { Example }
