import { Component } from "@angular/core"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteList,
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
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
    UiAutocompleteList,
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
  ],
  template: `<form id="order" data-slot="stack" (submit)="submit($event)">
    <div uiField>
      <label uiFieldLabel>Fruit</label>
      <ng-container
        uiAutocomplete
        name="fruit"
        form="order"
        required
        defaultValue="Apple"
      >
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
      <p uiFieldDescription>Any fruit, listed or not.</p>
      <div><div *uiFieldError></div></div>
    </div>
    <div data-slot="row">
      <button type="submit" data-variant="solid">Submit</button>
      <button type="reset">Reset</button>
    </div>
  </form>`,
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
  protected readonly log = injectLog()

  protected submit(event: Event) {
    event.preventDefault()
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`
    )
    this.log(`Submitted ${data.join("&")}`)
  }
}

export { Example }
