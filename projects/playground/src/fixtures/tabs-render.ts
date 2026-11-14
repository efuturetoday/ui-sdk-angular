import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import { tabsOptions } from "tests/fixtures/page"
import {
  UiTabs,
  UiTabsList,
  UiTabsPanel,
  UiTabsTab,
} from "@ngx-ui-sdk/core/tabs"

@Component({
  selector: "app-fixture",
  imports: [UiTabs, UiTabsList, UiTabsPanel, UiTabsTab],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiTabs
        class="tabs"
        defaultValue="overview"
        [activation]="activation"
        (beforeValueChange)="onValueChange($event.value, $event.details)"
      >
        <div uiTabsList class="tablist" aria-label="Project">
          <a uiTabsTab class="tab" value="overview" href="#overview">Overview</a>
          <a uiTabsTab class="tab" value="activity" href="#activity">Activity</a>
          <button uiTabsTab #watched="uiTabsTab" class="tab" value="watched">
            Watched@if (watched.state().selected) {
              <span aria-hidden="true"> •</span>
            }
          </button>
          <span uiTabsTab #plain="uiTabsTab" class="tab" value="plain">
            <span [class]="plain.state().selected ? 'is-selected' : 'is-unselected'">Plain</span>
          </span>
        </div>
        @for (value of values; track value) {
          <div *uiTabsPanel="value" class="panel">The {{ value }} panel.</div>
        }
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Reason">{{ reason() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly activation = tabsOptions().activation
  protected readonly values = ["overview", "activity", "watched", "plain"]
  protected readonly action = signal("")
  protected readonly reason = signal("")

  protected onValueChange(value: string | null, details: ChangeDetails) {
    this.action.set(value ?? "")
    this.reason.set(details.reason)
  }
}

export { Fixture }
