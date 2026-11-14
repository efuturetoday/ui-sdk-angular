import { Component } from "@angular/core"
import { LucideStar } from "@lucide/angular"
import { UiToggle, UiToggleIcon } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [LucideStar, UiToggle, UiToggleIcon],
  template: `
    <div data-slot="card">
      <div data-slot="stack">
        <h3>Q3 Roadmap</h3>
        <p data-slot="hint">Edited by Hollis Grant</p>
      </div>
      <button uiToggle aria-label="Star">
        <span uiToggleIcon data-variant="fill">
          <svg lucideStar></svg>
        </span>
      </button>
    </div>
  `,
})
class Example {}

export { Example }
