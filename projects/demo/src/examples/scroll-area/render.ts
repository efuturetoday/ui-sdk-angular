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
    <section uiScrollArea #area="uiScrollArea">
      <article uiScrollAreaViewport aria-label="Releases">
        <div uiScrollAreaContent>
          <ul>
            @for (tag of tags; track tag) {
              <li>{{ tag }}</li>
            }
          </ul>
        </div>
      </article>
      <p data-slot="hint" aria-hidden="true">
        {{
          area.state().atStart
            ? "Scroll for older releases"
            : "More releases below"
        }}
      </p>
      <div uiScrollAreaScrollbar>
        <div uiScrollAreaThumb></div>
      </div>
    </section>
  `,
})
class Example {
  protected readonly tags = Array.from(
    { length: 50 },
    (_, index) => `v1.2.0-beta.${50 - index}`
  )
}

export { Example }
