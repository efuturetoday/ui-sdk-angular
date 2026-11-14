import { NgTemplateOutlet } from "@angular/common"
import { Component, signal } from "@angular/core"
import {
  LucideChevronRight,
  LucideLoaderCircle,
  LucideRotateCw,
} from "@lucide/angular"
import {
  type TreeAnnouncement,
  type TreeItemData,
  UiTree,
  UiTreeGroup,
  UiTreeItem,
  UiTreeItemIndicator,
  UiTreeItemLabel,
} from "ngx-ui-sdk"

type Node = { value: string; label: string; branch?: boolean }

let archiveAsked = false
async function fetchChildren(value: string, signal: AbortSignal) {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 800)
    signal.addEventListener(
      "abort",
      () => (clearTimeout(timer), reject(signal.reason))
    )
  })
  if (value === "archive" && !archiveAsked) {
    archiveAsked = true
    throw new Error("Network error")
  }
  return Array.from({ length: 3 }, (_, index) => ({
    value: `${value}/${index + 1}`,
    label: `${value.slice(0, -1)}_${index + 1}.json`,
  }))
}

@Component({
  selector: "app-example",
  imports: [
    NgTemplateOutlet,
    LucideChevronRight,
    LucideLoaderCircle,
    LucideRotateCw,
    UiTree,
    UiTreeGroup,
    UiTreeItem,
    UiTreeItemIndicator,
    UiTreeItemLabel,
  ],
  template: `
    <div
      uiTree
      aria-label="Database"
      [loadChildren]="loadChildren"
      [announcement]="announcement"
    >
      <ng-template #level let-list>
        @for (item of asNodes(list); track item.value) {
          <div uiTreeItem [value]="item.value" [branch]="item.branch">
            <span uiTreeItemLabel>
              @if (item.branch) {
                <span uiTreeItemIndicator #indicator="uiTreeItemIndicator">
                  @if (indicator.state().loading) {
                    <svg lucideLoaderCircle aria-hidden="true"></svg>
                  } @else if (indicator.state().failed) {
                    <svg lucideRotateCw aria-hidden="true"></svg>
                  } @else {
                    <svg lucideChevronRight aria-hidden="true"></svg>
                  }
                </span>
              }
              {{ item.label }}
            </span>
            @if (loaded()[item.value]) {
              <div *uiTreeGroup>
                <ng-container
                  [ngTemplateOutlet]="level"
                  [ngTemplateOutletContext]="{
                    $implicit: loaded()[item.value],
                  }"
                />
              </div>
            }
          </div>
        }
      </ng-template>
      <ng-container
        [ngTemplateOutlet]="level"
        [ngTemplateOutletContext]="{ $implicit: top }"
      />
    </div>
  `,
})
class Example {
  protected readonly top: Node[] = [
    { value: "users", label: "users", branch: true },
    { value: "orders", label: "orders", branch: true },
    { value: "archive", label: "archive", branch: true },
  ]
  protected readonly loaded = signal<Record<string, Node[]>>({})

  protected asNodes(list: unknown) {
    return list as Node[]
  }

  protected readonly loadChildren = async (
    value: string,
    { signal }: { signal: AbortSignal }
  ) => {
    const children = await fetchChildren(value, signal)
    this.loaded.update((loaded) => ({ ...loaded, [value]: children }))
  }

  protected readonly announcement = ({ type, label }: TreeAnnouncement) =>
    ({
      expanded: "Expanded",
      collapsed: "Collapsed",
      loading: `Loading ${label}`,
      "load-failed": `${label} didn't load. Try again.`,
    })[type]
}

export { Example }
