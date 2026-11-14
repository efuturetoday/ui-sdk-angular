import { Component } from "@angular/core"
import { LucideBookmark } from "@lucide/angular"
import { UiToggle, UiToggleIcon } from "ngx-ui-sdk/toggle"

@Component({
  selector: "app-example",
  imports: [LucideBookmark, UiToggle, UiToggleIcon],
  template: `
    <div dir="rtl">
      <button uiToggle>
        <span uiToggleIcon data-variant="fill">
          <svg lucideBookmark></svg>
        </span>
        إشارة مرجعية
      </button>
    </div>
  `,
})
class Example {}

export { Example }
