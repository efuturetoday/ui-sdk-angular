import {
  Component,
  ElementRef,
  effect,
  signal,
  untracked,
  viewChild,
} from "@angular/core"
import {
  UiCarousel,
  UiCarouselContent,
  UiCarouselItem,
  UiCarouselViewport,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiCarousel, UiCarouselContent, UiCarouselItem, UiCarouselViewport],
  template: `
    <div data-slot="stack">
      <div uiCarousel [(page)]="page" aria-label="Photos">
        <div uiCarouselViewport>
          <div uiCarouselContent>
            @for (photo of photos; track photo.name) {
              <div uiCarouselItem>
                <div data-slot="tile">{{ photo.name }}</div>
              </div>
            }
          </div>
        </div>
      </div>
      <div
        uiCarousel
        #strip
        aria-label="Thumbnails"
        dragFree
        slidesPerPage="auto"
      >
        <div uiCarouselViewport>
          <div uiCarouselContent>
            @for (photo of photos; track photo.name; let index = $index) {
              <div uiCarouselItem [attr.aria-label]="photo.name">
                <button
                  type="button"
                  [attr.aria-pressed]="page() === index + 1"
                  (click)="page.set(index + 1)"
                >
                  {{ photo.name }}
                </button>
              </div>
            }
          </div>
        </div>
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
  protected readonly page = signal<number | undefined>(1)
  protected readonly strip =
    viewChild.required<ElementRef<HTMLElement>>("strip")

  constructor() {
    effect(() => {
      const next = this.page()
      untracked(() =>
        this.strip()
          .nativeElement.querySelectorAll("button")
          [(next ?? 1) - 1]?.scrollIntoView({
            block: "nearest",
            inline: "nearest",
          })
      )
    })
  }
}

export { Example }
