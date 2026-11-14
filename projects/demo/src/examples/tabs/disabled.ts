import { Component } from "@angular/core"
import { UiTabs, UiTabsList, UiTabsPanel, UiTabsTab } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiTabs, UiTabsList, UiTabsPanel, UiTabsTab],
  template: `
    <div uiTabs defaultValue="overview">
      <div uiTabsList aria-label="Dashboard">
        <button uiTabsTab value="overview">Overview</button>
        <button uiTabsTab value="analytics">Analytics</button>
        <button uiTabsTab value="reports" disabled>Reports</button>
      </div>
      <div *uiTabsPanel="'overview'">
        Revenue, visitors and sign-ups for the last 30 days.
      </div>
      <div *uiTabsPanel="'analytics'">
        Where your visitors come from and the pages they read most.
      </div>
      <div *uiTabsPanel="'reports'">
        Monthly reports are available on the Pro plan.
      </div>
    </div>
  `,
})
class Example {}

export { Example }
