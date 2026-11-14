import { Component } from "@angular/core"
import {
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "ngx-ui-sdk/tooltip"

@Component({
  selector: "app-fixture",
  imports: [UiTooltip, UiTooltipContent, UiTooltipTrigger],
  template: `
    <div class="fixture tooltip-page">
      <button>Before</button>
      <ng-container uiTooltip [delay]="100">
        <a uiTooltipTrigger href="#docs">Docs</a>
        <div *uiTooltipContent class="tooltip">Read the docs</div>
      </ng-container>
      <ng-container uiTooltip [delay]="100">
        <button uiTooltipTrigger #trigger="uiTooltipTrigger" [class]="trigger.state().open ? 'is-open' : 'is-closed'">
          Status <span aria-hidden="true">{{ trigger.state().open ? "●" : "○" }}</span>
        </button>
        <div *uiTooltipContent="let state" [class]="state().open ? 'tooltip is-open' : 'tooltip'">
          All systems normal
        </div>
      </ng-container>
      <button>After</button>
    </div>
  `,
})
class Fixture {}

export { Fixture }
