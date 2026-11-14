import { Component } from "@angular/core"
import { LucideCreditCard, LucideSettings, LucideUser } from "@lucide/angular"
import {
  UiCommand,
  UiCommandGroup,
  UiCommandGroupLabel,
  UiCommandInput,
  UiCommandItem,
  UiCommandItemIcon,
  UiCommandList,
  UiCommandShortcut,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCreditCard,
    LucideSettings,
    LucideUser,
    UiCommand,
    UiCommandGroup,
    UiCommandGroupLabel,
    UiCommandInput,
    UiCommandItem,
    UiCommandItemIcon,
    UiCommandList,
    UiCommandShortcut,
  ],
  template: `
    <div data-slot="stack">
      <div uiCommand [onAction]="ran">
        <input
          uiCommandInput
          aria-label="Search settings"
          placeholder="Search settings…"
        />
        <div uiCommandList>
          <div uiCommandGroup>
            <div uiCommandGroupLabel>Settings</div>
            <div uiCommandItem value="profile" shortcut="mod+p">
              <span uiCommandItemIcon><svg lucideUser></svg></span>
              <span>Profile</span>
              <span uiCommandShortcut #profile="uiCommandShortcut">{{
                profile.state().text
              }}</span>
            </div>
            <div uiCommandItem value="billing" shortcut="mod+b">
              <span uiCommandItemIcon><svg lucideCreditCard></svg></span>
              <span>Billing</span>
              <span uiCommandShortcut #billing="uiCommandShortcut">{{
                billing.state().text
              }}</span>
            </div>
            <div uiCommandItem value="settings" shortcut="mod+s">
              <span uiCommandItemIcon><svg lucideSettings></svg></span>
              <span>Settings</span>
              <span uiCommandShortcut #prefs="uiCommandShortcut">{{
                prefs.state().text
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly ran = (value: string) => this.log(`Ran ${value}`)
}

export { Example }
