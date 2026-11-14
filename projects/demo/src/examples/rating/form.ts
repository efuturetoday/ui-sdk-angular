import { Component } from "@angular/core"
import { LucideStar } from "@lucide/angular"
import { UiField, UiFieldLabel, UiRating, UiRatingItem } from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [LucideStar, UiField, UiFieldLabel, UiRating, UiRatingItem],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Rate your stay</label>
        <div uiRating #stars="uiRating" name="stay" required>
          @for (index of stars.items(); track index) {
            <span uiRatingItem [index]="index">
              <svg lucideStar aria-hidden="true"></svg>
            </span>
          }
        </div>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Send Review</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.log(
      `Submitted stay=${new FormData(event.currentTarget as HTMLFormElement).get("stay")}`
    )
  }
}

export { Example }
