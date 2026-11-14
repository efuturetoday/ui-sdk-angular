import { UiText } from "@ngx-ui-sdk/core"
import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiHoverCard,
  UiHoverCardArrow,
  UiHoverCardContent,
  UiHoverCardTrigger,
} from "@ngx-ui-sdk/core/hover-card"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"

type Side = "top" | "right" | "bottom" | "left"
type Align = "start" | "center" | "end"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    LucideCheck,
    LucideChevronDown,
    UiHoverCard,
    UiHoverCardArrow,
    UiHoverCardContent,
    UiHoverCardTrigger,
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
      <ng-container uiHoverCard>
        <a uiHoverCardTrigger href="https://example.com/people/ines">@ines</a>
        <div
          *uiHoverCardContent="
            let state;
            side: side();
            align: align();
            sideOffset: 10
          ">
          <div uiHoverCardArrow></div>
          <p>Inès Moreau</p>
          <p>Product designer. Leads the checkout redesign.</p>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly sides = [
    { value: "top", label: "Top" },
    { value: "right", label: "Right" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
  ]
  protected readonly aligns = [
    { value: "start", label: "Start" },
    { value: "center", label: "Center" },
    { value: "end", label: "End" },
  ]
  protected readonly side = signal<Side>("bottom")
  protected readonly align = signal<Align>("center")

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
