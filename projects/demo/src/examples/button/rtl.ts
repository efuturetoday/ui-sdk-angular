import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import { UiButton } from "ngx-ui-sdk"

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
