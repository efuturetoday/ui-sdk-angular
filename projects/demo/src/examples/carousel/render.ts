import { Component, ElementRef, effect, viewChild } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  UiCarousel,
  UiCarouselContent,
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
    UiCarouselItem,
    UiCarouselNext,
    UiCarouselPrevious,
    UiCarouselViewport,
  ],
  template: `
    <div uiCarousel #carousel="uiCarousel" aria-label="Photos">
      <div uiCarouselViewport>
        <div uiCarouselContent>
          @for (photo of photos; track photo.name) {
            <div uiCarouselItem #slide="uiCarouselItem">
              <div data-slot="tile">
                {{ photo.name }}
                <span data-slot="hint">
                  {{ slide.state().index + 1 }} / {{ photos.length
                  }}{{ slide.state().active ? " · showing" : "" }}
                </span>
              </div>
            </div>
          }
        </div>
      </div>
      <div data-slot="row">
        <button uiCarouselPrevious>
          <svg lucideChevronLeft></svg>
          Previous
        </button>
        @if (carousel.state().page === carousel.state().pageCount) {
          <a
            #gallery
            href="https://example.com/gallery"
            (blur)="nextFocused = false"
            >See all photos</a
          >
        } @else {
          <button
            uiCarouselNext
            (focus)="nextFocused = true"
            (blur)="nextFocused = false"
          >
            Next
            <svg lucideChevronRight></svg>
          </button>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly photos = [
    { name: "Dunes" },
    { name: "Forest" },
    { name: "Glacier" },
    { name: "Canyon" },
    { name: "Meadow" },
    { name: "Harbor" },
  ]
  protected nextFocused = false
  protected readonly gallery = viewChild<ElementRef<HTMLElement>>("gallery")

  constructor() {
    effect(() => {
      const link = this.gallery()
      if (link && this.nextFocused) {
        link.nativeElement.focus()
      }
    })
  }
}

export { Example }
