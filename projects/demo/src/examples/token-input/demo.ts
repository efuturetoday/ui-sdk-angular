import { Component } from "@angular/core"
import { LucideX } from "@lucide/angular"
import {
  type TriggerDefinition,
  type TriggerMenuDataItem,
  UiField,
  UiFieldLabel,
  UiTokenInput,
  UiTokenInputEditor,
  UiTokenInputToken,
  UiTokenInputTokenRemove,
  UiTokenInputTokens,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuItem,
  UiTriggerMenuList,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    LucideX,
    UiField,
    UiFieldLabel,
    UiTokenInput,
    UiTokenInputEditor,
    UiTokenInputToken,
    UiTokenInputTokenRemove,
    UiTokenInputTokens,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuItem,
    UiTriggerMenuList,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Message</label>
      <ng-container uiTokenInput>
        <div uiTokenInputEditor placeholder="Type @ to mention someone…"></div>
        <ng-container uiTriggerMenu [triggers]="triggers">
          <div *uiTriggerMenuContent="let state">
            <div uiTriggerMenuList #list="uiTriggerMenuList">
              @for (item of itemsOf(list.state().items); track item.value) {
                <div
                  uiTriggerMenuItem
                  [value]="item.value"
                  [label]="item.label"
                >
                  {{ item.label }}
                </div>
              }
            </div>
          </div>
        </ng-container>
        <ng-template uiTokenInputTokens let-token>
          <span uiTokenInputToken>
            {{ token.label }}
            <span uiTokenInputTokenRemove
              ><svg lucideX aria-hidden="true"></svg
            ></span>
          </span>
        </ng-template>
      </ng-container>
    </div>
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
