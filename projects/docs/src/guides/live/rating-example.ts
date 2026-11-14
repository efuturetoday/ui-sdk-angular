import { Component, signal } from "@angular/core"
import { UiText } from "@ngx-ui-sdk/core"
import { AppRatingStar, AppRatingValue, Rating } from "./rating-parts"

@Component({
  selector: "app-rating-example",
  imports: [AppRatingStar, AppRatingValue, Rating, UiText],
  template: `
    <app-rating [(value)]="stars" aria-label="Rating">
      @for (star of ["1", "2", "3", "4", "5"]; track star) {
        <button [appRatingStar]="star" [attr.aria-label]="star + ' stars'">
          ★
        </button>
      }
      <output appRatingValue uiText></output>
    </app-rating>
  `,
  styles: `
    :host {
      display: grid;
      justify-items: center;
      gap: 8px;
    }

    app-rating {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px;
      max-width: 10rem;
    }

    button {
      padding: 0;
      border: 0;
      background: none;
      color: inherit;
      font-size: 28px;
      line-height: 1;
      opacity: 0.25;
      cursor: pointer;
    }

    button[data-filled] {
      opacity: 1;
    }

    output {
      flex-basis: 100%;
      text-align: center;
      color: var(--frame-muted);
      font-size: 13px;
    }
  `,
})
class RatingExample {
  readonly stars = signal(3)
}

export { RatingExample }
