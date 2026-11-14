import { Component } from "@angular/core"
import { LucideHeart } from "@lucide/angular"
import { UiToggle, UiToggleIcon } from "@ngx-ui-sdk/core/toggle"

@Component({
  selector: "app-example",
  imports: [LucideHeart, UiToggle, UiToggleIcon],
  template: `
    <button uiToggle #heart="uiToggle" aria-label="Favorite">
      <span uiToggleIcon>
        <svg
          lucideHeart
          [attr.fill]="heart.state().pressed ? 'currentColor' : 'none'"></svg>
      </span>
    </button>
  `,
})
class Example {}

export { Example }
