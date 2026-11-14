import { Component } from "@angular/core"
import {
  type TriggerDefinition,
  UiField,
  UiFieldControl,
  UiFieldLabel,
  UiTriggerMenu,
  UiTriggerMenuInput,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldControl,
    UiFieldLabel,
    UiTriggerMenu,
    UiTriggerMenuInput,
  ],
  template: `
    <ng-container uiTriggerMenu [triggers]="triggers">
      <div uiField>
        <label uiFieldLabel>Message</label>
        <input
          uiFieldControl
          uiTriggerMenuInput
          placeholder="Type @, / or #…"
        />
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly people = [
    { value: "hollis", label: "Hollis Grant" },
    { value: "ines", label: "Inès Moreau" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "wren", label: "Wren Takahashi" },
    { value: "tomasz", label: "Tomasz Wójcik" },
  ]

  protected readonly channels = [
    "announcements",
    "design",
    "design-reviews",
    "engineering",
    "general",
    "launches",
    "support",
  ]
  protected readonly commands = ["away", "remind", "search", "status"]
  protected readonly triggers: TriggerDefinition[] = [
    { char: "@", items: this.people },
    { char: "/", boundary: "start", items: this.commands },
    {
      char: "#",
      items: (query, options) => this.searchChannels(query, options),
    },
  ]

  protected searchChannels(query: string, { signal }: { signal: AbortSignal }) {
    return new Promise<string[]>((resolve, reject) => {
      const timer = setTimeout(
        () =>
          resolve(
            this.channels.filter((channel) =>
              channel.includes(query.toLowerCase())
            )
          ),
        400
      )
      signal.addEventListener("abort", () => {
        clearTimeout(timer)
        reject(signal.reason)
      })
    })
  }
}

export { Example }
