import { Component } from "@angular/core"
import {
  UiPopover,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ui-sdk-angular"

const aligns = [
  { value: "start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "end", label: "End" },
] as const

@Component({
  selector: "app-example",
  imports: [
    UiPopover,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <div data-slot="row">
      @for (align of aligns; track align.value) {
        <ng-container uiPopover>
          <button uiPopoverTrigger>{{ align.label }}</button>
          <div *uiPopoverContent="let state; align: align.value; sideOffset: 8">
            <h2 uiPopoverTitle>Delivery window</h2>
            <p uiPopoverDescription>Arrives Tuesday between 9 AM and noon.</p>
          </div>
        </ng-container>
      }
    </div>
  `,
})
class Example {
  protected readonly aligns = aligns
}

export { Example }
