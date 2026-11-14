import { Component, signal } from "@angular/core"
import { carouselFixture, carouselOptions } from "tests/fixtures/carousel"
import {
  createCarouselController,
  UiCarousel,
  UiCarouselContent,
  UiCarouselIndicator,
  UiCarouselIndicatorGroup,
  UiCarouselItem,
  UiCarouselNext,
  UiCarouselPlayToggle,
  UiCarouselPrevious,
  UiCarouselViewport,
  type CarouselPageChangeDetails,
} from "ui-sdk-angular"

@Component({
  selector: "app-fixture",
  imports: [
    UiCarousel,
    UiCarouselContent,
    UiCarouselIndicator,
    UiCarouselIndicatorGroup,
    UiCarouselItem,
    UiCarouselNext,
    UiCarouselPlayToggle,
    UiCarouselPrevious,
    UiCarouselViewport,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiCarousel
        class="carousel"
        [attr.aria-label]="f.label"
        [style.--per-view]="o.perView"
        [page]="o.controlled ? page() : undefined"
        [slidesPerPage]="opts.slidesPerPage"
        [align]="opts.align"
        [orientation]="opts.orientation"
        [loop]="opts.loop"
        [defaultPlaying]="opts.defaultPlaying"
        [interval]="opts.interval"
        [defaultPage]="opts.defaultPage"
        [drag]="opts.drag"
        [skipSnaps]="opts.skipSnaps"
        [dragFree]="opts.dragFree"
        [controller]="controller"
        (beforePageChange)="onPageChange($event.page, $event.details)"
        (pageChangeComplete)="rested.set('' + $event)"
      >
        @if (o.playToggle) {
          <button
            uiCarouselPlayToggle
            #toggle="uiCarouselPlayToggle"
            class="carousel-toggle"
          >
            {{ toggle.state().playing ? f.stop : f.start }}
          </button>
        }
        <div uiCarouselViewport class="carousel-viewport">
          <div uiCarouselContent class="carousel-content">
            @for (slide of f.slides; track slide.title; let index = $index) {
              <div uiCarouselItem class="carousel-slide">
                <p>{{ slide.title }}</p>
                <a [href]="'?product=' + (index + 1)">{{ slide.link }}</a>
                @if (index === 2) {
                  <label>{{ f.field }} <input /></label>
                }
              </div>
            }
          </div>
        </div>
        <div class="carousel-controls">
          <button uiCarouselPrevious class="carousel-step">
            {{ f.previous }}
          </button>
          <button uiCarouselNext class="carousel-step">{{ f.next }}</button>
        </div>
        <div
          uiCarouselIndicatorGroup
          class="carousel-controls"
          [attr.aria-label]="f.indicators"
        >
          @for (slide of f.slides; track slide.title; let index = $index) {
            <button
              uiCarouselIndicator
              class="carousel-indicator"
              [attr.aria-label]="f.indicator(index + 1)"
            >
              {{ index + 1 }}
            </button>
          }
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Last reason">{{ reason() }}</output>
      <output aria-label="Rested on">{{ rested() }}</output>
      <button (click)="controller.setPage(4)">Show page 4</button>
      @if (o.controlled) {
        <button (click)="page.set(3)">Show page 3 by prop</button>
      }
      <button uiCarouselNext [controller]="controller">
        Next from outside
      </button>
    </div>
  `,
})
class Fixture {
  protected readonly f = carouselFixture
  protected readonly o = carouselOptions()
  protected readonly opts = this.o.options as {
    slidesPerPage?: number | "auto"
    align?: "start" | "center" | "end"
    orientation?: "horizontal" | "vertical"
    loop?: boolean
    defaultPlaying?: boolean
    interval?: number
    defaultPage?: number
    drag?: boolean
    skipSnaps?: boolean
    dragFree?: boolean
  }
  protected readonly controller = createCarouselController()
  protected readonly page = signal(1)
  protected readonly action = signal("")
  protected readonly reason = signal("")
  protected readonly rested = signal("")

  protected onPageChange(next: number, details: CarouselPageChangeDetails) {
    if (next === this.o.cancel) {
      return details.cancel()
    }
    if (this.o.controlled) {
      this.page.set(next)
    }
    this.action.set(String(next))
    this.reason.set(details.reason)
  }
}

export { Fixture }
