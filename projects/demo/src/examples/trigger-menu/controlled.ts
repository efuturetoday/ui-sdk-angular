import { Component, signal } from "@angular/core"
import {
  type TriggerDefinition,
  UiField,
  UiFieldControl,
  UiFieldLabel,
  UiTriggerMenu,
  UiTriggerMenuInput,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

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
    <ng-container
      uiTriggerMenu
      [(open)]="open"
      [triggers]="triggers"
      shortcut="ctrl+j"
      (beforeOpenChange)="
        log(
          ($event.open ? 'Opening' : 'Closing') +
            ' (' +
            $event.details.reason +
            ')'
        )
      "
      (openChangeComplete)="log($event ? 'Open' : 'Closed')"
      (queryChange)="onQuery($event.query, $event.details)"
    >
      <div uiField>
        <label uiFieldLabel>Message</label>
        <input uiFieldControl uiTriggerMenuInput placeholder="Type @ or /…" />
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
  protected readonly commands = [
    {
      value: "status",
      label: "status",
      arguments: [
        {
          name: "status",
          hint: "<status>",
          required: true,
          items: ["available", "busy", "away"],
        },
      ],
    },
  ]
  protected readonly triggers: TriggerDefinition[] = [
    { char: "@", items: this.people },
    { char: "/", boundary: "start", items: this.commands },
  ]
  protected readonly log = injectLog()
  protected readonly open = signal<boolean | undefined>(false)

  protected onQuery(query: string, details: { argument?: string }) {
    this.log(
      `Query “${query}”${details.argument ? ` for ${details.argument}` : ""}`
    )
  }
}

export { Example }
