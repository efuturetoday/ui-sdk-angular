import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import { UiVirtualFor } from "@ngx-ui-sdk/core"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxTrigger,
} from "@ngx-ui-sdk/core/combobox"

type Item = { value: string; label: string }

@Component({
  selector: "app-example",
  imports: [
    LucideChevronDown,
    UiCombobox,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxTrigger,
    UiVirtualFor,
  ],
  template: `
    <ng-container uiCombobox [items]="items">
      <div data-slot="stack">
        <div uiComboboxLabel>Item</div>
        <div data-slot="row">
          <input uiComboboxInput placeholder="Search 10,000 items…" />
          <button uiComboboxTrigger aria-label="Show items">
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent="let state">
        <div uiComboboxEmpty>No items found.</div>
        <div uiComboboxList>
          <div
            *uiVirtualFor="let item of matches(state().items); rowHeight: 32"
            uiComboboxItem
            [value]="item.value"
            [label]="item.label"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly items: Item[] = Array.from({ length: 10_000 }, (_, i) => ({
    value: `item-${i + 1}`,
    label: `Item ${i + 1}`,
  }))

  protected matches(items: unknown) {
    return (items ?? []) as Item[]
  }
}

export { Example }
