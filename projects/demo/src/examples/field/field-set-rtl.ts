import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
  UiFieldLegend,
  UiFieldSet,
  UiInput,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiFieldLegend,
    UiFieldSet,
    UiInput,
  ],
  template: `
    <fieldset uiFieldSet dir="rtl">
      <legend uiFieldLegend>العنوان</legend>
      <p uiFieldDescription>نحتاج عنوانك لتوصيل طلبك.</p>
      <div uiField name="street">
        <label uiFieldLabel>الشارع</label>
        <input uiInput />
      </div>
      <div uiField name="city">
        <label uiFieldLabel>المدينة</label>
        <input uiInput />
      </div>
    </fieldset>
  `,
})
class Example {}

export { Example }
