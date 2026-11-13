import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxTrigger,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
} from "ui-sdk-angular"

function fuzzy(item: { label: string }, query: string) {
  let at = 0
  for (const char of item.label.toLowerCase()) {
    if (char === query[at]?.toLowerCase()) {
      at++
    }
  }
  return at === query.length
}

const filters = {
  contains: "contains",
  startsWith: "startsWith",
  fuzzy,
} as const

type Mode = keyof typeof filters

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiCombobox,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxTrigger,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectLabel,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `<div data-slot="stack">
    <div data-slot="controls">
      <ng-container
        uiSelect
        [items]="modes"
        [value]="mode()"
        (valueChange)="setMode($event)"
        ><div uiSelectLabel>Filter</div>
        <button uiSelectTrigger>
          <span uiSelectValue></span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          @for (option of modes; track option.value) {
            <div uiSelectItem [value]="option.value">
              {{ option.label
              }}<span *uiSelectItemIndicator
                ><svg lucideCheck aria-hidden="true"></svg
              ></span>
            </div>
          }</div
      ></ng-container>
    </div>
    <ng-container uiCombobox [filter]="filters[mode()]"
      ><div data-slot="stack">
        <div uiComboboxLabel>Country</div>
        <div data-slot="row">
          <input
            uiComboboxInput
            placeholder="Try “an”, “swd” or “deutschland”"
          /><button uiComboboxTrigger aria-label="Show countries">
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty>No countries found.</div>
        <div uiComboboxList>
          @for (country of countries; track country.value) {
            <div
              uiComboboxItem
              [value]="country.value"
              [label]="country.label"
              [keywords]="country.keywords"
            >
              {{ country.label
              }}<span *uiComboboxItemIndicator
                ><svg lucideCheck aria-hidden="true"></svg
              ></span>
            </div>
          }
        </div></div
    ></ng-container>
  </div>`,
})
class Example {
  protected readonly countries: {
    value: string
    label: string
    keywords?: string[]
  }[] = [
    { value: "ar", label: "Argentina", keywords: ["república argentina"] },
    { value: "au", label: "Australia" },
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
  protected readonly modes = [
    { value: "contains", label: "Contains" },
    { value: "startsWith", label: "Starts with" },
    { value: "fuzzy", label: "Fuzzy" },
  ]
  protected readonly filters = filters
  protected readonly mode = signal<Mode>("contains")

  protected setMode(next: unknown) {
    if (next) {
      this.mode.set(next as Mode)
    }
  }
}

export { Example }
