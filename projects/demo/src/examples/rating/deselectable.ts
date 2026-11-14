import { Component } from "@angular/core"
import { LucideStar } from "@lucide/angular"
import { UiRating, UiRatingItem } from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [LucideStar, UiRating, UiRatingItem],
  template: `
    <div
      uiRating
      #stars="uiRating"
      aria-label="Rating"
      [defaultValue]="4"
      deselectable
    >
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
