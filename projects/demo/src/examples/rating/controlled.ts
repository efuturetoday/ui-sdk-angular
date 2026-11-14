import { Component, signal } from "@angular/core"
import { LucideStar } from "@lucide/angular"
import {
  createRatingController,
  UiRating,
  UiRatingItem,
} from "@ngx-ui-sdk/core/rating"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [LucideStar, UiRating, UiRatingItem],
  template: `
    <div>
      <div data-slot="controls">
        <button type="button" (click)="rating.setValue(null)">
          Clear Rating
        </button>
      </div>
      <div
        uiRating
        #stars="uiRating"
        [(value)]="value"
        aria-label="Rating"
        [controller]="rating"
        (beforeValueChange)="
          log('value: ' + $event.value + ' (' + $event.details.reason + ')')
        "
      >
        @for (index of stars.items(); track index) {
          <span uiRatingItem [index]="index">
            <svg lucideStar aria-hidden="true"></svg>
          </span>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly rating = createRatingController()
  protected readonly value = signal<number | null | undefined>(4)
}

export { Example }
