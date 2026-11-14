import { Component } from "@angular/core"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteLabel,
  UiAutocompleteList,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiAutocomplete,
    UiAutocompleteContent,
    UiAutocompleteEmpty,
    UiAutocompleteInput,
    UiAutocompleteItem,
    UiAutocompleteLabel,
    UiAutocompleteList,
  ],
  template: `<ng-container uiAutocomplete inlineComplete>
    <div data-slot="stack">
      <div uiAutocompleteLabel>Fruit</div>
      <input uiAutocompleteInput placeholder="Type “bl”" />
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
