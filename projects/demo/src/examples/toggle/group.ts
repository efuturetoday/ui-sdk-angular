import { Component } from "@angular/core"
import { LucideBold, LucideItalic, LucideUnderline } from "@lucide/angular"
import { UiToggle, UiToggleGroup, UiToggleIcon } from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    LucideBold,
    LucideItalic,
    LucideUnderline,
    UiToggle,
    UiToggleGroup,
    UiToggleIcon,
  ],
  template: `
    <div uiToggleGroup multiple aria-label="Text formatting">
      <button uiToggle value="bold" aria-label="Bold">
        <span uiToggleIcon>
          <svg lucideBold></svg>
        </span>
      </button>
      <button uiToggle value="italic" aria-label="Italic">
        <span uiToggleIcon>
          <svg lucideItalic></svg>
        </span>
      </button>
      <button uiToggle value="underline" aria-label="Underline">
        <span uiToggleIcon>
          <svg lucideUnderline></svg>
        </span>
      </button>
    </div>
  `,
})
class Example {}

export { Example }
