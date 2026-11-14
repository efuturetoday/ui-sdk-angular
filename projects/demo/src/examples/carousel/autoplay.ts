import { Component } from "@angular/core"
import { LucideChevronLeft, LucideChevronRight } from "@lucide/angular"
import {
  UiCarousel,
  UiCarouselContent,
  UiCarouselItem,
  UiCarouselNext,
  UiCarouselPlayToggle,
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
    UiCarouselPlayToggle,
    UiCarouselPrevious,
    UiCarouselViewport,
  ],
  template: `
    <div
      uiCarousel
      aria-label="Photos"
      defaultPlaying
      [interval]="4000"
      (beforePlayingChange)="
        log(
          ($event.playing ? 'Playing' : 'Stopped') +
            ' (' +
            $event.details.reason +
            ')'
        )
      "
    >
      <div data-slot="controls">
        <button uiCarouselPlayToggle #toggle="uiCarouselPlayToggle">
          {{ toggle.state().playing ? "Pause" : "Play" }}
        </button>
      </div>
      <div data-slot="row">
        <button uiCarouselPrevious aria-label="Previous slide">
          <svg lucideChevronLeft></svg>
        </button>
        <div uiCarouselViewport>
          <div uiCarouselContent>
            @for (photo of photos; track photo.name) {
              <div uiCarouselItem>
                <div data-slot="tile">{{ photo.name }}</div>
              </div>
            }
          </div>
        </div>
        <button uiCarouselNext aria-label="Next slide">
          <svg lucideChevronRight></svg>
        </button>
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
  protected readonly log = injectLog()
}

export { Example }
