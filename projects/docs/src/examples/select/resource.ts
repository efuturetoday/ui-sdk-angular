import { Component, resource, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { asyncOptions, UiText } from "@ngx-ui-sdk/core"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiSelect,
  UiSelectContent,
  UiSelectEmpty,
  UiSelectInput,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectList,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"

type Country = { value: string; label: string }

const countryList: Country[] = [
  { value: "ar", label: "Argentina" },
  { value: "au", label: "Australia" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "in", label: "India" },
  { value: "it", label: "Italy" },
  { value: "jp", label: "Japan" },
  { value: "mx", label: "Mexico" },
  { value: "es", label: "Spain" },
  { value: "se", label: "Sweden" },
]

const pause = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })

@Component({
  selector: "app-example",
  imports: [
    UiText,
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
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Country</label>
      <ng-container
        uiSelect
        [(query)]="query"
        [items]="options.items()"
        [status]="options.status()"
        [filter]="false"
        placeholder="Select a country"
      >
        <button uiSelectTrigger>
          <span uiSelectValue uiText></span>
          <svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent="let state">
          <input
            uiSelectInput
            aria-label="Search countries"
            placeholder="Search countries…"
          />
          <div uiSelectEmpty>No countries found.</div>
          <div uiSelectList>
            @for (item of options.items(); track item.value) {
              <div uiSelectItem [value]="item.value" [label]="item.label">
                {{ item.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </div>
            }
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly query = signal("")
  protected readonly countries = resource({
    params: () => ({ query: this.query() }),
    loader: async ({ params, abortSignal }) => {
      await pause(300, abortSignal)
      const needle = params.query.trim().toLowerCase()
      return countryList.filter((country) =>
        country.label.toLowerCase().includes(needle)
      )
    },
  })
  protected readonly options = asyncOptions(this.countries)
}

export { Example }
