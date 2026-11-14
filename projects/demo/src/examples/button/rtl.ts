import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import { UiButton } from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [LucideChevronRight, UiButton],
  template: `
    <div data-slot="row" dir="rtl">
      <button uiButton>
        متابعة
        <svg lucideChevronRight></svg>
      </button>
      <button uiButton>إلغاء</button>
    </div>
  `,
})
class Example {}

export { Example }
