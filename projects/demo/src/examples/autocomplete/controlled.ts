import { Component, signal } from "@angular/core"
import {
  type AutocompleteOpenChangeDetails,
  type AutocompleteValueChangeDetails,
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteLabel,
  UiAutocompleteList,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

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
  template: `<div data-slot="stack">
    <ng-container
      uiAutocomplete
      [(value)]="value"
      [(open)]="open"
      debug
      (beforeValueChange)="changeValue($event.value, $event.details)"
      (beforeOpenChange)="changeOpen($event.open, $event.details)"
      (openChangeComplete)="
        log($event ? 'opened and settled' : 'closed and settled')
      "
      (highlight)="$event.value && log('highlighted ' + $event.value)"
    >
      <div uiAutocompleteLabel>Fruit (12 characters at most)</div>
      <input uiAutocompleteInput />
      <div *uiAutocompleteContent>
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
  protected readonly value = signal<string | undefined>("")
  protected readonly open = signal<boolean | undefined>(false)
  protected readonly log = injectLog()

  protected changeValue(next: string, details: AutocompleteValueChangeDetails) {
    if (next.length > 12) {
      return details.cancel()
    }
    this.log(`text: ${details.reason}`)
  }
  protected changeOpen(next: boolean, details: AutocompleteOpenChangeDetails) {
    this.log(`${next ? "opened" : "closed"}: ${details.reason}`)
  }
}

export { Example }
