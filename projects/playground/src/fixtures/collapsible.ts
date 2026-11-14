import { Component, signal } from "@angular/core"
import { collapsibleFixture as fixture } from "tests/fixtures/collapsible"
import { collapsibleOptions } from "tests/fixtures/page"
import {
  createCollapsibleController,
  UiCollapsible,
  UiCollapsiblePanel,
  UiCollapsibleTrigger,
  type CollapsibleOpenChangeReason,
} from "ngx-ui-sdk/collapsible"
import type { ChangeDetails } from "@ui-sdk/core"

@Component({
  selector: "app-fixture",
  imports: [UiCollapsible, UiCollapsiblePanel, UiCollapsibleTrigger],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiCollapsible
        class="collapsible"
        [defaultOpen]="options.defaultOpen"
        [disabled]="options.disabled"
        [controller]="controller"
        (beforeOpenChange)="onOpenChange($event)"
        (openChangeComplete)="complete.set($event ? 'open' : 'closed')"
      >
        <button uiCollapsibleTrigger class="collapsible-trigger">{{ fixture.trigger }}</button>
        <div
          *uiCollapsiblePanel="let state; keepMounted: options.keepMounted; hiddenUntilFound: options.hiddenUntilFound"
          class="collapsible-panel"
        >
          <p>{{ fixture.content }}</p>
          <label>{{ fixture.field }} <input /></label>
          <button (click)="controller.close()">{{ fixture.close }}</button>
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Last reason">{{ reason() }}</output>
      <output aria-label="Last source">{{ source() }}</output>
      <output aria-label="Last completed">{{ complete() }}</output>
      <button (click)="controller.toggle()">{{ fixture.controller }}</button>
    </div>
  `,
})
class Fixture {
  protected readonly fixture = fixture
  protected readonly options = collapsibleOptions()
  protected readonly controller = createCollapsibleController()
  protected readonly action = signal("")
  protected readonly reason = signal("")
  protected readonly source = signal("")
  protected readonly complete = signal("")

  protected onOpenChange({
    open,
    details,
  }: {
    open: boolean
    details: ChangeDetails<CollapsibleOpenChangeReason>
  }) {
    if (this.options.cancel === (open ? "open" : "close")) {
      return details.cancel()
    }
    this.action.set(open ? "open" : "closed")
    this.reason.set(details.reason)
    this.source.set(details.source)
  }
}

export { Fixture }
