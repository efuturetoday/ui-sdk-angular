import { NgTemplateOutlet } from "@angular/common"
import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  createTreeController,
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
    UiTree,
    UiTreeGroup,
    UiTreeItem,
    UiTreeItemIndicator,
    UiTreeItemLabel,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="settings.expandAll()">Expand All</button>
        <button type="button" (click)="settings.collapseAll()">
          Collapse All
        </button>
        <button type="button" (click)="findTwoFactor()">Find Two-Factor</button>
      </div>
      <div
        uiTree
        aria-label="Settings"
        [items]="sections"
        [controller]="settings">
        <ng-template #level let-list>
          @for (item of asItems(list); track item.value) {
            <div uiTreeItem [value]="item.value">
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
          [ngTemplateOutletContext]="{ $implicit: sections }" />
      </div>
    </div>
  `,
})
class Example {
  protected readonly sections: TreeItemData[] = [
    {
      value: "account",
      label: "Account",
      children: [
        { value: "profile", label: "Profile" },
        {
          value: "security",
          label: "Security",
          children: [
            { value: "password", label: "Password" },
            { value: "two-factor", label: "Two-factor authentication" },
          ],
        },
      ],
    },
    {
      value: "workspace",
      label: "Workspace",
      children: [
        { value: "members", label: "Members" },
        { value: "billing", label: "Billing" },
      ],
    },
  ]
  protected readonly settings = createTreeController()

  protected findTwoFactor() {
    this.settings.setValue("two-factor")
    this.settings.reveal("two-factor")
  }

  protected asItems(list: unknown) {
    return list as TreeItemData[]
  }
}

export { Example }
