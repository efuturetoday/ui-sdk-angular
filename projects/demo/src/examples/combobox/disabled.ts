import { Component } from "@angular/core"
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
} from "@ngx-ui-sdk/core/combobox"

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
  template: `<div data-slot="stack">
    @for (field of fields; track field.variant) {
      <ng-container
        uiCombobox
        [defaultValue]="field.variant === 'item' ? null : 'fr'"
        [itemToLabel]="countryLabel"
        [disabled]="field.variant === 'disabled'"
        [readOnly]="field.variant === 'readOnly'"
        ><div data-slot="stack">
          <div uiComboboxLabel>{{ field.label }}</div>
          <div data-slot="row">
            <input uiComboboxInput placeholder="Search countries…" /><button
              uiComboboxTrigger
              aria-label="Show countries"
            >
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
                [disabled]="country.value === 'dk'"
              >
                {{ country.label
                }}<span *uiComboboxItemIndicator
                  ><svg lucideCheck aria-hidden="true"></svg
                ></span>
              </div>
            }
          </div></div
      ></ng-container>
    }
  </div>`,
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
  protected readonly fields = [
    { variant: "disabled", label: "Billing country" },
    { variant: "readOnly", label: "Shipping from" },
    { variant: "item", label: "Shipping to" },
  ]
}

export { Example }
