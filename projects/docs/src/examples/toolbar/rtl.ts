import { Component } from "@angular/core"
import { LucideBold, LucideItalic, LucideLink } from "@lucide/angular"
import { UiToggle, UiToggleIcon } from "@ngx-ui-sdk/core/toggle"
import {
  UiToolbar,
  UiToolbarButton,
  UiToolbarSeparator,
} from "@ngx-ui-sdk/core/toolbar"

@Component({
  selector: "app-example",
  imports: [
    LucideBold,
    LucideItalic,
    LucideLink,
    UiToggle,
    UiToggleIcon,
    UiToolbar,
    UiToolbarButton,
    UiToolbarSeparator,
  ],
  template: `
    <div dir="rtl">
      <div uiToolbar aria-label="تنسيق">
        <button uiToggle aria-label="غامق">
          <span uiToggleIcon><svg lucideBold></svg></span>
        </button>
        <button uiToggle aria-label="مائل">
          <span uiToggleIcon><svg lucideItalic></svg></span>
        </button>
        <div uiToolbarSeparator></div>
        <button uiToolbarButton aria-label="إدراج رابط">
          <svg lucideLink aria-hidden="true"></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
