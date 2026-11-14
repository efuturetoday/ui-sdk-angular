import { NgTemplateOutlet } from "@angular/common"
import { Component, DestroyRef, inject, signal } from "@angular/core"
import { treeLinksFixture, type TreeFixtureItem } from "tests/fixtures/tree"
import {
  UiTree,
  UiTreeGroup,
  UiTreeItem,
  UiTreeItemIndicator,
  UiTreeItemLabel,
} from "ngx-ui-sdk/tree"

// A tree of links, rendered with the tree fixture's classes. The current page
// follows the address.
@Component({
  selector: "app-fixture",
  imports: [
    NgTemplateOutlet,
    UiTree,
    UiTreeGroup,
    UiTreeItem,
      UiTreeItemIndicator,
    UiTreeItemLabel,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiTree
        class="tree"
        [attr.aria-label]="f.label"
        [items]="f.items"
        mode="none"
        [current]="current()"
      >
        <ng-template #items let-list>
          @for (item of asItems(list); track item.value) {
            <div
              uiTreeItem
              class="tree-item"
              [value]="item.value"
              [disabled]="item.disabled"
            >
              @if (item.children) {
                <span uiTreeItemIndicator class="tree-indicator">▸</span>
              }
              @if (item.href) {
                <a uiTreeItemLabel class="tree-label" [href]="item.href">{{
                  item.label
                }}</a>
              } @else {
                <span uiTreeItemLabel class="tree-label">{{ item.label }}</span>
              }
              @if (item.children) {
                <div *uiTreeGroup class="tree-group">
                  <ng-container
                    [ngTemplateOutlet]="items"
                    [ngTemplateOutletContext]="{ $implicit: item.children }"
                  />
                </div>
              }
            </div>
          }
        </ng-template>
        <ng-container
          [ngTemplateOutlet]="items"
          [ngTemplateOutletContext]="{ $implicit: f.items }"
        />
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ current() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = treeLinksFixture
  protected readonly current = signal(location.hash.slice(1) || "usage")

  constructor() {
    const changed = () => this.current.set(location.hash.slice(1))
    window.addEventListener("hashchange", changed)
    inject(DestroyRef).onDestroy(() =>
      window.removeEventListener("hashchange", changed)
    )
  }

  protected asItems(list: unknown) {
    return list as TreeFixtureItem[]
  }
}

export { Fixture }
