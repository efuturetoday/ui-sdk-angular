import { Component } from "@angular/core"
import {
  LucideCalculator,
  LucideCalendar,
  LucideCreditCard,
  LucideSearch,
  LucideSettings,
  LucideSmile,
  LucideUser,
} from "@lucide/angular"
import {
  UiCommand,
  UiCommandEmpty,
  UiCommandInput,
  UiCommandItem,
  UiCommandItemIcon,
  UiCommandItemText,
  UiCommandList,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideCalculator,
    LucideCalendar,
    LucideCreditCard,
    LucideSearch,
    LucideSettings,
    LucideSmile,
    LucideUser,
    UiCommand,
    UiCommandEmpty,
    UiCommandInput,
    UiCommandItem,
    UiCommandItemIcon,
    UiCommandItemText,
    UiCommandList,
  ],
  template: `
    <div uiCommand>
      <div data-slot="row">
        <svg lucideSearch aria-hidden="true"></svg>
        <input
          uiCommandInput
          aria-label="Search commands"
          placeholder="Try “prf” or “emo”…"
        />
      </div>
      <div uiCommandEmpty>No results found.</div>
      <div uiCommandList>
        <div uiCommandItem value="calendar">
          <span uiCommandItemIcon><svg lucideCalendar></svg></span>
          <span uiCommandItemText>Calendar</span>
        </div>
        <div uiCommandItem value="emoji">
          <span uiCommandItemIcon><svg lucideSmile></svg></span>
          <span uiCommandItemText>Search Emoji</span>
        </div>
        <div uiCommandItem value="calculator" disabled>
          <span uiCommandItemIcon><svg lucideCalculator></svg></span>
          <span uiCommandItemText>Calculator</span>
        </div>
        <div uiCommandItem value="profile">
          <span uiCommandItemIcon><svg lucideUser></svg></span>
          <span uiCommandItemText>Profile</span>
        </div>
        <div uiCommandItem value="billing">
          <span uiCommandItemIcon><svg lucideCreditCard></svg></span>
          <span uiCommandItemText>Billing</span>
        </div>
        <div uiCommandItem value="settings">
          <span uiCommandItemIcon><svg lucideSettings></svg></span>
          <span uiCommandItemText>Settings</span>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
