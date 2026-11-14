import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  createCarouselController,
  UiCarousel,
  UiCarouselContent,
  UiCarouselItem,
  UiCarouselNext,
  UiCarouselPrevious,
  UiCarouselViewport,
} from "@ngx-ui-sdk/core/carousel"

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
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          uiCarouselPrevious
          [controller]="carousel"
          aria-label="Previous slide">
          <svg lucideChevronLeft></svg>
        </button>
        <button uiCarouselNext [controller]="carousel" aria-label="Next slide">
          <svg lucideChevronRight></svg>
        </button>
        <button type="button" (click)="carousel.setPage(5)">
          Show the Last Slide
        </button>
      </div>
      <div
        uiCarousel
        aria-label="Featured"
        [controller]="carousel"
        [drag]="false">
        <div uiCarouselViewport>
          <div uiCarouselContent>
            @for (slide of slides; track slide) {
              <div uiCarouselItem>
                <div data-slot="tile">{{ slide }}</div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly slides = [1, 2, 3, 4, 5]
  protected readonly carousel = createCarouselController()
}

export { Example }
