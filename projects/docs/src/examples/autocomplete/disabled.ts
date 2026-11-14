import { Component } from "@angular/core"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteLabel,
  UiAutocompleteList,
} from "@ngx-ui-sdk/core/autocomplete"

@Component({
  selector: "app-example",
  imports: [
    UiAutocomplete,
    UiAutocompleteContent,
    UiAutocompleteInput,
    UiAutocompleteItem,
    UiAutocompleteLabel,
    UiAutocompleteList,
  ],
  template: `
    <div data-slot="stack">
      <ng-container uiAutocomplete disabled defaultValue="Banana">
        <div data-slot="stack">
          <div uiAutocompleteLabel>Disabled</div>
          <input uiAutocompleteInput />
        </div>
      </ng-container>
      <ng-container uiAutocomplete readOnly defaultValue="Cherry">
        <div data-slot="stack">
          <div uiAutocompleteLabel>Read-only</div>
          <input uiAutocompleteInput />
        </div>
      </ng-container>
      <ng-container uiAutocomplete>
        <div data-slot="stack">
          <div uiAutocompleteLabel>Some suggestions disabled</div>
          <input uiAutocompleteInput placeholder="Type “b”" />
        </div>
        <div *uiAutocompleteContent>
          <div uiAutocompleteList>
            @for (fruit of fruits; track fruit; let index = $index) {
              <div
                uiAutocompleteItem
                [value]="fruit"
                [disabled]="index % 3 === 0">
                {{ fruit }}
              </div>
            }
          </div>
        </div>
      </ng-container>
    </div>
  `,
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
