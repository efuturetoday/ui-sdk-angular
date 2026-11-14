import { Component, signal } from "@angular/core"
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
} from "ngx-ui-sdk/command"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogContent,
  UiDialogShortcut,
  UiDialogTitle,
  UiDialogTrigger,
} from "ngx-ui-sdk/dialog"
import { injectLog } from "../../shared/log"

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
    UiDialog,
    UiDialogBackdrop,
    UiDialogContent,
    UiDialogShortcut,
    UiDialogTitle,
    UiDialogTrigger,
  ],
  template: `
    <div data-slot="stack">
      <ng-container uiDialog [(open)]="open">
        <button uiDialogTrigger shortcut="mod+k">
          Search…
          <span uiDialogShortcut></span>
        </button>
        <div *uiDialogBackdrop></div>
        <div *uiDialogContent>
          <h2 uiDialogTitle>Command palette</h2>
          <div uiCommand [onAction]="onAction">
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
                  Calendar
                </div>
                <div uiCommandItem value="emoji">
                  <span uiCommandItemIcon><svg lucideSmile></svg></span>
                  Search Emoji
                </div>
                <div uiCommandItem value="calculator" disabled>
                  <span uiCommandItemIcon><svg lucideCalculator></svg></span>
                  Calculator
                </div>
                <div uiCommandItem value="profile">
                  <span uiCommandItemIcon><svg lucideUser></svg></span>
                  Profile
                </div>
                <div uiCommandItem value="billing">
                  <span uiCommandItemIcon><svg lucideCreditCard></svg></span>
                  Billing
                </div>
                <div uiCommandItem value="settings">
                  <span uiCommandItemIcon><svg lucideSettings></svg></span>
                  Settings
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly open = signal(false)
  protected readonly log = injectLog()

  protected readonly onAction = (value: string) => {
    this.log(`Ran ${value}`)
    this.open.set(false)
  }
}

export { Example }
