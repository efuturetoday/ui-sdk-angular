import { Component, signal } from "@angular/core"
import {
  UiCollapsible,
  UiCollapsiblePanel,
  UiCollapsibleTrigger,
} from "@ngx-ui-sdk/core/collapsible"

@Component({
  selector: "app-fixture",
  imports: [UiCollapsible, UiCollapsiblePanel, UiCollapsibleTrigger],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiCollapsible
        #collapsible="uiCollapsible"
        class="collapsible"
        (openChange)="action.set($event ? 'open' : 'closed')"
      >
        <span [class]="collapsible.state().open ? 'is-open' : 'is-closed'" hidden></span>
        <div uiCollapsibleTrigger #trigger="uiCollapsibleTrigger" class="collapsible-trigger">Files<span aria-hidden="true"> {{ trigger.state().open ? "−" : "+" }}</span></div>
        <section *uiCollapsiblePanel class="collapsible-panel">The files panel.</section>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly action = signal("")
}

export { Fixture }
