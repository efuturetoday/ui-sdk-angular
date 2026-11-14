import { Component } from "@angular/core"
import { UiTabs, UiTabsList, UiTabsTab } from "@ngx-ui-sdk/core/tabs"

@Component({
  selector: "app-tabs",
  hostDirectives: [
    {
      directive: UiTabs,
      inputs: ["value", "defaultValue"],
      outputs: ["valueChange"],
    },
  ],
  template: "<ng-content />",
  styles: `
    :host {
      display: grid;
      gap: 12px;
      width: min(24rem, 100%);
    }
  `,
})
class Tabs {}

@Component({
  selector: "app-tab-list",
  hostDirectives: [UiTabsList],
  template: "<ng-content />",
  styles: `
    :host {
      display: flex;
      gap: 4px;
      padding: 4px;
      border-radius: 8px;
      background: color-mix(in oklab, currentColor 8%, transparent);
    }
  `,
})
class TabList {}

@Component({
  // A tab people press stays a native button, so its selector is an attribute.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "button[appTab]",
  hostDirectives: [{ directive: UiTabsTab, inputs: ["value: appTab"] }],
  template: "<ng-content />",
  styles: `
    :host {
      flex: 1;
      padding: 6px 10px;
      border: 0;
      border-radius: 6px;
      background: none;
      color: inherit;
      font: inherit;
      font-size: 14px;
      cursor: pointer;
    }

    :host([data-selected]) {
      background: var(--frame-paper, #fff);
      box-shadow: 0 1px 2px rgb(0 0 0 / 0.12);
    }
  `,
})
class Tab {}

export { Tab, TabList, Tabs }
