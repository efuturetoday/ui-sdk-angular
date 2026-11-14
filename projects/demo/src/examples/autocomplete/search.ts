import { Component } from "@angular/core"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteList,
} from "@ngx-ui-sdk/core/autocomplete"
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
  ],
  template: `<form
    role="search"
    data-slot="stack"
    (submit)="$event.preventDefault()"
  >
    <ng-container
      uiAutocomplete
      submitOnSelect
      name="q"
      (valueSubmit)="log('Searched “' + $event.value + '”')"
    >
      <input
        uiAutocompleteInput
        type="search"
        aria-label="Search"
        placeholder="Search…"
      />
      <div *uiAutocompleteContent>
        <div uiAutocompleteEmpty>No results.</div>
        <div uiAutocompleteList>
          @for (search of recent; track search) {
            <div uiAutocompleteItem [value]="search">{{ search }}</div>
          }
        </div>
      </div>
    </ng-container>
  </form>`,
})
class Example {
  protected readonly recent = [
    "react hooks",
    "tailwind grid",
    "web components",
    "vue v-model",
  ]
  protected readonly log = injectLog()
}

export { Example }
