import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideFile } from "@lucide/angular"
import {
  type TokenDeletion,
  type TokenInputValue,
  type TokenInputValueChangeDetails,
  type TriggerDefinition,
  type TriggerMenuDataItem,
  UiField,
  UiFieldLabel,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
  UiTokenInput,
  UiTokenInputEditor,
  UiTokenInputToken,
  UiTokenInputTokens,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuItem,
  UiTriggerMenuList,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    LucideFile,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectLabel,
    UiSelectTrigger,
    UiSelectValue,
    UiTokenInput,
    UiTokenInputEditor,
    UiTokenInputToken,
    UiTokenInputTokens,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuItem,
    UiTriggerMenuList,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <ng-container
          uiSelect
          [items]="modes"
          [value]="deletion()"
          (valueChange)="setDeletion($event)"
        >
          <div uiSelectLabel>Backspace</div>
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent>
            @for (mode of modes; track mode.value) {
              <div uiSelectItem [value]="mode.value">
                {{ mode.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <div uiField>
        <label uiFieldLabel>Prompt</label>
        <ng-container
          uiTokenInput
          [tokenDeletion]="deletion()"
          [defaultValue]="draft"
          (beforeValueChange)="onValueChange($event.details)"
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
          <ng-template uiTokenInputTokens let-token>
            <span uiTokenInputToken>
              <svg lucideFile aria-hidden="true"></svg>
              {{ token.label }}
            </span>
          </ng-template>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {
  protected readonly modes = [
    { value: "whole", label: "Whole" },
    { value: "select", label: "Select" },
    { value: "revert", label: "Revert" },
  ]

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
    {
      type: "file",
      value: "src/routes.ts",
      label: "routes.ts",
      data: { trigger: "@" },
    },
    " in two sentences.",
  ]
  protected readonly log = injectLog()
  protected readonly deletion = signal<TokenDeletion>("whole")

  protected setDeletion(next: unknown) {
    if (next) {
      this.deletion.set(next as TokenDeletion)
    }
  }

  protected onValueChange(details: TokenInputValueChangeDetails) {
    for (const token of details.removed) {
      this.log(`Removed ${token.label} (${this.deletion()})`)
    }
  }

  protected itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
