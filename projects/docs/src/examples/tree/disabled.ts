import { NgTemplateOutlet } from "@angular/common"
import { Component, signal } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import { UiSwitch, UiSwitchThumb } from "@ngx-ui-sdk/core/switch"
import {
  type TreeItemData,
  UiTree,
  UiTreeGroup,
  UiTreeItem,
  UiTreeItemIndicator,
  UiTreeItemLabel,
} from "@ngx-ui-sdk/core/tree"

@Component({
  selector: "app-example",
  imports: [
    NgTemplateOutlet,
    LucideChevronRight,
    UiSwitch,
    UiSwitchThumb,
    UiTree,
    UiTreeGroup,
    UiTreeItem,
    UiTreeItemIndicator,
    UiTreeItemLabel,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <label data-slot="label">
          <button uiSwitch [(checked)]="focusable">
            <span uiSwitchThumb></span>
          </button>
          Focusable when disabled
        </label>
      </div>
      <div
        uiTree
        aria-label="Plans"
        [items]="items"
        [defaultExpanded]="['plans']"
        [focusableWhenDisabled]="focusable()">
        <ng-template #level let-list>
          @for (item of asItems(list); track item.value) {
            <div uiTreeItem [value]="item.value" [disabled]="item.disabled">
              <span uiTreeItemLabel>
                @if (item.children) {
                  <span uiTreeItemIndicator>
                    <svg lucideChevronRight aria-hidden="true"></svg>
                  </span>
                }
                {{ item.label }}
              </span>
              @if (item.children) {
                <div *uiTreeGroup>
                  <ng-container
                    [ngTemplateOutlet]="level"
                    [ngTemplateOutletContext]="{ $implicit: item.children }" />
                </div>
              }
            </div>
          }
        </ng-template>
        <ng-container
          [ngTemplateOutlet]="level"
          [ngTemplateOutletContext]="{ $implicit: items }" />
      </div>
    </div>
  `,
})
class Example {
  protected readonly items: TreeItemData[] = [
    {
      value: "plans",
      label: "Plans",
      children: [
        { value: "free", label: "Free" },
        { value: "pro", label: "Pro" },
        { value: "enterprise", label: "Enterprise", disabled: true },
      ],
    },
    {
      value: "legacy",
      label: "Legacy plans",
      disabled: true,
      children: [{ value: "starter", label: "Starter" }],
    },
    { value: "custom", label: "Custom" },
  ]
  protected readonly focusable = signal(true)

  protected asItems(list: unknown) {
    return list as TreeItemData[]
  }
}

export { Example }
