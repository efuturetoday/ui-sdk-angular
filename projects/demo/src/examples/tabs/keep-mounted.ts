import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import { UiTextarea } from "ngx-ui-sdk/input"
import {
  UiTabs,
  UiTabsIndicator,
  UiTabsList,
  UiTabsPanel,
  UiTabsTab,
} from "ngx-ui-sdk/tabs"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldLabel,
    UiTabs,
    UiTabsIndicator,
    UiTabsList,
    UiTabsPanel,
    UiTabsTab,
    UiTextarea,
  ],
  template: `
    <div uiTabs defaultValue="reply">
      <div uiTabsList aria-label="Comment">
        <button uiTabsTab value="reply">Reply</button>
        <button uiTabsTab value="formatting">Formatting</button>
        <span uiTabsIndicator></span>
      </div>
      <div *uiTabsPanel="'reply'; keepMounted: true">
        <div uiField>
          <label uiFieldLabel>Message</label>
          <textarea uiTextarea rows="3" placeholder="Write a reply…"></textarea>
        </div>
      </div>
      <div *uiTabsPanel="'formatting'">
        <p>Use **bold**, _italics_ and \`code\` to format your reply.</p>
        <p>Paste a link on its own line to show a preview.</p>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
