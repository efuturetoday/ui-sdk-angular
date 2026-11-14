import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
} from "ngx-ui-sdk/select"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div data-slot="stack">
      @for (field of fields; track field.label) {
        <div uiField>
          <label uiFieldLabel>{{ field.label }}</label><ng-container
            uiSelect
            [defaultValue]="field.disabled || field.readOnly ? 'fr' : null"
            placeholder="Select a country"
            [disabled]="field.disabled"
            [readOnly]="field.readOnly"
            ><button uiSelectTrigger>
              <span uiSelectValue></span
              ><svg lucideChevronDown aria-hidden="true"></svg>
            </button>
            <div *uiSelectContent>
              @for (country of countries; track country.value) {
                <div
                  uiSelectItem
                  [value]="country.value"
                  [disabled]="country.value === 'dk'"
                >
                  {{ country.label }}
                  <span *uiSelectItemIndicator
                    ><svg lucideCheck aria-hidden="true"></svg
                  ></span>
                </div>
              }</div
          ></ng-container>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly countries = [
    { value: "ca", label: "Canada" },
    { value: "dk", label: "Denmark" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "jp", label: "Japan" },
    { value: "es", label: "Spain" },
  ]
  protected readonly fields: {
    label: string
    disabled?: boolean
    readOnly?: boolean
  }[] = [
    { label: "Billing country", disabled: true },
    { label: "Shipping from", readOnly: true },
    { label: "Shipping to" },
  ]
}

export { Example }
