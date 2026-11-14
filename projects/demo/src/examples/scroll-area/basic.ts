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
    <div uiScrollArea>
      <div uiScrollAreaViewport role="region" aria-label="Tags">
        <div uiScrollAreaContent>
          <h3>Tags</h3>
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
  `,
})
class Example {
  protected readonly tags = Array.from(
    { length: 50 },
    (_, index) => `v1.2.0-beta.${50 - index}`
  )
}

export { Example }
