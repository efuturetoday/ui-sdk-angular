import { Component } from "@angular/core"
import {
  type TriggerDefinition,
  type TriggerMenuDataItem,
  UiField,
  UiFieldControl,
  UiFieldLabel,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuInput,
  UiTriggerMenuItem,
  UiTriggerMenuList,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldControl,
    UiFieldLabel,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuInput,
    UiTriggerMenuItem,
    UiTriggerMenuList,
  ],
  template: `
    <ng-container
      uiTriggerMenu
      [triggers]="triggers"
      [autoHighlight]="false"
      [loop]="false"
    >
      <div uiField>
        <label uiFieldLabel>Task</label>
        <input
          uiFieldControl
          uiTriggerMenuInput
          placeholder="Type @ to assign someone…"
        />
      </div>
      <div *uiTriggerMenuContent="let state">
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
    { char: "@", items: this.people },
  ]

  protected itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
