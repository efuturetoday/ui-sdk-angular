import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import { tabsOptions } from "tests/fixtures/page"
import { tabsFixture } from "tests/fixtures/tabs"
import {
  createTabsController,
  UiTabs,
  UiTabsIndicator,
  UiTabsList,
  UiTabsPanel,
  UiTabsTab,
  type TabsValueChangeReason,
} from "ui-sdk-angular"

@Component({
  selector: "app-fixture",
  imports: [UiTabs, UiTabsIndicator, UiTabsList, UiTabsPanel, UiTabsTab],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiTabs
        class="tabs"
        [defaultValue]="options.defaultValue"
        [activation]="options.activation"
        [orientation]="options.orientation"
        [controller]="controller"
        (beforeValueChange)="onValueChange($event)"
      >
        <div uiTabsList class="tablist" [attr.aria-label]="fixture.label">
          @for (tab of fixture.tabs; track tab.value) {
            <button uiTabsTab class="tab" [value]="tab.value" [disabled]="tab.disabled">
              {{ tab.label }}
            </button>
          }
          <span uiTabsIndicator class="indicator"></span>
        </div>
        @for (tab of fixture.tabs; track tab.value) {
          <div *uiTabsPanel="tab.value; keepMounted: options.keepMounted" class="panel">
            {{ tab.content }}
            @if (tab.field) {
              <label> {{ tab.field }} <input type="password" /></label>
            }
          </div>
        }
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.select('notifications')">Show notifications</button>
    </div>
  `,
})
class Fixture {
  protected readonly fixture = tabsFixture
  protected readonly controller = createTabsController()
  protected readonly options = tabsOptions()
  protected readonly action = signal("")

  protected onValueChange({
    value,
    details,
  }: {
    value: string | null
    details: ChangeDetails<TabsValueChangeReason>
  }) {
    if (value === this.options.cancel) {
      return details.cancel()
    }
    this.action.set(value ?? "")
  }
}

export { Fixture }
