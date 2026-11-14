import { NgTemplateOutlet } from "@angular/common"
import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  type TreeItemData,
  UiTree,
  UiTreeGroup,
  UiTreeItem,
  UiTreeItemIndicator,
  UiTreeItemLabel,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

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
    <div
      uiTree
      aria-label="Folders"
      [items]="items"
      mode="multiple"
      [defaultValue]="['updates', 'website']"
      [expandOnPress]="false"
      [defaultExpanded]="['inbox', 'projects']"
      (valueChange)="onValue($event)"
    >
      <ng-template #level let-list>
        @for (item of asItems(list); track item.value) {
          <div uiTreeItem [value]="item.value">
            <span uiTreeItemLabel>
              @if (item.children) {
                <span uiTreeItemIndicator
                  ><svg lucideChevronRight aria-hidden="true"></svg
                ></span>
              }
              {{ item.label }}
            </span>
            @if (item.children) {
              <div *uiTreeGroup>
                <ng-container
                  [ngTemplateOutlet]="level"
                  [ngTemplateOutletContext]="{ $implicit: item.children }"
                />
              </div>
            }
          </div>
        }
      </ng-template>
      <ng-container
        [ngTemplateOutlet]="level"
        [ngTemplateOutletContext]="{ $implicit: items }"
      />
    </div>
  `,
})
class Example {
  protected readonly items: TreeItemData[] = [
    {
      value: "inbox",
      label: "Inbox",
      children: [
        { value: "updates", label: "Updates" },
        { value: "forums", label: "Forums" },
        { value: "promotions", label: "Promotions" },
      ],
    },
    {
      value: "projects",
      label: "Projects",
      children: [
        { value: "website", label: "Website" },
        { value: "mobile", label: "Mobile app" },
      ],
    },
    { value: "archive", label: "Archive" },
    { value: "trash", label: "Trash" },
  ]
  protected readonly log = injectLog()

  protected onValue(value: unknown) {
    if (Array.isArray(value)) {
      this.log(`${value.length} selected: ${value.join(", ")}`)
    }
  }

  protected asItems(list: unknown) {
    return list as TreeItemData[]
  }
}

export { Example }
