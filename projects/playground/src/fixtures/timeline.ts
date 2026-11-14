import { Component, signal } from "@angular/core"
import {
  advance,
  timelineFixture as f,
  timelineOptions,
  type TimelineFixtureEvent,
} from "tests/fixtures/timeline"
import {
  createTimelineController,
  UiTimeline,
  UiTimelineConnector,
  UiTimelineDescription,
  UiTimelineItem,
  UiTimelineMarker,
  UiTimelineTime,
  UiTimelineTitle,
  type TimelineOrientation,
} from "ngx-ui-sdk/timeline"

@Component({
  selector: "app-fixture",
  imports: [
    UiTimeline,
    UiTimelineConnector,
    UiTimelineDescription,
    UiTimelineItem,
    UiTimelineMarker,
    UiTimelineTime,
    UiTimelineTitle,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiTimeline
        class="timeline"
        [attr.aria-label]="f.label"
        [controller]="controller"
        [orientation]="options.orientation"
        [loop]="options.loop"
        [feed]="options.feed"
        [busy]="options.busy"
      >
        @for (event of events(); track event.value) {
          <div uiTimelineItem [value]="event.value" [status]="event.status">
            <div uiTimelineMarker></div>
            <div uiTimelineConnector></div>
            <div uiTimelineTitle>{{ event.title }}</div>
            <time uiTimelineTime [attr.datetime]="event.dateTime">{{ event.time }}</time>
            <div uiTimelineDescription>{{ event.description }}</div>
            @if (event.link) {
              <a [href]="event.link.href">{{ event.link.label }}</a>
            }
          </div>
        }
      </div>
      <button>After</button>
      <button (click)="events.set([f.added, ...events()])">Add Event</button>
      <button (click)="events.set([...events()].reverse())">Reverse</button>
      <button (click)="controller.focus('shipped')">Focus Current</button>
      <button (click)="events.set(advance(events()))">Advance</button>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly advance = advance
  protected readonly options = timelineOptions() as {
    orientation?: TimelineOrientation
    loop?: boolean
    feed?: boolean
    busy?: boolean
  }
  protected readonly controller = createTimelineController()
  protected readonly events = signal<readonly TimelineFixtureEvent[]>(f.events)
}

export { Fixture }
