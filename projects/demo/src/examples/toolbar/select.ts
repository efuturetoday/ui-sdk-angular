import { Component, computed, signal } from "@angular/core"
import {
  LucideCheck,
  LucideChevronsUpDown,
  LucideZoomIn,
  LucideZoomOut,
} from "@lucide/angular"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
  UiToolbar,
  UiToolbarButton,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronsUpDown,
    LucideZoomIn,
    LucideZoomOut,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectTrigger,
    UiSelectValue,
    UiToolbar,
    UiToolbarButton,
  ],
  template: `
    <div uiToolbar aria-label="View">
      <button
        uiToolbarButton
        aria-label="Zoom out"
        [disabled]="index() === 0"
        (click)="change(zooms[index() - 1]!)"
      >
        <svg lucideZoomOut aria-hidden="true"></svg>
      </button>
      <ng-container uiSelect [value]="zoom()" (valueChange)="onValue($event)">
        <button uiSelectTrigger uiToolbarButton aria-label="Zoom">
          <span uiSelectValue></span>
          <svg lucideChevronsUpDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          @for (option of zooms; track option) {
            <div uiSelectItem [value]="option">
              {{ option }}
              <span *uiSelectItemIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
              </span>
            </div>
          }
        </div>
      </ng-container>
      <button
        uiToolbarButton
        aria-label="Zoom in"
        [disabled]="index() === zooms.length - 1"
        (click)="change(zooms[index() + 1]!)"
      >
        <svg lucideZoomIn aria-hidden="true"></svg>
      </button>
    </div>
  `,
})
class Example {
  protected readonly zooms = ["50%", "75%", "100%", "150%", "200%"]
  protected readonly log = injectLog()
  protected readonly zoom = signal("100%")
  protected readonly index = computed(() => this.zooms.indexOf(this.zoom()))

  protected onValue(value: unknown) {
    if (value) {
      this.change(value as string)
    }
  }

  protected change(value: string) {
    this.zoom.set(value)
    this.log(`Zoom ${value}`)
  }
}

export { Example }
