import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  createComboboxController,
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
        <button type="button" (click)="openAndWait()">Open and Wait</button>
        <button type="button" (click)="search()">Search “sw”</button>
        <button type="button" (click)="country.setValue('de')">
          Choose Germany
        </button>
        <button type="button" (click)="country.clear()">Clear</button>
      </div>
      <ng-container
        uiCombobox
        [controller]="country"
        [itemToLabel]="countryLabel">
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
            @for (item of countries; track item.value) {
              <div uiComboboxItem [value]="item.value" [label]="item.label">
                {{ item.label }}
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
  protected readonly country = createComboboxController<string>()
  protected readonly log = injectLog()

  protected async openAndWait() {
    const { reason } = await this.country.open()
    this.log(
      `Closed by ${reason}, with ${this.country.getValue() ?? "nothing"}`
    )
  }
  protected search() {
    this.country.focus()
    this.country.setQuery("sw")
    this.country.open()
  }
}

export { Example }
