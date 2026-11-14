import { Component, signal } from "@angular/core"
import {
  LucideCheck,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
} from "@lucide/angular"
import {
  UiCarousel,
  UiCarouselContent,
  UiCarouselItem,
  UiCarouselNext,
  UiCarouselPrevious,
  UiCarouselViewport,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
} from "ui-sdk-angular"

type Align = "start" | "center" | "end"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
    UiCarousel,
    UiCarouselContent,
    UiCarouselItem,
    UiCarouselNext,
    UiCarouselPrevious,
    UiCarouselViewport,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectLabel,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <ng-container
          uiSelect
          [items]="alignments"
          [value]="align()"
          (valueChange)="setAlign($event)"
        >
          <div uiSelectLabel>Align</div>
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (option of alignments; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator><svg lucideCheck></svg></span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <div uiCarousel aria-label="Photos" [align]="align()" [defaultPage]="2">
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
  protected readonly alignments = [
    { value: "start", label: "Start" },
    { value: "center", label: "Center" },
    { value: "end", label: "End" },
  ]
  protected readonly align = signal<Align>("center")

  protected setAlign(next: unknown) {
    if (next) {
      this.align.set(next as Align)
    }
  }
}

export { Example }
