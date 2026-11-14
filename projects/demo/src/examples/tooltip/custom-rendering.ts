import { Component } from "@angular/core"
import {
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "ngx-ui-sdk/tooltip"

@Component({
  selector: "app-example",
  imports: [UiTooltip, UiTooltipContent, UiTooltipTrigger],
  template: `
    <ng-container uiTooltip>
      <a
        uiTooltipTrigger
        data-variant="link"
        href="https://example.com/changelog"
        >Changelog</a
      >
      <div *uiTooltipContent>See what's new in 2.0</div>
    </ng-container>
  `,
})
class Example {}

export { Example }
