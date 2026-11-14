import { Component } from "@angular/core"
import { UiToggle, UiToggleGroup } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiToggle, UiToggleGroup],
  template: `
    <div dir="rtl">
      <div uiToggleGroup [defaultValue]="['list']" aria-label="العرض">
        @for (item of views; track item.value) {
          <button uiToggle [value]="item.value">{{ item.label }}</button>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly views = [
    { value: "list", label: "قائمة" },
    { value: "grid", label: "شبكة" },
    { value: "cards", label: "بطاقات" },
  ]
}

export { Example }
