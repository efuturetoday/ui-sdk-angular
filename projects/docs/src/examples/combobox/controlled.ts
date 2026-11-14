import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  type ComboboxOpenChangeDetails,
  type ComboboxQueryChangeDetails,
  type ComboboxValueChangeDetails,
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxTrigger,
} from "@ngx-ui-sdk/core/combobox"
import { injectLog } from "../../shared/log"

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
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="value.set('jp')">Choose Japan</button>
        <button type="button" (click)="open.set(true)">Open</button>
      </div>
      <ng-container
        uiCombobox
        [(value)]="value"
        [(query)]="query"
        [(open)]="open"
        [itemToLabel]="countryLabel"
        (beforeValueChange)="changeValue($event.value, $event.details)"
        (beforeQueryChange)="changeQuery($event.query, $event.details)"
        (beforeOpenChange)="changeOpen($event.open, $event.details)">
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
          <div uiComboboxList>
            @for (country of countries; track country.value) {
              <div
                uiComboboxItem
                [value]="country.value"
                [label]="country.label">
                {{ country.label }}
                <span *uiComboboxItemIndicator>
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
  protected readonly countries = [
    { value: "ar", label: "Argentina" },
    { value: "au", label: "Australia" },
    { value: "at", label: "Austria" },
    { value: "be", label: "Belgium" },
    { value: "br", label: "Brazil" },
    { value: "ca", label: "Canada" },
    { value: "cl", label: "Chile" },
    { value: "dk", label: "Denmark" },
    { value: "fi", label: "Finland" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "gr", label: "Greece" },
    { value: "jp", label: "Japan" },
    { value: "nl", label: "Netherlands" },
    { value: "es", label: "Spain" },
    { value: "se", label: "Sweden" },
    { value: "ch", label: "Switzerland" },
  ]
  protected readonly countryLabel = (value: string) =>
    this.countries.find((country) => country.value === value)?.label ?? value
  protected readonly value = signal<unknown>("fr")
  protected readonly query = signal("France")
  protected readonly open = signal<boolean | undefined>(false)
  protected readonly log = injectLog()

  protected changeValue(next: unknown, details: ComboboxValueChangeDetails) {
    this.log(`value: ${next} (${details.reason})`)
  }
  protected changeQuery(next: string, details: ComboboxQueryChangeDetails) {
    this.log(`query: “${next}” (${details.reason})`)
  }
  protected changeOpen(next: boolean, details: ComboboxOpenChangeDetails) {
    this.log(`open: ${next} (${details.reason})`)
  }
}

export { Example }
