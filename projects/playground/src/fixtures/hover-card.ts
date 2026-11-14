import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  hoverCardContentOptions,
  hoverCardFixture as fixture,
  hoverCardOptions,
} from "tests/fixtures/hover-card"
import {
  UiHoverCard,
  UiHoverCardArrow,
  UiHoverCardContent,
  UiHoverCardTrigger,
} from "@ngx-ui-sdk/core/hover-card"

@Component({
  selector: "app-fixture",
  imports: [
    UiHoverCard,
    UiHoverCardArrow,
    UiHoverCardContent,
    UiHoverCardTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiHoverCard
        [delay]="options.delay"
        [closeDelay]="options.closeDelay"
        [defaultOpen]="options.defaultOpen"
        [container]="options.container"
        (beforeOpenChange)="report($event.open, $event.details)"
      >
        <a uiHoverCardTrigger [href]="fixture.href">{{ fixture.trigger }}</a>
        <div *uiHoverCardContent="let state; side: content.side; align: content.align" class="hover-card">
          <div uiHoverCardArrow class="arrow"></div>
          <p>
            <strong>{{ fixture.name }}</strong>
          </p>
          <p>{{ fixture.bio }}</p>
          <a [href]="fixture.linkHref">{{ fixture.link }}</a>
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly fixture = fixture
  protected readonly options = hoverCardOptions() as {
    delay: number
    closeDelay: number
    defaultOpen?: boolean
    container?: HTMLElement | null
  }
  protected readonly content = hoverCardContentOptions()
  protected readonly action = signal("")

  protected report(open: boolean, { reason }: ChangeDetails) {
    this.action.set(`${open ? "open" : "close"}: ${reason}`)
  }
}

export { Fixture }
