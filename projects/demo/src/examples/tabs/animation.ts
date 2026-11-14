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
      <div uiTabsList aria-label="Project">
        <button uiTabsTab value="overview">Overview</button>
        <button uiTabsTab value="activity">Activity</button>
        <button uiTabsTab value="settings">Settings</button>
        <span uiTabsIndicator></span>
      </div>
      <div data-slot="stack">
        <div *uiTabsPanel="'overview'">
          The launch is on track for Friday, with 4 of 6 tasks done.
        </div>
        <div *uiTabsPanel="'activity'">
          Inès Moreau deployed to production and Kofi Mensah left a review.
        </div>
        <div *uiTabsPanel="'settings'">
          Rename the project, transfer it to another team or archive it.
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
