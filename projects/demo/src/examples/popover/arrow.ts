import { Component, signal, viewChild, type ElementRef } from "@angular/core"
import { LucideCircleQuestionMark } from "@lucide/angular"
import {
  type PopoverOpenChangeDetails,
  UiPopover,
  UiPopoverArrow,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ngx-ui-sdk/popover"

const sides = [
  { value: "top", label: "Top" },
  { value: "right", label: "Right" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
] as const
type Side = (typeof sides)[number]["value"]

@Component({
  selector: "app-example",
  imports: [
    LucideCircleQuestionMark,
    UiPopover,
    UiPopoverArrow,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <div data-slot="stack">
      <div #controls data-slot="controls" role="group" aria-label="Side">
        @for (option of sides; track option.value) {
          <button
            type="button"
            data-size="sm"
            [attr.aria-pressed]="side() === option.value"
            (click)="side.set(option.value)"
          >
            {{ option.label }}
          </button>
        }
      </div>
      <ng-container
        uiPopover
        [open]="open()"
        (beforeOpenChange)="onOpenChange($event.open, $event.details)"
      >
        <button uiPopoverTrigger aria-label="Help">
          <svg lucideCircleQuestionMark aria-hidden="true"></svg>
        </button>
        <div
          *uiPopoverContent="
            let state;
            side: side();
            sideOffset: 10;
            arrowPadding: 12
          "
        >
          <div uiPopoverArrow></div>
          <h2 uiPopoverTitle>Keyboard shortcuts</h2>
          <p uiPopoverDescription>Press ? anywhere to see them all.</p>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly sides = sides
  protected readonly open = signal(false)
  protected readonly side = signal<Side>("bottom")
  protected readonly controls =
    viewChild.required<ElementRef<HTMLElement>>("controls")

  protected onOpenChange(next: boolean, details: PopoverOpenChangeDetails) {
    const target = details.event?.target
    const inControls =
      target instanceof Node && this.controls().nativeElement.contains(target)
    if (inControls && details.reason !== "escape-key") {
      return details.cancel()
    }
    this.open.set(next)
  }
}

export { Example }
