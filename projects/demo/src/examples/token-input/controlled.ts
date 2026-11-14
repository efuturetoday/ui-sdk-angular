import { Component, signal } from "@angular/core"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import {
  toText,
  type Token,
  type TokenInputValue,
  type TokenInputValueChangeDetails,
  UiTokenInput,
  UiTokenInputEditor,
} from "ngx-ui-sdk/token-input"
import {
  type TriggerDefinition,
  type TriggerMenuDataItem,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuItem,
  UiTriggerMenuList,
} from "ngx-ui-sdk/trigger-menu"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldLabel,
    UiTokenInput,
    UiTokenInputEditor,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuItem,
    UiTriggerMenuList,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Prompt</label>
      <ng-container
        uiTokenInput
        [(value)]="value"
        [history]="{ limit: 50, groupDelay: 1000 }"
        [getTokenDescription]="describe"
        (beforeValueChange)="onValueChange($event.value, $event.details)"
      >
        <div uiTokenInputEditor></div>
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
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly files = [
    { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
    { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
    { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
    { value: "README.md", label: "README.md" },
    { value: "package.json", label: "package.json" },
  ]
  protected readonly triggers: TriggerDefinition[] = [
    { char: "@", type: "file", items: this.files },
  ]
  protected readonly draft: TokenInputValue = [
    "Explain ",
    { type: "file", value: "src/routes.ts", label: "routes.ts" },
    " in two sentences.",
  ]
  protected readonly log = injectLog()
  protected readonly value = signal<TokenInputValue | undefined>(this.draft)
  protected readonly describe = (token: Token) =>
    token.type === "file" ? "attached file" : token.type

  protected onValueChange(
    next: TokenInputValue,
    details: TokenInputValueChangeDetails
  ) {
    const removed = details.removed.map((token) => token.label).join(", ")
    this.log(
      `${toText(next)} (${details.reason}${removed ? `, removed ${removed}` : ""})`
    )
  }

  protected itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
