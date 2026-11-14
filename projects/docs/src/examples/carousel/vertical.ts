import { Component } from "@angular/core"
import { LucideChevronDown, LucideChevronUp } from "@lucide/angular"
import {
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
    LucideChevronDown,
    LucideChevronUp,
    UiCarousel,
    UiCarouselContent,
    UiCarouselItem,
    UiCarouselNext,
    UiCarouselPrevious,
    UiCarouselViewport,
  ],
  template: `
    <div uiCarousel aria-label="Featured" orientation="vertical">
      <div uiCarouselViewport>
        <div uiCarouselContent>
          @for (slide of slides; track slide) {
            <div uiCarouselItem>
              <div data-slot="tile">{{ slide }}</div>
            </div>
          }
        </div>
      </div>
      <div data-slot="row">
        <button uiCarouselPrevious aria-label="Previous slide">
          <svg lucideChevronUp></svg>
        </button>
        <button uiCarouselNext aria-label="Next slide">
          <svg lucideChevronDown></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {
  protected readonly slides = [1, 2, 3, 4, 5]
}

export { Example }
