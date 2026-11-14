import { Component } from "@angular/core"
import { UiTabs, UiTabsList, UiTabsPanel, UiTabsTab } from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [UiTabs, UiTabsList, UiTabsPanel, UiTabsTab],
  template: `
    <div uiTabs defaultValue="general" orientation="vertical">
      <div uiTabsList aria-label="Preferences">
        <button uiTabsTab value="general">General</button>
        <button uiTabsTab value="security">Security</button>
        <button uiTabsTab value="integrations">Integrations</button>
      </div>
      <div *uiTabsPanel="'general'">
        Choose your language, time zone and the page you start on.
      </div>
      <div *uiTabsPanel="'security'">
        Manage passkeys, signed-in sessions and recovery codes.
      </div>
      <div *uiTabsPanel="'integrations'">
        Connect your calendar and chat apps to get reminders.
      </div>
    </div>
  `,
})
class Example {}

export { Example }
