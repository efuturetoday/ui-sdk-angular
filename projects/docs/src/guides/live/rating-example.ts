import { Component, signal } from "@angular/core"
import { AppRatingStar, Rating } from "./rating-parts"

@Component({
  selector: "app-rating-example",
  imports: [AppRatingStar, Rating],
  template: `
    <app-rating [(value)]="stars" aria-label="Rating">
      @for (star of ["1", "2", "3", "4", "5"]; track star) {
        <button [appRatingStar]="star" [attr.aria-label]="star + ' stars'">
          ★
        </button>
      }
    </app-rating>
    <output>{{ stars() }} of 5</output>
  `,
  styles: `
    :host {
      display: grid;
      justify-items: center;
      gap: 8px;
    }

    app-rating {
      display: flex;
      gap: 4px;
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
      color: var(--frame-muted);
      font-size: 13px;
    }
  `,
})
class RatingExample {
  readonly stars = signal(3)
}

export { RatingExample }
