import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { UiField, UiFieldControl, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  type TriggerDefinition,
  type TriggerMenuSelectDetails,
  UiTriggerMenu,
  UiTriggerMenuHint,
  UiTriggerMenuInput,
} from "@ngx-ui-sdk/core/trigger-menu"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiField,
    UiFieldControl,
    UiFieldLabel,
    UiTriggerMenu,
    UiTriggerMenuHint,
    UiTriggerMenuInput,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <ng-container uiTriggerMenu [triggers]="triggers" [onSelect]="onSelect">
        <div uiField name="message">
          <label uiFieldLabel>Message</label>
          <input
            uiFieldControl
            uiTriggerMenuInput
            placeholder="Type / for commands…"
          />
        </div>
        <span uiTriggerMenuHint uiText></span>
      </ng-container>
    </form>
  `,
})
class Example {
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
        {
          name: "until",
          hint: "[until]",
          items: ["30m", "1h", "4h", "today"],
          allowCustomValue: false,
        },
      ],
    },
    {
      value: "search",
      label: "search",
      arguments: [{ name: "query", hint: "<query>", required: true }],
    },
    { value: "away", label: "away", after: "submit" as const },
    { value: "clear", label: "clear" },
  ]
  protected readonly triggers: TriggerDefinition[] = [
    { char: "/", boundary: "start", type: "command", items: this.commands },
  ]
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.log(
      `Sent ${new FormData(event.currentTarget as HTMLFormElement).get("message")}`
    )
  }

  protected readonly onSelect = (
    value: string,
    details: TriggerMenuSelectDetails<string>
  ) =>
    this.log(
      ["Chose", `/${value}`, ...Object.values(details.arguments)].join(" ")
    )
}

export { Example }
