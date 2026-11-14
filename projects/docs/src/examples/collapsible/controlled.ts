import { Component, signal } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  createCollapsibleController,
  UiCollapsible,
  UiCollapsiblePanel,
  UiCollapsibleTrigger,
} from "@ngx-ui-sdk/core/collapsible"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronDown,
    UiCollapsible,
    UiCollapsiblePanel,
    UiCollapsibleTrigger,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="collapsible.toggle()">Toggle</button>
      </div>
      <div
        uiCollapsible
        [(open)]="open"
        data-variant="card"
        [controller]="collapsible"
        (beforeOpenChange)="onOpenChange($event.open, $event.details)">
        <button uiCollapsibleTrigger>
          <span data-slot="stack">
            <span>Recovery codes</span>
            <span data-slot="hint">Each code signs you in once</span>
          </span>
          <svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiCollapsiblePanel>
          <div data-slot="stack">
            <ul>
              @for (code of recoveryCodes; track code) {
                <li>{{ code }}</li>
              }
            </ul>
            <button type="button" (click)="collapsible.close()">Done</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly recoveryCodes = [
    "7KQ2-M9XD",
    "P4TR-8HZC",
    "W3NB-6JUE",
    "C5YF-2LSA",
  ]
  protected readonly log = injectLog()
  protected readonly collapsible = createCollapsibleController()
  protected readonly open = signal(false)

  protected onOpenChange(next: boolean, details: ChangeDetails) {
    this.log(`${next ? "Opened" : "Closed"} (${details.reason})`)
  }
}

export { Example }
