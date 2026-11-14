import { Component } from "@angular/core"
import {
  UiTabs,
  UiTabsIndicator,
  UiTabsList,
  UiTabsPanel,
  UiTabsTab,
} from "ngx-ui-sdk/tabs"

@Component({
  selector: "app-example",
  imports: [UiTabs, UiTabsIndicator, UiTabsList, UiTabsPanel, UiTabsTab],
  template: `
    <div uiTabs defaultValue="overview">
      <div uiTabsList aria-label="Dashboard">
        <button uiTabsTab value="overview">Overview</button>
        <button uiTabsTab value="analytics">Analytics</button>
        <button uiTabsTab value="reports">Reports</button>
        <span uiTabsIndicator></span>
      </div>
      <div *uiTabsPanel="'overview'">
        Revenue, visitors and sign-ups for the last 30 days.
      </div>
      <div *uiTabsPanel="'analytics'">
        Where visitors come from and what they do.
      </div>
      <div *uiTabsPanel="'reports'">Monthly reports, ready to download.</div>
    </div>
  `,
})
class Example {}

export { Example }
