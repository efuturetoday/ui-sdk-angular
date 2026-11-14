import { NgTemplateOutlet } from "@angular/common"
import { Component } from "@angular/core"
import { LucideChevronRight, LucideLoaderCircle } from "@lucide/angular"
import {
  treeFromPaths,
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
    LucideLoaderCircle,
    UiTree,
    UiTreeGroup,
    UiTreeItem,
    UiTreeItemIndicator,
    UiTreeItemLabel,
  ],
  template: `
    <div
      uiTree
      aria-label="Project"
      [paths]="paths"
      [defaultExpanded]="['src']"
      defaultValue="src/index.ts"
      activation="automatic"
      [onAction]="open"
    >
      <ng-template #level let-list>
        @for (item of asItems(list); track item.value) {
          <div uiTreeItem [value]="item.value">
            <span uiTreeItemLabel #label="uiTreeItemLabel">
              @if (item.children) {
                <span uiTreeItemIndicator>
                  <svg lucideChevronRight aria-hidden="true"></svg>
                </span>
              }
              <span>{{ item.label }}</span>
              @if (label.state().pending) {
                <svg lucideLoaderCircle aria-hidden="true"></svg>
              }
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
  protected readonly paths = [
    "src/index.ts",
    "src/lib/format.ts",
    "src/lib/parse.ts",
    "src/routes/home.tsx",
    "src/routes/about.tsx",
    "tests/",
    "package.json",
    "tsconfig.json",
  ]
  protected readonly items = treeFromPaths(this.paths)
  readonly #files = new Set(this.paths.filter((path) => !path.endsWith("/")))
  protected readonly log = injectLog()

  protected readonly open = async (value: string) => {
    if (!this.#files.has(value)) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 600))
    this.log(`Opened ${value}`)
  }

  protected asItems(list: unknown) {
    return list as TreeItemData[]
  }
}

export { Example }
