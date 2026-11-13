import { Component } from "@angular/core"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteLabel,
  UiAutocompleteList,
} from "ui-sdk-angular"

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
  template: `<div #box data-slot="card">
    <ng-container uiAutocomplete modal="pointer" [container]="box">
      <div data-slot="stack">
        <div uiAutocompleteLabel>Fruit</div>
        <input uiAutocompleteInput />
      </div>
      <div
        *uiAutocompleteContent="
          let state;
          side: 'top';
          align: 'end';
          sideOffset: 10;
          alignOffset: -4;
          collisionPadding: 8;
          anchor: box;
          keepMounted: true
        "
      >
        <div uiAutocompleteEmpty>No fruits found.</div>
        <div uiAutocompleteList>
          @for (fruit of fruits; track fruit) {
            <div uiAutocompleteItem [value]="fruit">{{ fruit }}</div>
          }
        </div>
      </div>
    </ng-container>
  </div>`,
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
