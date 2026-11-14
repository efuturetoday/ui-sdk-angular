import { Component } from "@angular/core"
import {
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ngx-ui-sdk"

@Component({
  selector: "app-fixture",
  imports: [
    UiPopover,
    UiPopoverClose,
    UiPopoverContent,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiPopover>
        <button
          uiPopoverTrigger
          #trigger="uiPopoverTrigger"
          [class]="trigger.state().open ? 'is-open' : 'is-closed'"
        >
          Details <span aria-hidden="true">{{ trigger.state().open ? "▲" : "▼" }}</span>
        </button>
        <div *uiPopoverContent class="popup">
          <h3 uiPopoverTitle>Shipping</h3>
          <a uiPopoverClose href="#done">Done</a>
        </div>
      </ng-container>
      <button>After</button>
    </div>
  `,
})
class Fixture {}

export { Fixture }
