import { NgTemplateOutlet } from "@angular/common"
import { Component, signal } from "@angular/core"
import { treeOptions } from "tests/fixtures/page"
import {
  describeTree,
  treeFixture,
  type TreeFixtureItem,
} from "tests/fixtures/tree"
import {
  createTreeController,
  UiTree,
  UiTreeGroup,
  UiTreeItem,
  UiTreeItemCheckbox,
  UiTreeItemIndicator,
  UiTreeItemLabel,
  type TreeExpandedChangeDetails,
} from "ui-sdk-angular"

@Component({
  selector: "app-fixture",
  imports: [
    NgTemplateOutlet,
    UiTree,
    UiTreeGroup,
    UiTreeItem,
    UiTreeItemCheckbox,
    UiTreeItemIndicator,
    UiTreeItemLabel,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiTree
        class="tree"
        [attr.aria-label]="treeFixture.label"
        [items]="treeFixture.items"
        [mode]="o.mode"
        [defaultValue]="o.defaultValue"
        [defaultExpanded]="o.defaultExpanded"
        [checkable]="o.checkable"
        [checkStrategy]="o.checkStrategy"
        [current]="o.current"
        [activation]="o.activation"
        [disabled]="o.disabled"
        [keepMounted]="o.keepMounted"
        [hiddenUntilFound]="o.hiddenUntilFound"
        [controller]="controller"
        [onAction]="onAction"
        (valueChange)="action.set(describeTree('selected', $event))"
        (beforeExpandedChange)="onExpandedChange($event.expanded, $event.details)"
        (checkedChange)="action.set(describeTree('checked', $event))"
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
              @if (o.checkable) {
                <span uiTreeItemCheckbox class="tree-checkbox"></span>
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
          [ngTemplateOutletContext]="{ $implicit: treeFixture.items }"
        />
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.expandAll()">Expand all</button>
      <button (click)="controller.collapseAll()">Collapse all</button>
      <button (click)="controller.reveal('dialog.tsx')">Reveal dialog</button>
    </div>
  `,
})
class Fixture {
  protected readonly treeFixture = treeFixture
  protected readonly describeTree = describeTree
  protected readonly o = treeOptions()
  protected readonly controller = createTreeController()
  protected readonly action = signal("")
  protected readonly onAction = (value: string) =>
    this.action.set(describeTree("action", value))

  protected asItems(list: unknown) {
    return list as TreeFixtureItem[]
  }

  protected onExpandedChange(
    expanded: string[],
    details: TreeExpandedChangeDetails
  ) {
    const { cancel } = this.o
    if (
      cancel &&
      expanded.includes(cancel) &&
      !this.controller.isExpanded(cancel)
    ) {
      return details.cancel()
    }
    this.action.set(describeTree("expanded", expanded))
  }
}

export { Fixture }
