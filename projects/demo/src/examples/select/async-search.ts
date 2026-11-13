import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  injectAsyncOptions,
  UiField,
  UiFieldLabel,
  UiSelect,
  UiSelectContent,
  UiSelectEmpty,
  UiSelectInput,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectList,
  UiSelectStatus,
  UiSelectTrigger,
  UiSelectValue,
} from "ui-sdk-angular"

type Country = { value: string; label: string; disabled?: boolean }

const countryList: Country[] = [
  { value: "ar", label: "Argentina" },
  { value: "au", label: "Australia" },
  { value: "at", label: "Austria" },
  { value: "be", label: "Belgium" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "cl", label: "Chile" },
  { value: "cn", label: "China" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "gr", label: "Greece" },
  { value: "in", label: "India" },
  { value: "ie", label: "Ireland" },
  { value: "it", label: "Italy" },
  { value: "jp", label: "Japan" },
  { value: "mx", label: "Mexico" },
  { value: "nl", label: "Netherlands" },
  { value: "no", label: "Norway" },
  { value: "pt", label: "Portugal" },
  { value: "es", label: "Spain" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
]

function searchCountries(
  query: string,
  { signal, page }: { signal: AbortSignal; page: number }
) {
  return new Promise<{ items: Country[]; hasMore: boolean }>(
    (resolve, reject) => {
      const timer = setTimeout(() => {
        const needle = query.trim().toLowerCase()
        const found = countryList.filter((country) =>
          country.label.toLowerCase().includes(needle)
        )
        resolve({
          items: found.slice(page * 6, page * 6 + 6),
          hasMore: found.length > page * 6 + 6,
        })
      }, 400)
      signal.addEventListener("abort", () => {
        clearTimeout(timer)
        reject(signal.reason)
      })
    }
  )
}

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectEmpty,
    UiSelectInput,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectList,
    UiSelectStatus,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Country</label>
      <ng-container
        uiSelect
        [(query)]="query"
        [items]="results.state().items"
        [filter]="false"
        [status]="results.state().status"
        placeholder="Select a country"
        (queryChange)="results.setQuery($event)"
        (loadMore)="results.loadMore()"
      >
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          <input
            uiSelectInput
            aria-label="Search countries"
            placeholder="Search countries…"
          />
          <div uiSelectEmpty #empty="uiSelectEmpty">
            @if (empty.state().empty && !empty.state().loading) {
              No countries match “{{ empty.state().query }}”.
            }
          </div>
          <div uiSelectList #list="uiSelectList">
            @for (item of countriesOf(list.state().items); track item.value) {
              <div
                uiSelectItem
                [value]="item.value"
                [label]="item.label"
                [disabled]="item.disabled"
              >
                {{ item.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </div>
            }
          </div>
          <div uiSelectStatus #status="uiSelectStatus">
            {{
              status.state().loading
                ? "Loading…"
                : status.state().status === "error"
                  ? "Couldn't load countries."
                  : status.state().count + " shown"
            }}
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly query = signal("")
  protected readonly results = injectAsyncOptions(searchCountries, {
    immediate: true,
  })

  protected countriesOf(items: unknown) {
    return (items ?? []) as Country[]
  }
}

export { Example }
