import { Component } from "@angular/core"
import { injectAsyncOptions } from "ngx-ui-sdk"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteLabel,
  UiAutocompleteList,
  UiAutocompleteStatus,
} from "ngx-ui-sdk/autocomplete"

const cities = [
  "Amsterdam",
  "Athens",
  "Barcelona",
  "Berlin",
  "Boston",
  "Brussels",
  "Buenos Aires",
  "Cairo",
  "Chicago",
  "Copenhagen",
  "Dublin",
  "Lisbon",
  "London",
  "Los Angeles",
  "Madrid",
  "Paris",
  "Prague",
  "Rome",
  "Seoul",
  "Tokyo",
]

function searchCities(query: string, { signal }: { signal: AbortSignal }) {
  return new Promise<string[]>((resolve, reject) => {
    const timer = setTimeout(() => {
      const needle = query.trim().toLowerCase()
      resolve(cities.filter((city) => city.toLowerCase().startsWith(needle)))
    }, 300)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(new DOMException("Aborted", "AbortError"))
    })
  })
}

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
    UiAutocompleteStatus,
  ],
  template: `<ng-container
    uiAutocomplete
    [items]="results.state().items"
    [filter]="false"
    [status]="results.state().status"
    (valueChange)="results.setQuery($event)"
    (loadMore)="results.loadMore()"
  >
    <div data-slot="stack">
      <div uiAutocompleteLabel>City</div>
      <input uiAutocompleteInput placeholder="e.g. Paris" />
    </div>
    <div *uiAutocompleteContent>
      <div uiAutocompleteStatus #status="uiAutocompleteStatus">
        {{
          status.state().loading
            ? "Searching…"
            : status.state().count
              ? status.state().count +
                " " +
                (status.state().count === 1 ? "city" : "cities")
              : ""
        }}
      </div>
      <div uiAutocompleteEmpty #empty="uiAutocompleteEmpty">
        @if (empty.state().empty && !empty.state().loading) {
          No cities start with “{{ empty.state().query }}”.
        }
      </div>
      <div uiAutocompleteList #list="uiAutocompleteList">
        @for (city of citiesOf(list.state().items); track city) {
          <div uiAutocompleteItem [value]="city">{{ city }}</div>
        }
      </div>
    </div>
  </ng-container>`,
})
class Example {
  protected readonly results = injectAsyncOptions(searchCities, {
    debounce: 200,
  })

  protected citiesOf(items: unknown) {
    return (items ?? []) as string[]
  }
}

export { Example }
