import { Component } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiInput,
  UiTabs,
  UiTabsList,
  UiTabsPanel,
  UiTabsTab,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldLabel,
    UiInput,
    UiTabs,
    UiTabsList,
    UiTabsPanel,
    UiTabsTab,
  ],
  template: `
    <div uiTabs defaultValue="preview" activation="manual">
      <div uiTabsList aria-label="Snippet">
        <button uiTabsTab value="preview">Preview</button>
        <button uiTabsTab value="code">Code</button>
      </div>
      <div *uiTabsPanel="'preview'">
        Welcome back, Hollis. You have 3 unread messages.
      </div>
      <div *uiTabsPanel="'code'">
        <div uiField>
          <label uiFieldLabel>Source</label>
          <input uiInput defaultValue='<Welcome name="Hollis" unread={3} />' />
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
