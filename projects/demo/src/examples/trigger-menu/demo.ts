import { Component } from "@angular/core"
import { UiField, UiFieldControl, UiFieldLabel } from "ngx-ui-sdk/field"
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
} from "ngx-ui-sdk/trigger-menu"

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
          placeholder="Type @ to mention someone…"
        />
      </div>
      <div data-slot="visually-hidden">
        <div uiTriggerMenuStatus></div>
      </div>
      <div *uiTriggerMenuContent="let state">
        <div uiTriggerMenuEmpty>No one found</div>
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
  protected readonly people = [
    { value: "hollis", label: "Hollis Grant" },
    { value: "ines", label: "Inès Moreau" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "wren", label: "Wren Takahashi" },
    { value: "tomasz", label: "Tomasz Wójcik" },
  ]
  protected readonly triggers: TriggerDefinition[] = [
    { char: "@", type: "mention", items: this.people },
  ]

  protected itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
