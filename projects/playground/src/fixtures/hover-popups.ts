import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  describeChange,
  hoverPopupsFixture as fixture,
} from "tests/fixtures/hover-popups"
import {
  UiHoverCard,
  UiHoverCardContent,
  UiHoverCardTrigger,
  UiPopover,
  UiPopoverContent,
  UiPopoverTrigger,
  UiTooltip,
  UiTooltipContent,
  UiTooltipTrigger,
} from "ngx-ui-sdk"

@Component({
  selector: "app-fixture",
  imports: [
    UiHoverCard,
    UiHoverCardContent,
    UiHoverCardTrigger,
    UiPopover,
    UiPopoverContent,
    UiPopoverTrigger,
    UiTooltip,
    UiTooltipContent,
    UiTooltipTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container
        uiTooltip
        [delay]="0"
        (beforeOpenChange)="opened('tooltip', $event.open, $event.details)"
        (payloadChange)="payloadChanged('tooltip', $event.payload, $event.details)"
      >
        @for (day of fixture.days; track day) {
          <button uiTooltipTrigger [payload]="day.toLowerCase()">{{ day }}</button>
        }
        <div *uiTooltipContent="let state" class="tooltip">Tip for {{ state().payload }}</div>
      </ng-container>
      <ng-container
        uiHoverCard
        [delay]="0"
        [closeDelay]="0"
        (beforeOpenChange)="opened('hover card', $event.open, $event.details)"
        (payloadChange)="payloadChanged('hover card', $event.payload, $event.details)"
      >
        @for (person of fixture.people; track person) {
          <a uiHoverCardTrigger [href]="'#' + person" [payload]="person.toLowerCase()">{{ person }}</a>
        }
        <div *uiHoverCardContent="let state" class="hover-card">Card for {{ state().payload }}</div>
      </ng-container>
      <ng-container
        uiPopover
        openOnHover
        [delay]="0"
        [closeDelay]="0"
        (beforeOpenChange)="opened('popover', $event.open, $event.details)"
      >
        <button uiPopoverTrigger>{{ fixture.popover.trigger }}</button>
        <div *uiPopoverContent class="popup">{{ fixture.popover.content }}</div>
      </ng-container>
      <output role="status" aria-label="Last change">{{ change() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly fixture = fixture
  protected readonly change = signal("")

  protected opened(component: string, open: boolean, { event }: ChangeDetails) {
    if (open) {
      this.change.set(describeChange(component, "open", event))
    }
  }

  protected payloadChanged(
    component: string,
    payload: unknown,
    { event }: ChangeDetails
  ) {
    this.change.set(describeChange(component, `payload ${payload}`, event))
  }
}

export { Fixture }
