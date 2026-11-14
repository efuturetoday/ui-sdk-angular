import { Component, signal } from "@angular/core"
import {
  UiCarousel,
  UiCarouselContent,
  UiCarouselIndicator,
  UiCarouselIndicatorGroup,
  UiCarouselItem,
  UiCarouselNext,
  UiCarouselViewport,
} from "ngx-ui-sdk"

@Component({
  selector: "app-fixture",
  imports: [
    UiCarousel,
    UiCarouselContent,
    UiCarouselIndicator,
    UiCarouselIndicatorGroup,
    UiCarouselItem,
    UiCarouselNext,
    UiCarouselViewport,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiCarousel
        class="carousel"
        aria-label="Photos"
        (pageChange)="action.set('' + $event)"
      >
        <div uiCarouselViewport class="carousel-viewport">
          <div uiCarouselContent>
            @for (slide of slides; track slide) {
              <div
                uiCarouselItem
                #item="uiCarouselItem"
                class="carousel-slide"
              >
                <span
                  [class]="item.state().active ? 'is-active' : 'is-inactive'"
                  >{{ slide }}</span
                >
              </div>
            }
          </div>
        </div>
        <button uiCarouselNext #next="uiCarouselNext">
          {{ next.state().disabled ? "No more photos" : "Next photo" }}
        </button>
        <div uiCarouselIndicatorGroup aria-label="Choose a photo">
          @for (slide of slides; track slide; let index = $index) {
            <a
              uiCarouselIndicator
              [href]="'#photo-' + (index + 1)"
              [attr.aria-label]="'Photo ' + (index + 1)"
            >
              {{ index + 1 }}
            </a>
          }
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly slides = ["One", "Two", "Three"]
  protected readonly action = signal("")
}

export { Fixture }
