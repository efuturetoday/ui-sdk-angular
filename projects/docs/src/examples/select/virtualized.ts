import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import { UiVirtualFor } from "@ngx-ui-sdk/core"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectList,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"

type Item = { value: string; label: string }

@Component({
  selector: "app-example",
  imports: [
    LucideChevronDown,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectList,
    UiSelectTrigger,
    UiSelectValue,
    UiVirtualFor,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Item</label>
      <ng-container uiSelect [items]="items" placeholder="Select an item">
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          <div uiSelectList>
            <div
              *uiVirtualFor="let item of items; rowHeight: 32"
              uiSelectItem
              [value]="item.value"
              [label]="item.label"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly items: Item[] = Array.from({ length: 10_000 }, (_, i) => ({
    value: `item-${i + 1}`,
    label: `Item ${i + 1}`,
  }))
}

export { Example }
