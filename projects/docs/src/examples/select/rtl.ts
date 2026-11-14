import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"

@Component({
  selector: "app-example",
  imports: [
    UiText,
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
    <div dir="rtl">
      <div uiField>
        <label uiFieldLabel>اللغة</label>
        <ng-container uiSelect placeholder="اختر لغة">
          <button uiSelectTrigger>
            <span uiSelectValue uiText></span>
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent>
            @for (language of languages; track language.value) {
              <div uiSelectItem [value]="language.value">
                {{ language.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {
  protected readonly languages = [
    { value: "ar", label: "العربية" },
    { value: "en", label: "الإنجليزية" },
    { value: "fr", label: "الفرنسية" },
    { value: "es", label: "الإسبانية" },
    { value: "de", label: "الألمانية" },
  ]
}

export { Example }
