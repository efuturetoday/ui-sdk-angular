import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideX } from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxChip,
  UiComboboxChipRemove,
  UiComboboxChips,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxList,
  UiComboboxTrigger,
  UiComboboxValue,
} from "@ngx-ui-sdk/core/combobox"
import {
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    LucideX,
    UiCombobox,
    UiComboboxChip,
    UiComboboxChipRemove,
    UiComboboxChips,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxList,
    UiComboboxTrigger,
    UiComboboxValue,
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
  ],
  template: `
    <form data-slot="stack" (submit)="submit($event)">
      <div uiField name="country">
        <label uiFieldLabel>Country</label>
        <ng-container uiCombobox required [itemToLabel]="countryLabel">
          <div data-slot="row">
            <input uiComboboxInput placeholder="Search countries…" />
            <button uiComboboxTrigger aria-label="Show countries">
              <svg lucideChevronDown aria-hidden="true"></svg>
            </button>
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
        <p uiFieldDescription>Where we ship your order.</p>
        <div>
          <div *uiFieldError="let state; match: 'valueMissing'">
            Choose a country.
          </div>
        </div>
      </div>
      <div uiField name="interests">
        <label uiFieldLabel>Interests</label>
        <ng-container uiCombobox multiple [defaultValue]="['Design']">
          <div uiComboboxChips>
            <ng-container uiComboboxValue #value="uiComboboxValue">
              @for (item of valuesOf(value.state().value); track item) {
                <div uiComboboxChip [value]="item">
                  {{ item }}
                  <button
                    uiComboboxChipRemove
                    [attr.aria-label]="'Remove ' + item">
                    <svg lucideX aria-hidden="true"></svg>
                  </button>
                </div>
              }
            </ng-container>
            <input uiComboboxInput placeholder="Add interests…" />
          </div>
          <div *uiComboboxContent>
            <div uiComboboxList>
              @for (interest of interests; track interest) {
                <div uiComboboxItem [value]="interest">
                  {{ interest }}
                  <span *uiComboboxItemIndicator>
                    <svg lucideCheck aria-hidden="true"></svg>
                  </span>
                </div>
              }
            </div>
          </div>
        </ng-container>
      </div>
      <div data-slot="row">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
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
  protected readonly interests = [
    "Design",
    "Engineering",
    "Marketing",
    "Research",
    "Sales",
  ]
  protected readonly log = injectLog()
  protected valuesOf(value: unknown) {
    return value as string[]
  }

  protected submit(event: Event) {
    event.preventDefault()
    const entries = [
      ...new FormData(event.currentTarget as HTMLFormElement),
    ].map(([name, value]) => `${name}=${value}`)
    this.log(`Submitted ${entries.join("&")}`)
  }
}

export { Example }
