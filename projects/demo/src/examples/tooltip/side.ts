import { Component } from "@angular/core"
import { UiTooltip, UiTooltipContent, UiTooltipTrigger } from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiTooltip, UiTooltipContent, UiTooltipTrigger],
  template: `
    <div data-slot="grid">
      @for (item of sides; track item.side) {
        <ng-container uiTooltip>
          <button uiTooltipTrigger>{{ item.label }}</button>
          <div *uiTooltipContent="let state; side: item.side">
            Add to library
          </div>
        </ng-container>
      }
    </div>
  `,
})
class Example {
  protected readonly sides = [
    { side: "top", label: "Top" },
    { side: "left", label: "Left" },
    { side: "right", label: "Right" },
    { side: "bottom", label: "Bottom" },
  ] as const
}

export { Example }
