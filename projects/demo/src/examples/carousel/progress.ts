import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  UiCarousel,
  UiCarouselContent,
  UiCarouselItem,
  UiCarouselNext,
  UiCarouselPrevious,
  UiCarouselViewport,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronLeft,
    LucideChevronRight,
    UiCarousel,
    UiCarouselContent,
    UiCarouselItem,
    UiCarouselNext,
    UiCarouselPrevious,
    UiCarouselViewport,
  ],
  template: `
    <div
      uiCarousel
      aria-label="Featured"
      (pageChangeComplete)="log('Rested on slide ' + $event)"
    >
      <div data-slot="row">
        <button uiCarouselPrevious aria-label="Previous slide">
          <svg lucideChevronLeft></svg>
        </button>
        <div uiCarouselViewport>
          <div uiCarouselContent>
            @for (slide of slides; track slide) {
              <div uiCarouselItem>
                <div data-slot="tile">{{ slide }}</div>
              </div>
            }
          </div>
        </div>
        <button uiCarouselNext aria-label="Next slide">
          <svg lucideChevronRight></svg>
        </button>
      </div>
      <div data-slot="row">
        <div data-slot="bar">
          <div></div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly slides = [1, 2, 3, 4, 5]
  protected readonly log = injectLog()
}

export { Example }
