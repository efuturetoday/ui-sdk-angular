import { Component } from "@angular/core"
import {
  type CommandData,
  type CommandDataGroup,
  type CommandDataItem,
  UiCommand,
  UiCommandEmpty,
  UiCommandGroup,
  UiCommandGroupLabel,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
  UiCommandSeparator,
  UiCommandShortcut,
} from "@ngx-ui-sdk/core/command"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiCommand,
    UiCommandEmpty,
    UiCommandGroup,
    UiCommandGroupLabel,
    UiCommandInput,
    UiCommandItem,
    UiCommandList,
    UiCommandSeparator,
    UiCommandShortcut,
  ],
  template: `
    <div data-slot="stack">
      <div uiCommand [items]="commands" [onAction]="ran">
        <input
          uiCommandInput
          aria-label="Search commands"
          placeholder="Type a command…"
        />
        <div uiCommandEmpty>No results found.</div>
        <div uiCommandList #list="uiCommandList">
          @for (entry of list.state().items; track $index) {
            @if (isSeparator(entry)) {
              <div uiCommandSeparator></div>
            } @else if (isGroup(entry)) {
              <div uiCommandGroup>
                <div uiCommandGroupLabel>{{ asGroup(entry).label }}</div>
                @for (child of asGroup(entry).items; track $index) {
                  <div
                    uiCommandItem
                    [value]="asItem(child).value"
                    [label]="asItem(child).label"
                    [disabled]="asItem(child).disabled"
                    [shortcut]="asItem(child).shortcut"
                  >
                    {{ asItem(child).label }}
                    @if (asItem(child).shortcut) {
                      <span uiCommandShortcut></span>
                    }
                  </div>
                }
              </div>
            } @else {
              <div
                uiCommandItem
                [value]="asItem(entry).value"
                [label]="asItem(entry).label"
                [disabled]="asItem(entry).disabled"
                [shortcut]="asItem(entry).shortcut"
              >
                {{ asItem(entry).label }}
                @if (asItem(entry).shortcut) {
                  <span uiCommandShortcut></span>
                }
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly commands: CommandData = [
    {
      type: "group",
      label: "Navigation",
      items: [
        { value: "home", label: "Go home", keywords: ["start"] },
        { value: "inbox", label: "Open inbox", shortcut: "mod+i" },
      ],
    },
    { type: "separator" },
    {
      type: "group",
      label: "Preferences",
      items: [
        {
          value: "theme",
          label: "Change theme…",
          items: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
          ],
        },
        {
          value: "language",
          label: "Change language…",
          items: ["English", "Français", "Deutsch", "日本語"],
        },
        { value: "sign-out", label: "Sign out", shortcut: "mod+shift+q" },
      ],
    },
  ]
  protected readonly log = injectLog()
  protected readonly ran = (value: string) => this.log(`Ran ${value}`)

  protected isSeparator(entry: unknown) {
    return (entry as { type?: string }).type === "separator"
  }

  protected isGroup(entry: unknown) {
    return (entry as { type?: string }).type === "group"
  }

  protected asGroup(entry: unknown) {
    return entry as CommandDataGroup
  }

  protected asItem(entry: unknown): CommandDataItem {
    return typeof entry === "string"
      ? { value: entry, label: entry }
      : (entry as CommandDataItem)
  }
}

export { Example }
