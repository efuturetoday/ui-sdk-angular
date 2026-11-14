import { Component, signal } from "@angular/core"
import { injectLog } from "../../shared/log"
import {
  createTabsController,
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
    <div>
      <div data-slot="controls">
        <button type="button" (click)="tabs.select('sent')">
          Show Sent Mail
        </button>
      </div>
      <div
        uiTabs
        [(value)]="value"
        [controller]="tabs"
        (beforeValueChange)="
          log('value: ' + $event.value + ' (' + $event.details.reason + ')')
        "
      >
        <div uiTabsList aria-label="Mail">
          <button uiTabsTab value="inbox">Inbox</button>
          <button uiTabsTab value="drafts">Drafts</button>
          <button uiTabsTab value="sent">Sent</button>
          <span uiTabsIndicator></span>
        </div>
        <div *uiTabsPanel="'inbox'">
          3 unread messages from Hollis Grant and Inès Moreau.
        </div>
        <div *uiTabsPanel="'drafts'">
          2 drafts, the last one edited yesterday at 4:12 PM.
        </div>
        <div *uiTabsPanel="'sent'">
          12 messages sent this week, all delivered.
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly tabs = createTabsController()
  protected readonly value = signal<string | null>("inbox")
}

export { Example }
