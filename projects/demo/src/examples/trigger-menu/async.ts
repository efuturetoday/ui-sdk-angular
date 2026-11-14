import { Component } from "@angular/core"
import { UiField, UiFieldControl, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  type TriggerDefinition,
  type TriggerMenuDataItem,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuEmpty,
  UiTriggerMenuInput,
  UiTriggerMenuItem,
  UiTriggerMenuList,
  UiTriggerMenuStatus,
} from "@ngx-ui-sdk/core/trigger-menu"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldControl,
    UiFieldLabel,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuEmpty,
    UiTriggerMenuInput,
    UiTriggerMenuItem,
    UiTriggerMenuList,
    UiTriggerMenuStatus,
  ],
  template: `
    <ng-container uiTriggerMenu [triggers]="triggers">
      <div uiField>
        <label uiFieldLabel>Message</label>
        <input
          uiFieldControl
          uiTriggerMenuInput
          placeholder="Type # to link a channel…"
        />
      </div>
      <div *uiTriggerMenuContent="let state">
        <div uiTriggerMenuStatus #status="uiTriggerMenuStatus">
          {{
            status.state().loading
              ? "Loading channels…"
              : status.state().count
                ? status.state().count +
                  " " +
                  (status.state().count === 1 ? "channel" : "channels")
                : ""
          }}
        </div>
        <div uiTriggerMenuEmpty #empty="uiTriggerMenuEmpty">
          @if (empty.state().empty && !empty.state().loading) {
            No channels match “{{ empty.state().query }}”
          }
        </div>
        <div uiTriggerMenuList #list="uiTriggerMenuList">
          @for (item of itemsOf(list.state().items); track item.value) {
            <div uiTriggerMenuItem [value]="item.value" [label]="item.label">
              {{ item.label }}
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly channels = [
    "announcements",
    "design",
    "design-reviews",
    "engineering",
    "general",
    "launches",
    "support",
  ]
  protected readonly triggers: TriggerDefinition[] = [
    {
      char: "#",
      type: "channel",
      items: (query, options) => this.searchChannels(query, options),
    },
  ]

  protected searchChannels(query: string, { signal }: { signal: AbortSignal }) {
    return new Promise<{ value: string; label: string }[]>(
      (resolve, reject) => {
        const timer = setTimeout(
          () =>
            resolve(
              this.channels
                .filter((channel) => channel.includes(query.toLowerCase()))
                .map((channel) => ({ value: channel, label: channel }))
            ),
          600
        )
        signal.addEventListener("abort", () => {
          clearTimeout(timer)
          reject(signal.reason)
        })
      }
    )
  }

  protected itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
