import { Component } from "@angular/core"
import {
  UiScrollArea,
  UiScrollAreaContent,
  UiScrollAreaScrollbar,
  UiScrollAreaThumb,
  UiScrollAreaViewport,
} from "ngx-ui-sdk"

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
    <div dir="rtl">
      <div uiScrollArea>
        <div uiScrollAreaViewport>
          <div uiScrollAreaContent>
            <h4>الوسوم</h4>
            @for (tag of tags; track tag) {
              <div>{{ tag }}</div>
            }
          </div>
        </div>
        <div uiScrollAreaScrollbar>
          <div uiScrollAreaThumb></div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly tags = Array.from(
    { length: 40 },
    (_, index) => `وسم ${index + 1}`
  )
}

export { Example }
