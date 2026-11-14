import { Component } from "@angular/core"
import {
  UiTooltip,
  UiTooltipArrow,
  UiTooltipContent,
  UiTooltipTrigger,
} from "ngx-ui-sdk/tooltip"

@Component({
  selector: "app-example",
  imports: [UiTooltip, UiTooltipArrow, UiTooltipContent, UiTooltipTrigger],
  template: `
    <div dir="rtl" data-slot="row">
      @for (item of sides; track item.side) {
        <ng-container uiTooltip>
          <button uiTooltipTrigger>{{ item.label }}</button>
          <div
            *uiTooltipContent="
              let state;
              side: item.side;
              align: 'start';
              sideOffset: 8
            "
          >
            <div uiTooltipArrow></div>
            أضف إلى المكتبة
          </div>
        </ng-container>
      }
    </div>
  `,
})
class Example {
  protected readonly sides = [
    { side: "right", label: "يمين" },
    { side: "top", label: "أعلى" },
    { side: "bottom", label: "أسفل" },
    { side: "left", label: "يسار" },
  ] as const
}

export { Example }
