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
} from "ui-sdk-angular"

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
    <div dir="rtl">
      <div uiCarousel aria-label="مميز">
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
          <button uiCarouselPrevious aria-label="الشريحة السابقة">
            <svg lucideChevronLeft></svg>
          </button>
          <div uiCarouselIndicatorGroup aria-label="اختر شريحة">
            @for (slide of slides; track slide) {
              <button
                uiCarouselIndicator
                [page]="slide"
                [attr.aria-label]="'الشريحة ' + slide"
              ></button>
            }
          </div>
          <button uiCarouselNext aria-label="الشريحة التالية">
            <svg lucideChevronRight></svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly slides = [1, 2, 3, 4, 5]
}

export { Example }
