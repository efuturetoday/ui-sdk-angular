import { Component } from "@angular/core"
import { LucideX } from "@lucide/angular"
import { UiField, UiFieldDescription, UiFieldLabel } from "ngx-ui-sdk/field"
import { UiInput, UiInputClear, UiInputGroup } from "ngx-ui-sdk/input"

@Component({
  selector: "app-example",
  imports: [
    LucideX,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiInput,
    UiInputClear,
    UiInputGroup,
  ],
  template: `
    <div data-slot="stack" dir="rtl">
      <div uiField name="name">
        <label uiFieldLabel>الاسم الكامل</label>
        <input uiInput placeholder="ليلى حسن" />
        <p uiFieldDescription>كما يظهر في ملفك الشخصي.</p>
      </div>
      <div uiInputGroup>
        <input uiInput type="search" aria-label="بحث" defaultValue="حسن" />
        <button *uiInputClear aria-label="مسح البحث">
          <svg lucideX aria-hidden="true"></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
