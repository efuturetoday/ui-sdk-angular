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
  UiCommandGroup,
  UiCommandGroupLabel,
  UiCommandInput,
  UiCommandItem,
  UiCommandItemIcon,
  UiCommandList,
  UiCommandSeparator,
  UiCommandShortcut,
} from "@ngx-ui-sdk/core/command"

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
    UiCommandGroup,
    UiCommandGroupLabel,
    UiCommandInput,
    UiCommandItem,
    UiCommandItemIcon,
    UiCommandList,
    UiCommandSeparator,
    UiCommandShortcut,
  ],
  template: `
    <div uiCommand>
      <div data-slot="row">
        <svg lucideSearch aria-hidden="true"></svg>
        <input
          uiCommandInput
          aria-label="Search commands"
          placeholder="Type a command or search…"
        />
      </div>
      <div uiCommandEmpty>No results found.</div>
      <div uiCommandList>
        <div uiCommandGroup>
          <div uiCommandGroupLabel>Suggestions</div>
          <div uiCommandItem value="calendar">
            <span uiCommandItemIcon><svg lucideCalendar></svg></span>
            <span>Calendar</span>
          </div>
          <div uiCommandItem value="emoji">
            <span uiCommandItemIcon><svg lucideSmile></svg></span>
            <span>Search Emoji</span>
          </div>
          <div uiCommandItem value="calculator" disabled>
            <span uiCommandItemIcon><svg lucideCalculator></svg></span>
            <span>Calculator</span>
          </div>
        </div>
        <div uiCommandSeparator></div>
        <div uiCommandGroup>
          <div uiCommandGroupLabel>Settings</div>
          <div uiCommandItem value="profile" shortcut="mod+p">
            <span uiCommandItemIcon><svg lucideUser></svg></span>
            <span>Profile</span>
            <span uiCommandShortcut></span>
          </div>
          <div uiCommandItem value="billing" shortcut="mod+b">
            <span uiCommandItemIcon><svg lucideCreditCard></svg></span>
            <span>Billing</span>
            <span uiCommandShortcut></span>
          </div>
          <div uiCommandItem value="settings" shortcut="mod+s">
            <span uiCommandItemIcon><svg lucideSettings></svg></span>
            <span>Settings</span>
            <span uiCommandShortcut></span>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
