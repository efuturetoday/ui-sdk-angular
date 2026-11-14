import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideSearch } from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxList,
  UiComboboxTrigger,
  UiComboboxValue,
} from "ngx-ui-sdk/combobox"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    LucideSearch,
    UiCombobox,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxList,
    UiComboboxTrigger,
    UiComboboxValue,
  ],
  template: `<ng-container
    uiCombobox
    [(query)]="query"
    defaultValue="jp"
    [itemToLabel]="countryLabel"
    (openChange)="clearQuery($event)"
    (openChangeComplete)="!$event && trigger.focus()"
    ><button uiComboboxTrigger #trigger aria-label="Country">
      <span
        ><ng-container uiComboboxValue #current="uiComboboxValue">{{
          current.state().label || "Select a country"
        }}</ng-container></span
      ><svg lucideChevronDown aria-hidden="true"></svg>
    </button>
    <div *uiComboboxContent="let state; anchor: trigger">
      <div data-slot="row">
        <svg lucideSearch aria-hidden="true"></svg
        ><input
          uiComboboxInput
          autofocus
          aria-label="Search countries"
          placeholder="Search…"
        />
      </div>
      <div uiComboboxEmpty>No countries found.</div>
      <div uiComboboxList>
        @for (country of countries; track country.value) {
          <div uiComboboxItem [value]="country.value" [label]="country.label">
            {{ country.label
            }}<span *uiComboboxItemIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </div>
        }
      </div></div
  ></ng-container>`,
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
  protected readonly query = signal("")

  protected clearQuery(open: boolean) {
    if (open) {
      this.query.set("")
    }
  }
}

export { Example }
