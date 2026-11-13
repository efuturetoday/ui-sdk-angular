import { Component } from "@angular/core"
import { LucideChevronDown, LucideX } from "@lucide/angular"
import {
  UiAutocomplete,
  UiAutocompleteClear,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteLabel,
  UiAutocompleteList,
  UiAutocompleteTrigger,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronDown,
    LucideX,
    UiAutocomplete,
    UiAutocompleteClear,
    UiAutocompleteContent,
    UiAutocompleteEmpty,
    UiAutocompleteInput,
    UiAutocompleteItem,
    UiAutocompleteLabel,
    UiAutocompleteList,
    UiAutocompleteTrigger,
  ],
  template: `<ng-container uiAutocomplete defaultValue="Mango">
    <div data-slot="stack">
      <div uiAutocompleteLabel>Fruit</div>
      <div data-slot="row">
        <input uiAutocompleteInput />
        <button *uiAutocompleteClear aria-label="Clear">
          <svg lucideX aria-hidden="true"></svg>
        </button>
        <button uiAutocompleteTrigger aria-label="Show fruits">
          <svg lucideChevronDown aria-hidden="true"></svg>
        </button>
      </div>
    </div>
    <div *uiAutocompleteContent>
      <div uiAutocompleteEmpty>No fruits found.</div>
      <div uiAutocompleteList>
        @for (fruit of fruits; track fruit) {
          <div uiAutocompleteItem [value]="fruit">{{ fruit }}</div>
        }
      </div>
    </div>
  </ng-container>`,
})
class Example {
  protected readonly fruits = [
    "Apple",
    "Apricot",
    "Avocado",
    "Banana",
    "Blackberry",
    "Blueberry",
    "Cherry",
    "Grape",
    "Lemon",
    "Mango",
    "Orange",
    "Peach",
    "Pear",
    "Pineapple",
    "Strawberry",
  ]
}

export { Example }
