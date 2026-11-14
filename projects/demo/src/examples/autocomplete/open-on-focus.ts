import { Component } from "@angular/core"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteGroup,
  UiAutocompleteGroupLabel,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteList,
} from "ngx-ui-sdk/autocomplete"

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
    UiAutocompleteList,
  ],
  template: `<ng-container uiAutocomplete openOnFocus>
    <input uiAutocompleteInput aria-label="Search" placeholder="Search…" />
    <div *uiAutocompleteContent>
      <div uiAutocompleteEmpty>No results.</div>
      <div uiAutocompleteList>
        <div uiAutocompleteGroup>
          <div uiAutocompleteGroupLabel>Recent searches</div>
          @for (search of recent; track search) {
            <div uiAutocompleteItem [value]="search">{{ search }}</div>
          }
        </div>
      </div>
    </div>
  </ng-container>`,
})
class Example {
  protected readonly recent = [
    "react hooks",
    "tailwind grid",
    "web components",
    "vue v-model",
  ]
}

export { Example }
