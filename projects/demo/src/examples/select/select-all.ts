import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideMinus } from "@lucide/angular"
import {
  UiField,
  UiFieldLabel,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectSelectAll,
  UiSelectSeparator,
  UiSelectTrigger,
  UiSelectValue,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    LucideMinus,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectSelectAll,
    UiSelectSeparator,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Regions</label
      ><ng-container
        uiSelect
        multiple
        [defaultValue]="['us-east', 'europe', 'asia-pacific']"
        placeholder="Select regions"
        ><button uiSelectTrigger>
          <span uiSelectValue [maxLabels]="2" [getMoreLabel]="moreLabel"></span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          <div uiSelectSelectAll #all="uiSelectSelectAll">
            Select all
            @if (all.state().checked) {
              <svg lucideCheck aria-hidden="true"></svg>
            }
            @if (all.state().indeterminate) {
              <svg lucideMinus aria-hidden="true"></svg>
            }
          </div>
          <div uiSelectSeparator></div>
          @for (region of regions; track region.value) {
            <div uiSelectItem [value]="region.value">
              {{ region.label }}
              <span *uiSelectItemIndicator
                ><svg lucideCheck aria-hidden="true"></svg
              ></span>
            </div>
          }</div
      ></ng-container>
    </div>
  `,
})
class Example {
  protected readonly regions = [
    { value: "us-east", label: "US East" },
    { value: "us-west", label: "US West" },
    { value: "europe", label: "Europe" },
    { value: "asia-pacific", label: "Asia Pacific" },
    { value: "south-america", label: "South America" },
  ]
  protected readonly moreLabel = (count: number) => `${count} more`
}

export { Example }
