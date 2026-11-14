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
      [value]="4.2"
      readOnly
      [getValueLabel]="valueLabel"
    >
      @for (index of stars.items(); track index) {
        <span uiRatingItem [index]="index">
          <svg lucideStar aria-hidden="true"></svg>
        </span>
      }
    </div>
  `,
})
class Example {
  protected readonly valueLabel = (value: number, max: number) =>
    `Rated ${value} out of ${max}`
}

export { Example }
