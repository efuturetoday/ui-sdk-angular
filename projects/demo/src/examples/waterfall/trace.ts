import { Component, computed, signal } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  createWaterfallController,
  type WaterfallData,
  UiWaterfall,
  UiWaterfallAxis,
  UiWaterfallBar,
  UiWaterfallColumnHeader,
  UiWaterfallHeaderRow,
  UiWaterfallIndicator,
  UiWaterfallRow,
  UiWaterfallRowHeader,
  UiWaterfallTick,
  visibleWaterfallRows,
} from "@ngx-ui-sdk/core/waterfall"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronRight,
    UiWaterfall,
    UiWaterfallAxis,
    UiWaterfallBar,
    UiWaterfallColumnHeader,
    UiWaterfallHeaderRow,
    UiWaterfallIndicator,
    UiWaterfallRow,
    UiWaterfallRowHeader,
    UiWaterfallTick,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="spans.expandAll()">Expand All</button>
        <button type="button" (click)="spans.collapseAll()">
          Collapse All
        </button>
      </div>
      <div
        uiWaterfall
        [(expanded)]="expanded"
        [(value)]="value"
        aria-label="Checkout trace"
        [items]="trace"
        [controller]="spans"
        [format]="{ style: 'unit', unit: 'millisecond', unitDisplay: 'narrow' }"
        (beforeValueChange)="log('Selected ' + $event.value)"
      >
        <div uiWaterfallHeaderRow>
          <div uiWaterfallColumnHeader>Span</div>
          <div uiWaterfallColumnHeader aria-label="Timeline">
            <div uiWaterfallAxis #axis="uiWaterfallAxis">
              @for (tick of axis.state().ticks; track tick.time) {
                <span uiWaterfallTick [time]="tick.time"></span>
              }
            </div>
          </div>
        </div>
        @for (row of rows(); track row.item.value) {
          <div uiWaterfallRow [value]="row.item.value">
            <div uiWaterfallRowHeader>
              @if (row.item.children) {
                <span uiWaterfallIndicator>
                  <svg lucideChevronRight aria-hidden="true"></svg>
                </span>
              }
              {{ row.item.label }}
            </div>
            <div uiWaterfallBar></div>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly trace: WaterfallData = [
    {
      value: "checkout",
      label: "POST /checkout",
      start: 0,
      duration: 920,
      children: [
        { value: "auth", label: "auth.verify", start: 12, duration: 64 },
        {
          value: "cart",
          label: "cart.load",
          start: 80,
          duration: 310,
          children: [
            {
              value: "cart-db",
              label: "db.query carts",
              start: 96,
              duration: 140,
            },
            {
              value: "prices",
              label: "pricing.quote",
              start: 240,
              duration: 136,
            },
          ],
        },
        {
          value: "payment",
          label: "payments.charge",
          start: 400,
          duration: 470,
          children: [
            { value: "fraud", label: "fraud.score", start: 410, duration: 120 },
            {
              value: "gateway",
              label: "gateway.capture",
              start: 540,
              duration: 310,
            },
          ],
        },
        { value: "email", label: "email.enqueue", start: 880, duration: 30 },
      ],
    },
  ]
  protected readonly log = injectLog()
  protected readonly spans = createWaterfallController()
  protected readonly expanded = signal<string[]>(["checkout"])
  protected readonly value = signal<string | null | undefined>(null)
  protected readonly rows = computed(() =>
    visibleWaterfallRows(this.trace, this.expanded())
  )
}

export { Example }
