import { Component } from "@angular/core"
import { UiListbox, UiListboxItem } from "ngx-ui-sdk/listbox"

@Component({
  selector: "app-example",
  imports: [UiListbox, UiListboxItem],
  template: `
    <div dir="rtl">
      <div
        uiListbox
        orientation="horizontal"
        defaultValue="day"
        aria-label="תצוגה"
      >
        @for (view of views; track view.value) {
          <div uiListboxItem [value]="view.value">{{ view.label }}</div>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly views = [
    { value: "day", label: "יום" },
    { value: "week", label: "שבוע" },
    { value: "month", label: "חודש" },
  ]
}

export { Example }
