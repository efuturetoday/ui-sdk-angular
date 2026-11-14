import { NgTemplateOutlet } from "@angular/common"
import { Component, signal } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  type TreeActionDetails,
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
    <div
      uiTree
      aria-label="Docs"
      [items]="pages"
      mode="none"
      [current]="current()"
      [onAction]="onAction"
    >
      <ng-template #level let-list>
        @for (item of asItems(list); track item.value) {
          <div uiTreeItem [value]="item.value">
            @if (item.href) {
              <a uiTreeItemLabel [href]="item.href">
                @if (item.children) {
                  <span uiTreeItemIndicator>
                    <svg lucideChevronRight aria-hidden="true"></svg>
                  </span>
                }
                {{ item.label }}
              </a>
            } @else {
              <span uiTreeItemLabel>
                @if (item.children) {
                  <span uiTreeItemIndicator>
                    <svg lucideChevronRight aria-hidden="true"></svg>
                  </span>
                }
                {{ item.label }}
              </span>
            }
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
        [ngTemplateOutletContext]="{ $implicit: pages }"
      />
    </div>
  `,
})
class Example {
  protected readonly pages: TreeItemData[] = [
    {
      value: "getting-started",
      label: "Getting started",
      children: [
        { value: "introduction", label: "Introduction", href: "#introduction" },
        { value: "installation", label: "Installation", href: "#installation" },
      ],
    },
    {
      value: "components",
      label: "Components",
      children: [
        { value: "accordion", label: "Accordion", href: "#accordion" },
        { value: "dialog", label: "Dialog", href: "#dialog" },
        { value: "tree", label: "Tree", href: "#tree" },
      ],
    },
    { value: "changelog", label: "Changelog", href: "#changelog" },
  ]
  readonly #links = new Set(
    this.pages
      .flatMap((page) => [page, ...(page.children ?? [])])
      .filter((page) => page.href)
      .map((page) => page.value)
  )
  protected readonly current = signal("tree")

  protected readonly onAction = (
    value: string,
    { event }: TreeActionDetails
  ) => {
    if (!this.#links.has(value)) {
      return
    }
    event?.preventDefault()
    this.current.set(value)
  }

  protected asItems(list: unknown) {
    return list as TreeItemData[]
  }
}

export { Example }
