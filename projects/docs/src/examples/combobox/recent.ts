import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxGroup,
  UiComboboxGroupLabel,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxItemText,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxTrigger,
} from "@ngx-ui-sdk/core/combobox"
import { type ListAnnouncement } from "@ngx-ui-sdk/core/select"

type Country = { value: string; label: string; keywords?: string[] }
type Recent = { type: "group"; label: string; items: Country[] }

@Component({
  selector: "app-example",
  imports: [
    UiText,
    LucideCheck,
    LucideChevronDown,
    UiCombobox,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxGroup,
    UiComboboxGroupLabel,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxItemText,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxTrigger,
  ],
  template: `
    <ng-container
      uiCombobox
      [items]="countries"
      [emptyItems]="recentCountries"
      [announcement]="announcement"
    >
      <div data-slot="stack">
        <div uiComboboxLabel>Country</div>
        <div data-slot="row">
          <input uiComboboxInput placeholder="Search countries…" />
          <button uiComboboxTrigger aria-label="Show countries">
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty>No countries found.</div>
        <div uiComboboxList #list="uiComboboxList">
          @for (entry of entriesOf(list.state().items); track key(entry)) {
            @if (isGroup(entry)) {
              <div uiComboboxGroup>
                <div uiComboboxGroupLabel>{{ entry.label }}</div>
                @for (country of entry.items; track country.value) {
                  <div
                    uiComboboxItem
                    [value]="country.value"
                    [label]="country.label"
                  >
                    <span uiComboboxItemText uiText></span>
                    <span *uiComboboxItemIndicator>
                      <svg lucideCheck aria-hidden="true"></svg>
                    </span>
                  </div>
                }
              </div>
            } @else {
              <div uiComboboxItem [value]="entry.value" [label]="entry.label">
                <span uiComboboxItemText uiText></span>
                <span *uiComboboxItemIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </div>
            }
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly countries: Country[] = [
    { value: "ar", label: "Argentina", keywords: ["república argentina"] },
    { value: "au", label: "Australia", keywords: ["oz"] },
    { value: "at", label: "Austria", keywords: ["österreich"] },
    { value: "be", label: "Belgium", keywords: ["belgië", "belgique"] },
    { value: "br", label: "Brazil", keywords: ["brasil"] },
    { value: "ca", label: "Canada" },
    { value: "cl", label: "Chile" },
    { value: "dk", label: "Denmark", keywords: ["danmark"] },
    { value: "fi", label: "Finland", keywords: ["suomi"] },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany", keywords: ["deutschland"] },
    { value: "gr", label: "Greece", keywords: ["hellas", "ελλάδα"] },
    { value: "jp", label: "Japan", keywords: ["nippon", "日本"] },
    { value: "nl", label: "Netherlands", keywords: ["holland", "nederland"] },
    { value: "es", label: "Spain", keywords: ["españa"] },
    { value: "se", label: "Sweden", keywords: ["sverige"] },
    {
      value: "ch",
      label: "Switzerland",
      keywords: ["schweiz", "suisse", "svizzera"],
    },
  ]
  protected readonly recentCountries: Recent[] = [
    {
      type: "group",
      label: "Recent",
      items: [this.countries[3], this.countries[4], this.countries[5]],
    },
  ]
  protected readonly announcement = (change: ListAnnouncement) =>
    change.type === "results" ? `${change.count} countries match` : null

  protected entriesOf(items: unknown) {
    return items as (Country | Recent)[]
  }
  protected isGroup(entry: Country | Recent): entry is Recent {
    return "items" in entry
  }
  protected key(entry: Country | Recent) {
    return this.isGroup(entry) ? entry.label : entry.value
  }
}

export { Example }
