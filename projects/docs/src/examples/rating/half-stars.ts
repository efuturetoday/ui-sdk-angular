import { Component } from "@angular/core"
import { LucideStar } from "@lucide/angular"
import { UiRating, UiRatingItem } from "@ngx-ui-sdk/core/rating"

@Component({
  selector: "app-example",
  imports: [LucideStar, UiRating, UiRatingItem],
  template: `
    <div
      uiRating
      #stars="uiRating"
      aria-label="Rating"
      [step]="0.5"
      [defaultValue]="3.5">
      @for (index of stars.items(); track index) {
        <span uiRatingItem [index]="index">
          <svg lucideStar aria-hidden="true"></svg>
        </span>
      }
    </div>
  `,
})
class Example {}

export { Example }
