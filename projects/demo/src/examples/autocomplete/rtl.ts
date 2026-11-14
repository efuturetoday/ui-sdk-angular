import { Component } from "@angular/core"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteLabel,
  UiAutocompleteList,
} from "ngx-ui-sdk/autocomplete"

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
  template: `<div dir="rtl">
    <ng-container uiAutocomplete inlineComplete>
      <div data-slot="stack">
        <div uiAutocompleteLabel>المدينة</div>
        <input uiAutocompleteInput placeholder="مثلاً: دبي" />
      </div>
      <div *uiAutocompleteContent>
        <div uiAutocompleteList>
          @for (city of cities; track city) {
            <div uiAutocompleteItem [value]="city">{{ city }}</div>
          }
        </div>
      </div>
    </ng-container>
  </div>`,
})
class Example {
  protected readonly cities = [
    "القاهرة",
    "القدس",
    "الرباط",
    "الرياض",
    "بيروت",
    "دبي",
    "عمّان",
  ]
}

export { Example }
