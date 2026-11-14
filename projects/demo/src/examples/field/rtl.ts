import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
  UiField,
  UiFieldDescription,
  UiFieldLabel,
  UiInput,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiInput,
  ],
  template: `
    <div data-slot="stack" dir="rtl">
      <div uiField>
        <label uiFieldLabel>الاسم على البطاقة</label>
        <input
          uiInput
          name="card-name"
          autocomplete="cc-name"
          placeholder="ليلى حسن"
        />
      </div>
      <div uiField>
        <label uiFieldLabel>رقم البطاقة</label>
        <input
          uiInput
          name="card-number"
          inputmode="numeric"
          autocomplete="cc-number"
          placeholder="1234 5678 9012 3456"
        />
        <p uiFieldDescription>أدخل الرقم المكون من 16 خانة.</p>
      </div>
      <div uiField>
        <button uiCheckbox #box="uiCheckbox" name="save-card" defaultChecked>
          <span *uiCheckboxIndicator>
            <svg lucideCheck></svg>
          </span>
        </button>
        <input [uiCheckboxInput]="box" />
        <label uiFieldLabel>احفظ البطاقة للمدفوعات القادمة</label>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
