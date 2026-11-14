import { Component } from "@angular/core"
import {
  UiHoverCard,
  UiHoverCardArrow,
  UiHoverCardContent,
  UiHoverCardTrigger,
} from "@ngx-ui-sdk/core/hover-card"

@Component({
  selector: "app-example",
  imports: [
    UiHoverCard,
    UiHoverCardArrow,
    UiHoverCardContent,
    UiHoverCardTrigger,
  ],
  template: `
    <div dir="rtl">
      <ng-container uiHoverCard>
        <a uiHoverCardTrigger href="https://example.com/people/hollis"
          >هوليس غرانت</a
        >
        <div *uiHoverCardContent="let state; align: 'start'; sideOffset: 10">
          <div uiHoverCardArrow></div>
          <p>هوليس غرانت</p>
          <p>مهندس تصميم في فريق المدفوعات.</p>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
