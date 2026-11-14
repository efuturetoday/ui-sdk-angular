import { NgTemplateOutlet } from "@angular/common"
import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  type TreeItemData,
  UiTree,
  UiTreeGroup,
  UiTreeItem,
  UiTreeItemCheckbox,
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
    UiTreeItemCheckbox,
    UiTreeItemIndicator,
    UiTreeItemLabel,
  ],
  template: `
    <div
      uiTree
      aria-label="Stack"
      [items]="items"
      checkable
      mode="none"
      checkStrategy="trunk"
      [defaultChecked]="['react', 'postgres']"
      [defaultExpanded]="['frontend', 'backend', 'databases']"
      (checkedChange)="log('Checked ' + ($event.join(', ') || 'nothing'))"
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
              <span uiTreeItemCheckbox></span>
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
      value: "frontend",
      label: "Frontend",
      children: [
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
        { value: "svelte", label: "Svelte" },
      ],
    },
    {
      value: "backend",
      label: "Backend",
      children: [
        { value: "node", label: "Node" },
        {
          value: "databases",
          label: "Databases",
          children: [
            { value: "postgres", label: "Postgres" },
            { value: "sqlite", label: "SQLite" },
          ],
        },
      ],
    },
  ]
  protected readonly log = injectLog()

  protected asItems(list: unknown) {
    return list as TreeItemData[]
  }
}

export { Example }
