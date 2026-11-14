import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import {
  type WaterfallBarLabelDetails,
  type WaterfallData,
  type WaterfallDataItem,
  UiWaterfall,
  UiWaterfallAxis,
  UiWaterfallBar,
  UiWaterfallCell,
  UiWaterfallColumnHeader,
  UiWaterfallHeaderRow,
  UiWaterfallMark,
  UiWaterfallRow,
  UiWaterfallRowHeader,
  UiWaterfallTick,
} from "@ngx-ui-sdk/core/waterfall"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiWaterfall,
    UiWaterfallAxis,
    UiWaterfallBar,
    UiWaterfallCell,
    UiWaterfallColumnHeader,
    UiWaterfallHeaderRow,
    UiWaterfallMark,
    UiWaterfallRow,
    UiWaterfallRowHeader,
    UiWaterfallTick,
  ],
  template: `
    <div
      uiWaterfall
      aria-label="Network requests"
      [items]="requests"
      [getBarLabel]="getBarLabel"
    >
      <div uiWaterfallHeaderRow>
        <div uiWaterfallColumnHeader>Name</div>
        <div uiWaterfallColumnHeader>Size</div>
        <div uiWaterfallColumnHeader aria-label="Timeline">
          <div uiWaterfallAxis #axis="uiWaterfallAxis" [maxTicks]="5">
            @for (tick of axis.state().ticks; track tick.time) {
              <span uiWaterfallTick [time]="tick.time" uiText></span>
            }
          </div>
          <span uiWaterfallMark [time]="620">DOMContentLoaded</span>
        </div>
      </div>
      @for (request of requests; track request.value) {
        <div uiWaterfallRow [value]="request.value">
          <div uiWaterfallRowHeader>{{ request.label }}</div>
          <div uiWaterfallCell>{{ sizes[request.value] }}</div>
          <div uiWaterfallBar></div>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly requests: WaterfallData = [
    { value: "document", label: "/", start: 0, duration: 182 },
    { value: "styles", label: "app.css", start: 190, duration: 96 },
    { value: "script", label: "app.js", start: 192, duration: 410 },
    { value: "font", label: "inter.woff2", start: 300, duration: 220 },
    { value: "user", label: "api/user", start: 610, duration: 240 },
    { value: "avatar", label: "avatar.png", start: 860, duration: 150 },
  ]
  protected readonly sizes: Record<string, string> = {
    document: "14 kB",
    styles: "8 kB",
    script: "212 kB",
    font: "48 kB",
    user: "1 kB",
    avatar: "36 kB",
  }

  protected readonly getBarLabel = (
    request: WaterfallDataItem,
    { start, duration }: WaterfallBarLabelDetails
  ) => `${this.sizes[request.value]}, starts at ${start}, takes ${duration}`
}

export { Example }
