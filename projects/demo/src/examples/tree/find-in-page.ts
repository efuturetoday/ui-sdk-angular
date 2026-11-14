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
    <div uiTree aria-label="Solar system" [items]="items" hiddenUntilFound>
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
      value: "planets",
      label: "Planets",
      children: [
        { value: "mercury", label: "Mercury" },
        { value: "venus", label: "Venus" },
        {
          value: "earth",
          label: "Earth",
          children: [{ value: "moon", label: "The Moon" }],
        },
        {
          value: "mars",
          label: "Mars",
          children: [
            { value: "phobos", label: "Phobos" },
            { value: "deimos", label: "Deimos" },
          ],
        },
      ],
    },
    {
      value: "dwarf-planets",
      label: "Dwarf planets",
      children: [
        { value: "ceres", label: "Ceres" },
        {
          value: "pluto",
          label: "Pluto",
          children: [{ value: "charon", label: "Charon" }],
        },
      ],
    },
  ]

  protected asItems(list: unknown) {
    return list as TreeItemData[]
  }
}

export { Example }
