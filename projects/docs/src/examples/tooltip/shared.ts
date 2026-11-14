import { Component } from "@angular/core"
import { LucideBold, LucideItalic, LucideUnderline } from "@lucide/angular"
import {
  createTooltipController,
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "@ngx-ui-sdk/core/tooltip"

@Component({
  selector: "app-example",
  imports: [
    LucideBold,
    LucideItalic,
    LucideUnderline,
    UiTooltip,
    UiTooltipContent,
    UiTooltipTrigger,
  ],
  template: `
    <div data-slot="row" role="group" aria-label="Formatting">
      <button
        uiTooltipTrigger
        [controller]="tooltip"
        payload="Bold"
        aria-label="Bold"
      >
        <svg lucideBold aria-hidden="true"></svg>
      </button>
      <button
        uiTooltipTrigger
        [controller]="tooltip"
        payload="Italic"
        aria-label="Italic"
      >
        <svg lucideItalic aria-hidden="true"></svg>
      </button>
      <button
        uiTooltipTrigger
        [controller]="tooltip"
        payload="Underline"
        aria-label="Underline"
      >
        <svg lucideUnderline aria-hidden="true"></svg>
      </button>
      <ng-container uiTooltip [controller]="tooltip">
        <div *uiTooltipContent="let state">{{ state().payload }}</div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly tooltip = createTooltipController<string>()
}

export { Example }
