import { Component } from "@angular/core"
import { UiTabsPanel } from "@ngx-ui-sdk/core/tabs"
import { Tab, TabList, Tabs } from "./design-tabs"

@Component({
  selector: "app-design-tabs-example",
  imports: [Tab, TabList, Tabs, UiTabsPanel],
  template: `
    <app-tabs defaultValue="account">
      <app-tab-list aria-label="Settings">
        <button appTab="account">Account</button>
        <button appTab="password">Password</button>
      </app-tab-list>
      <p *uiTabsPanel="'account'">Change your name and email.</p>
      <p *uiTabsPanel="'password'">Change your password.</p>
    </app-tabs>
  `,
})
class DesignTabsExample {}

export { DesignTabsExample }
