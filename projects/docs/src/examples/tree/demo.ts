import { NgTemplateOutlet } from "@angular/common"
import { Component } from "@angular/core"
import {
  LucideChevronRight,
  LucideFile,
  LucideFolder,
  LucideFolderOpen,
} from "@lucide/angular"
import {
  type TreeItemData,
  UiTree,
  UiTreeGroup,
  UiTreeItem,
  UiTreeItemIndicator,
  UiTreeItemLabel,
} from "@ngx-ui-sdk/core/tree"

type Node = { value: string; label: string; children?: Node[] }

@Component({
  selector: "app-example",
  imports: [
    NgTemplateOutlet,
    LucideChevronRight,
    LucideFile,
    LucideFolder,
    LucideFolderOpen,
    UiTree,
    UiTreeGroup,
    UiTreeItem,
    UiTreeItemIndicator,
    UiTreeItemLabel,
  ],
  template: `
    <div
      uiTree
      aria-label="Files"
      [defaultExpanded]="['app']"
      defaultValue="app/page.tsx"
    >
      <ng-template #level let-list>
        @for (node of asNodes(list); track node.value) {
          <div uiTreeItem [value]="node.value">
            <span uiTreeItemLabel>
              @if (node.children) {
                <span uiTreeItemIndicator>
                  <svg lucideChevronRight aria-hidden="true"></svg>
                </span>
                <svg lucideFolder aria-hidden="true"></svg>
                <svg lucideFolderOpen aria-hidden="true"></svg>
              } @else {
                <svg lucideFile aria-hidden="true"></svg>
              }
              <span>{{ node.label }}</span>
            </span>
            @if (node.children) {
              <div *uiTreeGroup>
                <ng-container
                  [ngTemplateOutlet]="level"
                  [ngTemplateOutletContext]="{ $implicit: node.children }"
                />
              </div>
            }
          </div>
        }
      </ng-template>
      <ng-container
        [ngTemplateOutlet]="level"
        [ngTemplateOutletContext]="{ $implicit: files }"
      />
    </div>
  `,
})
class Example {
  protected readonly files: Node[] = [
    {
      value: "app",
      label: "app",
      children: [
        { value: "app/layout.tsx", label: "layout.tsx" },
        { value: "app/page.tsx", label: "page.tsx" },
        {
          value: "app/settings",
          label: "settings",
          children: [{ value: "app/settings/page.tsx", label: "page.tsx" }],
        },
      ],
    },
    {
      value: "components",
      label: "components",
      children: [
        { value: "components/button.tsx", label: "button.tsx" },
        { value: "components/card.tsx", label: "card.tsx" },
      ],
    },
    { value: "components.json", label: "components.json" },
    { value: "package.json", label: "package.json" },
    { value: "README.md", label: "README.md" },
  ]

  protected asNodes(list: unknown) {
    return list as Node[]
  }
}

export { Example }
