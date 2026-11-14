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
} from "ngx-ui-sdk"

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
    <div dir="rtl">
      <div uiTree aria-label="الملفات" [defaultExpanded]="['documents']">
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
          [ngTemplateOutletContext]="{ $implicit: folders }"
        />
      </div>
    </div>
  `,
})
class Example {
  protected readonly folders: TreeItemData[] = [
    {
      value: "documents",
      label: "المستندات",
      children: [
        { value: "reports", label: "التقارير" },
        { value: "invoices", label: "الفواتير" },
      ],
    },
    {
      value: "photos",
      label: "الصور",
      children: [
        { value: "trips", label: "الرحلات" },
        { value: "family", label: "العائلة" },
      ],
    },
    { value: "downloads", label: "التنزيلات" },
  ]

  protected asItems(list: unknown) {
    return list as TreeItemData[]
  }
}

export { Example }
