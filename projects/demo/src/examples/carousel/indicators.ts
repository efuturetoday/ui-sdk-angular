import { Component } from "@angular/core"
import {
  UiCarousel,
  UiCarouselContent,
  UiCarouselIndicator,
  UiCarouselIndicatorGroup,
  UiCarouselItem,
  UiCarouselViewport,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
    UiCarousel,
    UiCarouselContent,
    UiCarouselIndicator,
    UiCarouselIndicatorGroup,
    UiCarouselItem,
    UiCarouselViewport,
  ],
  template: `
    <div uiCarousel aria-label="Photos">
      <div uiCarouselViewport>
        <div uiCarouselContent>
          @for (photo of photos; track photo.name) {
            <div uiCarouselItem>
              <div data-slot="tile">{{ photo.name }}</div>
            </div>
          }
        </div>
      </div>
      <div uiCarouselIndicatorGroup aria-label="Choose a photo">
        @for (photo of photos; track photo.name; let index = $index) {
          <button
            uiCarouselIndicator
            [page]="index + 1"
            [attr.aria-label]="photo.name"
          ></button>
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
}

export { Example }
