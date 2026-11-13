import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  UiCollapsible,
  UiCollapsiblePanel,
  UiCollapsibleTrigger,
} from "ui-sdk-angular"
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
    <div
      uiCollapsible
      data-variant="card"
      (openChangeComplete)="
        log($event ? 'Finished opening' : 'Finished closing')
      "
    >
      <button uiCollapsibleTrigger>
        <span data-slot="stack">
          <span>Release notes</span>
          <span data-slot="hint">Version 2.4, released October 28</span>
        </span>
        <svg lucideChevronDown aria-hidden="true"></svg>
      </button>
      <div *uiCollapsiblePanel>
        <ul>
          @for (note of notes; track note) {
            <li>{{ note }}</li>
          }
        </ul>
      </div>
    </div>
  `,
})
class Example {
  protected readonly notes = [
    "Search now matches file contents, not only names.",
    "Shared links remember the folder they were opened from.",
    "Uploads resume after the connection drops.",
  ]
  protected readonly log = injectLog()
}

export { Example }
