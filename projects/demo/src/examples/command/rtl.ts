import { Component } from "@angular/core"
import {
  UiCommand,
  UiCommandEmpty,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiCommand,
    UiCommandEmpty,
    UiCommandInput,
    UiCommandItem,
    UiCommandList,
  ],
  template: `
    <div dir="rtl" data-slot="stack">
      <div uiCommand>
        <input uiCommandInput aria-label="ابحث عن أمر" placeholder="ابحث…" />
        <div uiCommandEmpty>لا توجد نتائج.</div>
        <div uiCommandList>
          @for (item of commands; track item.value) {
            <div uiCommandItem [value]="item.value" [label]="item.label">
              {{ item.label }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly commands = [
    { value: "calendar", label: "التقويم" },
    { value: "search", label: "البحث" },
    { value: "settings", label: "الإعدادات" },
    { value: "profile", label: "الملف الشخصي" },
  ]
}

export { Example }
