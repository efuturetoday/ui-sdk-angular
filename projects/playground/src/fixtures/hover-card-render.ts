import { Component } from "@angular/core"
import {
  UiHoverCard,
  UiHoverCardContent,
  UiHoverCardTrigger,
} from "ngx-ui-sdk/hover-card"

@Component({
  selector: "app-fixture",
  imports: [UiHoverCard, UiHoverCardContent, UiHoverCardTrigger],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiHoverCard [delay]="100" [closeDelay]="100">
        <a
          uiHoverCardTrigger
          #trigger="uiHoverCardTrigger"
          href="#repo"
          [class]="trigger.state().open ? 'is-open' : 'is-closed'"
        >
          ui-sdk <span aria-hidden="true">{{ trigger.state().open ? "▲" : "▼" }}</span>
        </a>
        <section *uiHoverCardContent class="hover-card" aria-label="Repository">A headless UI kit.</section>
      </ng-container>
      <button>After</button>
    </div>
  `,
})
class Fixture {}

export { Fixture }
