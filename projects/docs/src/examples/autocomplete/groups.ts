import { Component } from "@angular/core"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteGroup,
  UiAutocompleteGroupLabel,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteLabel,
  UiAutocompleteList,
  UiAutocompleteSeparator,
} from "@ngx-ui-sdk/core/autocomplete"

@Component({
  selector: "app-example",
  imports: [
    UiAutocomplete,
    UiAutocompleteContent,
    UiAutocompleteEmpty,
    UiAutocompleteGroup,
    UiAutocompleteGroupLabel,
    UiAutocompleteInput,
    UiAutocompleteItem,
    UiAutocompleteLabel,
    UiAutocompleteList,
    UiAutocompleteSeparator,
  ],
  template: `<ng-container uiAutocomplete>
    <div data-slot="stack">
      <div uiAutocompleteLabel>Fruit</div>
      <input uiAutocompleteInput placeholder="e.g. Pear" />
    </div>
    <div *uiAutocompleteContent>
      <div uiAutocompleteEmpty>No fruits found.</div>
      <div uiAutocompleteList>
        @for (group of fruitGroups; track group.label; let index = $index) {
          @if (index > 0) {
            <div uiAutocompleteSeparator></div>
          }
          <div uiAutocompleteGroup>
            <div uiAutocompleteGroupLabel>{{ group.label }}</div>
            @for (fruit of group.items; track fruit) {
              <div uiAutocompleteItem [value]="fruit">{{ fruit }}</div>
            }
          </div>
        }
      </div>
    </div>
  </ng-container>`,
})
class Example {
  protected readonly fruitGroups = [
    {
      label: "Tree fruits",
      items: ["Apple", "Apricot", "Cherry", "Lemon", "Peach", "Pear"],
    },
    {
      label: "Berries",
      items: ["Blackberry", "Blueberry", "Grape", "Strawberry"],
    },
    { label: "Tropical", items: ["Avocado", "Banana", "Mango", "Pineapple"] },
  ]
}

export { Example }
