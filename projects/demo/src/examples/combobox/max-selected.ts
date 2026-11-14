import { Component } from "@angular/core"
import { LucideCheck, LucideX } from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxChip,
  UiComboboxChipRemove,
  UiComboboxChips,
  UiComboboxContent,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxValue,
} from "ngx-ui-sdk/combobox"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideX,
    UiCombobox,
    UiComboboxChip,
    UiComboboxChipRemove,
    UiComboboxChips,
    UiComboboxContent,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxValue,
  ],
  template: `<ng-container
    uiCombobox
    multiple
    [maxSelected]="3"
    [defaultValue]="['Bug', 'Design']"
    ><div data-slot="stack">
      <div uiComboboxLabel>Labels (up to 3)</div>
      <div uiComboboxChips>
        <ng-container uiComboboxValue #value="uiComboboxValue">
          @for (item of valuesOf(value.state().value); track item) {
            <div uiComboboxChip [value]="item">
              {{ item
              }}<button
                uiComboboxChipRemove
                [attr.aria-label]="'Remove ' + item"
              >
                <svg lucideX aria-hidden="true"></svg>
              </button>
            </div>
          }</ng-container
        ><input uiComboboxInput placeholder="Add labels…" />
      </div>
    </div>
    <div *uiComboboxContent>
      <div uiComboboxList>
        @for (label of labels; track label) {
          <div uiComboboxItem #entry="uiComboboxItem" [value]="label">
            {{ label }}
            @if (entry.state().maxReached) {
              <span data-slot="hint">Limit reached</span>
            }
            <span *uiComboboxItemIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </div>
        }
      </div></div
  ></ng-container>`,
})
class Example {
  protected readonly labels = [
    "Bug",
    "Feature",
    "Documentation",
    "Design",
    "Performance",
    "Security",
    "Testing",
  ]
  protected valuesOf(value: unknown) {
    return value as string[]
  }
}

export { Example }
