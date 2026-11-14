import { Component } from "@angular/core"
import { perfItems, perfSize } from "tests/fixtures/perf"
import {
  UiTabs,
  UiTabsList,
  UiTabsPanel,
  UiTabsTab,
} from "@ngx-ui-sdk/core/tabs"

// Many tabs for the counts specs.
@Component({
  selector: "app-fixture",
  imports: [UiTabs, UiTabsList, UiTabsPanel, UiTabsTab],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiTabs class="tabs" [defaultValue]="items[0]!.value">
        <div uiTabsList class="tablist" aria-label="Pages" style="flex-wrap: wrap">
          @for (item of items; track item.value) {
            <button uiTabsTab class="tab" [value]="item.value">{{ item.label }}</button>
          }
        </div>
        @for (item of items; track item.value) {
          <div *uiTabsPanel="item.value" class="panel">{{ item.label }} content.</div>
        }
      </div>
      <button>After</button>
    </div>
  `,
})
class Fixture {
  protected readonly items = perfItems(perfSize())
}

export { Fixture }
