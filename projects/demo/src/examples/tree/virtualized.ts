import { Component, computed, signal } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import { type ListHighlightDetails } from "@ngx-ui-sdk/core/select"
import {
  type TreeItemData,
  UiTree,
  UiTreeItem,
  UiTreeItemIndicator,
  UiTreeItemLabel,
  visibleTreeRows,
} from "@ngx-ui-sdk/core/tree"

const items: TreeItemData[] = Array.from({ length: 100 }, (_, folder) => ({
  value: `folder-${folder + 1}`,
  label: `Folder ${folder + 1}`,
  children: Array.from({ length: 100 }, (_, file) => ({
    value: `folder-${folder + 1}/file-${file + 1}`,
    label: `File ${file + 1}.txt`,
  })),
}))

const row = 32
const height = 288

@Component({
  selector: "app-example",
  imports: [
    LucideChevronRight,
    UiTree,
    UiTreeItem,
    UiTreeItemIndicator,
    UiTreeItemLabel,
  ],
  template: `
    <div
      data-slot="scroll"
      #scroller
      (scroll)="scrollTop.set(scroller.scrollTop)"
    >
      <div
        uiTree
        aria-label="Archive"
        [items]="items"
        [expanded]="expanded()"
        (expandedChange)="expanded.set($event)"
        (highlight)="onHighlight($event.details, scroller)"
        [style.height.px]="rows().length * row"
      >
        @for (entry of visible(); track entry.item.value) {
          <div
            uiTreeItem
            [value]="entry.item.value"
            [style.top.px]="entry.index * row"
          >
            <span uiTreeItemLabel>
              @if (entry.item.children) {
                <span uiTreeItemIndicator>
                  <svg lucideChevronRight aria-hidden="true"></svg>
                </span>
              }
              {{ entry.item.label }}
            </span>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly items = items
  protected readonly row = row
  protected readonly scrollTop = signal(0)
  protected readonly expanded = signal(["folder-1"])
  protected readonly rows = computed(() =>
    visibleTreeRows(items, this.expanded())
  )
  protected readonly visible = computed(() => {
    const start = Math.max(0, Math.floor(this.scrollTop() / row) - 4)
    const end = Math.min(
      this.rows().length,
      Math.ceil((this.scrollTop() + height) / row) + 4
    )
    return this.rows().slice(start, end)
  })

  protected onHighlight({ index }: ListHighlightDetails, el: HTMLElement) {
    const top = index * row
    if (top < el.scrollTop) {
      el.scrollTop = top
    } else if (top + row > el.scrollTop + el.clientHeight - 10) {
      el.scrollTop = top + row - el.clientHeight + 10
    }
    this.scrollTop.set(el.scrollTop)
  }
}

export { Example }
