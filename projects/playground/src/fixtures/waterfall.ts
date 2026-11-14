import { Component, signal } from "@angular/core"
import {
  describeWaterfall,
  flatWaterfall,
  waterfallFixture,
  waterfallOptions,
} from "tests/fixtures/waterfall"
import {
  createWaterfallController,
  UiWaterfall,
  UiWaterfallAxis,
  UiWaterfallBar,
  UiWaterfallCell,
  UiWaterfallColumnHeader,
  UiWaterfallHeaderRow,
  UiWaterfallIndicator,
  UiWaterfallMark,
  UiWaterfallRow,
  UiWaterfallRowHeader,
  UiWaterfallTick,
  type WaterfallExpandedChangeReason,
} from "ngx-ui-sdk/waterfall"
import type { ChangeDetails } from "@ui-sdk/core"

// Upstream's fixture. The axis's ticks are written from its state, which Vue
// renders without content.
@Component({
  selector: "app-fixture",
  imports: [
    UiWaterfall,
    UiWaterfallAxis,
    UiWaterfallBar,
    UiWaterfallCell,
    UiWaterfallColumnHeader,
    UiWaterfallHeaderRow,
    UiWaterfallIndicator,
    UiWaterfallMark,
    UiWaterfallRow,
    UiWaterfallRowHeader,
    UiWaterfallTick,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiWaterfall
        [attr.aria-label]="f.label"
        [items]="f.items"
        [controller]="controller"
        [range]="range()"
        [defaultExpanded]="o.defaultExpanded"
        [defaultValue]="o.defaultValue"
        (valueChange)="action.set(describeWaterfall('selected', $event))"
        (beforeExpandedChange)="onExpandedChange($event.expanded, $event.details)"
      >
        <div uiWaterfallHeaderRow>
          <div uiWaterfallColumnHeader>Name</div>
          <div uiWaterfallColumnHeader>Status</div>
          <div uiWaterfallColumnHeader aria-label="Timeline">
            <div uiWaterfallAxis #axis="uiWaterfallAxis">
              @for (tick of axis.state().ticks; track tick.time) {
                <span uiWaterfallTick [time]="tick.time"></span>
              }
            </div>
            <span uiWaterfallMark [time]="f.mark.time">{{ f.mark.label }}</span>
          </div>
        </div>
        @for (span of spans; track span.value) {
          <div uiWaterfallRow [value]="span.value">
            <div uiWaterfallRowHeader>
              @if (span.children) {
                <span uiWaterfallIndicator></span>
              }{{ span.label }}
            </div>
            <div uiWaterfallCell>{{ span.status }}</div>
            <div uiWaterfallBar></div>
          </div>
        }
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.expandAll()">Expand all</button>
      <button (click)="controller.collapseAll()">Collapse all</button>
      <button (click)="controller.reveal('flags')">Reveal flags</button>
      <button (click)="range.set([500, 1000])">Zoom</button>
    </div>
  `,
})
class Fixture {
  protected readonly f = waterfallFixture
  protected readonly describeWaterfall = describeWaterfall
  protected readonly o = waterfallOptions()
  protected readonly controller = createWaterfallController()
  protected readonly spans = flatWaterfall(waterfallFixture.items)
  protected readonly action = signal("")
  protected readonly range = signal<[number, number] | undefined>(this.o.range)

  protected onExpandedChange(
    expanded: string[],
    details: ChangeDetails<WaterfallExpandedChangeReason>
  ) {
    const { cancel } = this.o
    if (
      cancel &&
      expanded.includes(cancel) &&
      !this.controller.isExpanded(cancel)
    ) {
      return details.cancel()
    }
    this.action.set(describeWaterfall("expanded", expanded))
  }
}

export { Fixture }
