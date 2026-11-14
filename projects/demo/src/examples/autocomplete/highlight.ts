import { Component } from "@angular/core"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteItemText,
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
    UiAutocompleteItemText,
    UiAutocompleteLabel,
    UiAutocompleteList,
  ],
  template: `<ng-container uiAutocomplete>
    <div data-slot="stack">
      <div uiAutocompleteLabel>Favorite fruit</div>
      <input uiAutocompleteInput placeholder="e.g. berry" />
    </div>
    <div *uiAutocompleteContent>
      <div uiAutocompleteEmpty>No fruits found.</div>
      <div uiAutocompleteList>
        @for (fruit of fruits; track fruit) {
          <div uiAutocompleteItem [value]="fruit" [label]="fruit">
            <span uiAutocompleteItemText #text="uiAutocompleteItemText">
              @for (segment of text.state().segments; track $index) {
                @if (segment.match) {
                  <strong>{{ segment.text }}</strong>
                } @else {
                  <span>{{ segment.text }}</span>
                }
              }
            </span>
          </div>
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
