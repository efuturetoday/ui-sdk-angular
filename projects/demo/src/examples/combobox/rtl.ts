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
  template: `<div dir="rtl">
    <ng-container uiCombobox
      ><div data-slot="stack">
        <div uiComboboxLabel>المدينة</div>
        <div data-slot="row">
          <input uiComboboxInput placeholder="ابحث عن مدينة…" /><button
            uiComboboxTrigger
            aria-label="عرض المدن"
          >
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty>لا توجد نتائج.</div>
        <div uiComboboxList>
          @for (city of cities; track city.value) {
            <div uiComboboxItem [value]="city.value" [label]="city.label">
              {{ city.label
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
  protected readonly cities = [
    { value: "cairo", label: "القاهرة" },
    { value: "dubai", label: "دبي" },
    { value: "riyadh", label: "الرياض" },
    { value: "beirut", label: "بيروت" },
    { value: "amman", label: "عمّان" },
    { value: "rabat", label: "الرباط" },
  ]
}

export { Example }
