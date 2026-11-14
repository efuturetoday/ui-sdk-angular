import { Component } from "@angular/core"
import {
  UiScrollArea,
  UiScrollAreaContent,
  UiScrollAreaScrollbar,
  UiScrollAreaThumb,
  UiScrollAreaViewport,
} from "ngx-ui-sdk/scroll-area"

@Component({
  selector: "app-example",
  imports: [
    UiScrollArea,
    UiScrollAreaContent,
    UiScrollAreaScrollbar,
    UiScrollAreaThumb,
    UiScrollAreaViewport,
  ],
  template: `
    <div data-slot="grid">
      @for (delay of delays; track delay.value) {
        <div data-slot="stack">
          <span data-slot="hint">{{ delay.label }}</span>
          <div uiScrollArea type="scroll" [scrollHideDelay]="delay.value">
            <div uiScrollAreaViewport>
              <div uiScrollAreaContent>
                <ul>
                  @for (tag of tags; track tag) {
                    <li>{{ tag }}</li>
                  }
                </ul>
              </div>
            </div>
            <div uiScrollAreaScrollbar>
              <div uiScrollAreaThumb></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly delays = [
    { value: 0, label: "No delay" },
    { value: 2000, label: "2000 ms delay" },
  ]
  protected readonly tags = Array.from(
    { length: 20 },
    (_, index) => `v1.2.0-beta.${50 - index}`
  )
}

export { Example }
