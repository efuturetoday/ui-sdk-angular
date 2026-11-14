import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  UiCollapsible,
  UiCollapsiblePanel,
  UiCollapsibleTrigger,
} from "@ngx-ui-sdk/core/collapsible"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronDown,
    UiCollapsible,
    UiCollapsiblePanel,
    UiCollapsibleTrigger,
  ],
  template: `
    <div uiCollapsible data-variant="card">
      <h3>
        <button uiCollapsibleTrigger #trigger="uiCollapsibleTrigger">
          <span data-slot="stack">
            <span>Track parcel</span>
            <span data-slot="hint">
              {{ trigger.state().open ? "3 updates" : "Arrives Thursday" }}
            </span>
          </span>
          <svg lucideChevronDown aria-hidden="true"></svg>
        </button>
      </h3>
      <ol *uiCollapsiblePanel>
        @for (update of updates; track update.label) {
          <li data-slot="row">
            <span>{{ update.label }}</span>
            <span>{{ update.time }}</span>
          </li>
        }
      </ol>
    </div>
  `,
})
class Example {
  protected readonly updates = [
    { label: "Out for delivery", time: "07:40" },
    { label: "Arrived at the local depot", time: "05:12" },
    { label: "Left the sorting center", time: "Wed 21:03" },
  ]
}

export { Example }
