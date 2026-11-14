import { UiText } from "@ngx-ui-sdk/core"
import { Component, DestroyRef, inject, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"
import {
  createToaster,
  UiToast,
  UiToastDescription,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "@ngx-ui-sdk/core/toast"

type Side = "top" | "bottom"
type Align = "start" | "center" | "end"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    LucideCheck,
    LucideChevronDown,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectLabel,
    UiSelectTrigger,
    UiSelectValue,
    UiToast,
    UiToastDescription,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <ng-container
          uiSelect
          [items]="sides"
          [value]="side()"
          (valueChange)="setSide($event)">
          <div uiSelectLabel>Side</div>
          <button uiSelectTrigger>
            <span uiSelectValue uiText></span>
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent>
            @for (option of sides; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
        <ng-container
          uiSelect
          [items]="aligns"
          [value]="align()"
          (valueChange)="setAlign($event)">
          <div uiSelectLabel>Align</div>
          <button uiSelectTrigger>
            <span uiSelectValue uiText></span>
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent>
            @for (option of aligns; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <button
        (click)="
          toast('Event created', { description: 'Friday, June 12 at 10:00 AM' })
        ">
        Create Event
      </button>
      <section
        uiToastRegion
        #region="uiToastRegion"
        [toaster]="toast"
        [side]="side()"
        [align]="align()">
        <ol uiToastList>
          @for (item of region.state().toasts; track item.toast.id) {
            <li [uiToast]="item.toast">
              <div data-slot="stack">
                <div *uiToastTitle uiText></div>
                <div *uiToastDescription uiText></div>
              </div>
            </li>
          }
        </ol>
      </section>
    </div>
  `,
})
class Example {
  protected readonly sides = [
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
  ]
  protected readonly aligns = [
    { value: "start", label: "Start" },
    { value: "center", label: "Center" },
    { value: "end", label: "End" },
  ]
  protected readonly toast = createToaster()
  protected readonly side = signal<Side>("bottom")
  protected readonly align = signal<Align>("end")

  constructor() {
    inject(DestroyRef).onDestroy(() => this.toast.dismiss())
  }

  protected setSide(next: unknown) {
    if (next) {
      this.side.set(next as Side)
    }
  }

  protected setAlign(next: unknown) {
    if (next) {
      this.align.set(next as Align)
    }
  }
}

export { Example }
