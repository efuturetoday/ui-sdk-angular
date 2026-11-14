import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiSelect,
  UiSelectContent,
  UiSelectEmpty,
  UiSelectGroup,
  UiSelectGroupLabel,
  UiSelectInput,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectItemText,
  UiSelectList,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"

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
    UiSelectGroup,
    UiSelectGroupLabel,
    UiSelectInput,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectItemText,
    UiSelectList,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Country</label
      ><ng-container uiSelect placeholder="Select a country"
        ><button uiSelectTrigger>
          <span uiSelectValue></span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          <input
            uiSelectInput
            aria-label="Search countries"
            placeholder="Search countries…"
          />
          <div uiSelectEmpty>No countries found.</div>
          <div uiSelectList>
            @for (group of regions; track group.label) {
              <div uiSelectGroup>
                <div uiSelectGroupLabel>{{ group.label }}</div>
                @for (item of group.items; track item.value) {
                  <div uiSelectItem [value]="item.value" [label]="item.label">
                    <span uiSelectItemText #text="uiSelectItemText">
                      @for (segment of text.state().segments; track $index) {
                        @if (segment.match) {
                          <b>{{ segment.text }}</b>
                        } @else {
                          <span>{{ segment.text }}</span>
                        }
                      }</span
                    ><span *uiSelectItemIndicator
                      ><svg lucideCheck aria-hidden="true"></svg
                    ></span>
                  </div>
                }
              </div>
            }
          </div></div
      ></ng-container>
    </div>
  `,
})
class Example {
  protected readonly regions = [
    {
      label: "Americas",
      items: [
        { value: "br", label: "Brazil" },
        { value: "ca", label: "Canada" },
        { value: "mx", label: "Mexico" },
      ],
    },
    {
      label: "Europe",
      items: [
        { value: "fr", label: "France" },
        { value: "de", label: "Germany" },
        { value: "es", label: "Spain" },
      ],
    },
    {
      label: "Asia Pacific",
      items: [
        { value: "au", label: "Australia" },
        { value: "jp", label: "Japan" },
        { value: "sg", label: "Singapore" },
      ],
    },
  ]
}

export { Example }
