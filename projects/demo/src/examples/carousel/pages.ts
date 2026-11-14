import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  UiCarousel,
  UiCarouselContent,
  UiCarouselIndicator,
  UiCarouselIndicatorGroup,
  UiCarouselItem,
  UiCarouselNext,
  UiCarouselPrevious,
  UiCarouselViewport,
} from "ngx-ui-sdk/carousel"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronLeft,
    LucideChevronRight,
    UiCarousel,
    UiCarouselContent,
    UiCarouselIndicator,
    UiCarouselIndicatorGroup,
    UiCarouselItem,
    UiCarouselNext,
    UiCarouselPrevious,
    UiCarouselViewport,
  ],
  template: `
    <div uiCarousel aria-label="Products" [slidesPerPage]="3">
      <div data-slot="row">
        <button uiCarouselPrevious aria-label="Previous page">
          <svg lucideChevronLeft></svg>
        </button>
        <div uiCarouselViewport>
          <div uiCarouselContent>
            @for (product of products; track product) {
              <div uiCarouselItem>
                <div data-slot="tile">{{ product }}</div>
              </div>
            }
          </div>
        </div>
        <button uiCarouselNext aria-label="Next page">
          <svg lucideChevronRight></svg>
        </button>
      </div>
      <div data-slot="row">
        <div
          uiCarouselIndicatorGroup
          #group="uiCarouselIndicatorGroup"
          aria-label="Choose a page"
        >
          @for (index of pages(group.state().pageCount); track index) {
            <button
              uiCarouselIndicator
              [page]="index"
              [attr.aria-label]="'Page ' + index"
            ></button>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly products = [1, 2, 3, 4, 5, 6, 7, 8]

  protected pages(count: number | null) {
    return Array.from({ length: count ?? 3 }, (_, index) => index + 1)
  }
}

export { Example }
