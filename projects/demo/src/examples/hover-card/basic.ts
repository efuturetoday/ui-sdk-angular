import { Component } from "@angular/core"
import {
  UiHoverCard,
  UiHoverCardContent,
  UiHoverCardTrigger,
} from "ngx-ui-sdk/hover-card"

@Component({
  selector: "app-example",
  imports: [UiHoverCard, UiHoverCardContent, UiHoverCardTrigger],
  template: `
    <ng-container uiHoverCard>
      <a uiHoverCardTrigger href="https://example.com/people/hollis">@hollis</a>
      <div *uiHoverCardContent>
        <div data-slot="row">
          <span data-slot="initials" aria-hidden="true">HG</span>
          <div data-slot="stack">
            <p>Hollis Grant</p>
            <p>
              Design engineer on the payments team. Writes about forms and
              motion.
            </p>
            <p data-slot="hint">Joined March 2021</p>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
