import { Component, signal } from "@angular/core"
import { ratingOptions } from "tests/fixtures/page"
import { ratingFixture } from "tests/fixtures/rating"
import {
  createRatingController,
  UiRating,
  UiRatingItem,
  type RatingValueChangeDetails,
} from "ngx-ui-sdk/rating"

const { quality, value, average } = ratingFixture

// Upstream's fixture. Vue renders a rating's stars without content; here each
// rating repeats its `uiRatingItem`s.
@Component({
  selector: "app-fixture",
  imports: [UiRating, UiRatingItem],
  template: `
    <form class="fixture" (submit)="onSubmit($event)">
      <button type="button">Before</button>
      <div
        uiRating
        #first="uiRating"
        [attr.aria-label]="quality.label"
        [name]="quality.name"
        [defaultValue]="quality.defaultValue"
        [disabled]="o.disabled"
        [controller]="controller"
        (beforeValueChange)="onValueChange($event.value, $event.details)"
      >
        @for (index of first.items(); track index) {
          <span uiRatingItem #item="uiRatingItem" [index]="index">
            <span class="star">{{ item.state().fill }}</span>
          </span>
        }
      </div>
      <button type="button">After</button>
      <div
        uiRating
        #second="uiRating"
        [attr.aria-label]="value.label"
        [name]="value.name"
        [step]="value.step"
        deselectable
      >
        @for (index of second.items(); track index) {
          <span uiRatingItem [index]="index"></span>
        }
      </div>
      <div
        uiRating
        #third="uiRating"
        [value]="average.value"
        [getValueLabel]="average.getValueLabel"
        readOnly
      >
        @for (index of third.items(); track index) {
          <span uiRatingItem [index]="index"></span>
        }
      </div>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button type="button" (click)="controller.setValue(5)">Rate five</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Submitted">{{ submitted() }}</output>
    </form>
  `,
})
class Fixture {
  protected readonly quality = quality
  protected readonly value = value
  protected readonly average = average
  protected readonly o = ratingOptions()
  protected readonly controller = createRatingController()
  protected readonly action = signal("")
  protected readonly submitted = signal("")

  protected onValueChange(score: number | null, details: RatingValueChangeDetails) {
    if (score === this.o.cancel) {
      return details.cancel()
    }
    this.action.set(`${score}:${details.reason}`)
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    this.submitted.set(
      Array.from(new FormData(form), ([key, entry]) => `${key}=${entry}`).join(
        "&"
      )
    )
  }
}

export { Fixture }
