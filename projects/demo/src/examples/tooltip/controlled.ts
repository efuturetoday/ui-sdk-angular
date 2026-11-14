import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiTooltip,
    UiTooltipContent,
    UiTooltipTrigger,
  ],
  template: `
    <div data-slot="stack">
      <div #controls data-slot="controls">
        <label data-slot="label">
          <button uiCheckbox #box="uiCheckbox" [(checked)]="open">
            <span *uiCheckboxIndicator>
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
          </button>
          <input [uiCheckboxInput]="box" />
          Open
        </label>
      </div>
      <ng-container
        uiTooltip
        [(open)]="open"
        (beforeOpenChange)="onOpenChange($event.open, $event.details, controls)"
      >
        <button uiTooltipTrigger>Export</button>
        <div *uiTooltipContent>Download as CSV</div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly open = signal(false)

  protected onOpenChange(
    next: boolean,
    details: ChangeDetails,
    controls: HTMLElement
  ) {
    const target = details.event?.target
    const inControls = target instanceof Node && controls.contains(target)
    if (inControls && details.reason !== "escape-key") {
      return details.cancel()
    }
    this.log(`${next ? "Opened" : "Closed"} (${details.reason})`)
  }
}

export { Example }
