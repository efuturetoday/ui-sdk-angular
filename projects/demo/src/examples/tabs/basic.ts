import { Component } from "@angular/core"
import { UiTabs, UiTabsList, UiTabsPanel, UiTabsTab } from "ngx-ui-sdk/tabs"

@Component({
  selector: "app-example",
  imports: [UiTabs, UiTabsList, UiTabsPanel, UiTabsTab],
  template: `
    <div uiTabs defaultValue="account">
      <div uiTabsList aria-label="Settings">
        <button uiTabsTab value="account">Account</button>
        <button uiTabsTab value="password">Password</button>
      </div>
      <div *uiTabsPanel="'account'">
        Update your name, email address and profile photo. Your team sees
        changes right away.
      </div>
      <div *uiTabsPanel="'password'">
        Choose a new password for hollis@example.com. You stay signed in on this
        device.
      </div>
    </div>
  `,
})
class Example {}

export { Example }
