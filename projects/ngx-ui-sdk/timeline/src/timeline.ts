import { computed, Directive, inject, input, type OnInit } from "@angular/core"
import {
  timeline,
  type TimelineController,
  type TimelineOrientation,
  type TimelinePrimitive,
  type TimelineStatus,
} from "@ui-sdk/core/timeline"
import {
  optionalBoolean,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
} from "ngx-ui-sdk"

/**
 * A list of dated events, like an activity feed or an order's history, on the
 * element it's written on, with one tab stop and arrow keys between events.
 * `feed` makes it a feed of articles that loads more as people scroll.
 * @experimental
 */
@Directive({
  selector: "[uiTimeline]",
  exportAs: "uiTimeline",
  providers: [provideRoot(timeline, () => UiTimeline)],
})
class UiTimeline implements OnInit {
  /** The direction the events run in, which the arrow keys follow. */
  readonly orientation = input<TimelineOrientation>()
  /** Whether the arrow keys wrap around. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Makes it a feed of articles, as the WAI-ARIA feed pattern says. */
  readonly feed = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a feed is loading more events. */
  readonly busy = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Focuses an event from anywhere. Create one with `createTimelineController()`. */
  readonly controller = input<TimelineController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly handle: PrimitiveHandle<TimelinePrimitive> = injectPrimitive(
    timeline,
    () => ({
      orientation: this.orientation(),
      loop: this.loop(),
      feed: this.feed(),
      busy: this.busy(),
      controller: this.controller(),
      debug: this.debug(),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The timeline's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * One event. Arrow keys move between events, and links and buttons inside
 * stay in the tab order.
 * @experimental
 */
@Directive({ selector: "[uiTimelineItem]", exportAs: "uiTimelineItem" })
class UiTimelineItem implements OnInit {
  /** Names the event for the controller. Generated when left out. */
  readonly value = input<string>()
  /** Where the event is in the story: `"complete"`, `"current"` or `"upcoming"`. */
  readonly status = input<TimelineStatus>()
  readonly #id = inject(UiIds).next()
  /** @internal The event's key, which its parts take. */
  readonly key = computed(() => this.value() ?? this.#id)
  readonly #part = injectPart(injectHandle(timeline), "item", () => ({
    value: this.key(),
    status: this.status(),
  }))
  /** The event's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The dot or icon that marks its event on the line. Hidden from assistive
 * technology.
 * @experimental
 */
@Directive({ selector: "[uiTimelineMarker]", exportAs: "uiTimelineMarker" })
class UiTimelineMarker implements OnInit {
  readonly #item = inject(UiTimelineItem)
  readonly #part = injectPart(injectHandle(timeline), "marker", () => ({
    value: this.#item.key(),
    status: this.#item.status(),
  }))
  /** The marker's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The line between its event's marker and the next one. Hidden from assistive
 * technology.
 * @experimental
 */
@Directive({
  selector: "[uiTimelineConnector]",
  exportAs: "uiTimelineConnector",
})
class UiTimelineConnector implements OnInit {
  readonly #item = inject(UiTimelineItem)
  readonly #part = injectPart(injectHandle(timeline), "connector", () => ({
    value: this.#item.key(),
    status: this.#item.status(),
  }))
  /** The connector's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * When its event happened, on a `<time>`: write its `datetime` so machines
 * can read it. It describes the event.
 * @experimental
 */
@Directive({ selector: "[uiTimelineTime]", exportAs: "uiTimelineTime" })
class UiTimelineTime implements OnInit {
  readonly #item = inject(UiTimelineItem)
  readonly #part = injectPart(injectHandle(timeline), "time", () => ({
    value: this.#item.key(),
    status: this.#item.status(),
  }))
  /** The time's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * What happened. It names its event.
 * @experimental
 */
@Directive({ selector: "[uiTimelineTitle]", exportAs: "uiTimelineTitle" })
class UiTimelineTitle implements OnInit {
  readonly #item = inject(UiTimelineItem)
  readonly #part = injectPart(injectHandle(timeline), "title", () => ({
    value: this.#item.key(),
    status: this.#item.status(),
  }))
  /** The title's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * More about its event. It describes the event.
 * @experimental
 */
@Directive({
  selector: "[uiTimelineDescription]",
  exportAs: "uiTimelineDescription",
})
class UiTimelineDescription implements OnInit {
  readonly #item = inject(UiTimelineItem)
  readonly #part = injectPart(injectHandle(timeline), "description", () => ({
    value: this.#item.key(),
    status: this.#item.status(),
  }))
  /** The description's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createTimelineController } from "@ui-sdk/core/timeline"
export type {
  TimelineApi,
  TimelineConnectorState,
  TimelineController,
  TimelineDescriptionState,
  TimelineItemProps,
  TimelineItemState,
  TimelineMarkerState,
  TimelineOptions,
  TimelineOrientation,
  TimelinePrimitive,
  TimelineState,
  TimelineStatus,
  TimelineTimeState,
  TimelineTitleState,
} from "@ui-sdk/core/timeline"

export {
  UiTimeline,
  UiTimelineConnector,
  UiTimelineDescription,
  UiTimelineItem,
  UiTimelineMarker,
  UiTimelineTime,
  UiTimelineTitle,
}
