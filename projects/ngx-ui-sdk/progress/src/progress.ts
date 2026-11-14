import { Directive, input, type OnInit, type Signal } from "@angular/core"
import {
  progress,
  type GaugeLabelDetails,
  type NumberFormat,
  type ProgressPrimitive,
  type ProgressValueState,
} from "@ui-sdk/core/progress"
import {
  ɵinjectDefaultText as injectDefaultText,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "ngx-ui-sdk"

/**
 * How far a task has come, like an upload. Put its label, value and track
 * inside.
 * @experimental
 */
@Directive({
  selector: "[uiProgress]",
  exportAs: "uiProgress",
  providers: [provideRoot(progress, () => UiProgress)],
})
class UiProgress implements OnInit {
  /** How far the task has come, between `min` and `max`. Null, or left out, means how far is unknown. */
  readonly value = input<number | null>()
  /** The lowest value. */
  readonly min = input<number>()
  /** The highest value. */
  readonly max = input<number>()
  /** How the value reads: `Intl.NumberFormat` options, or a function of the value. */
  readonly format = input<NumberFormat>()
  /** The locale the value is formatted in. Defaults to the page's `lang`. */
  readonly locale = input<string>()
  /** The text screen readers announce for the value, when the formatted value says too little. */
  readonly getValueLabel =
    input<(value: number | null, details: GaugeLabelDetails) => string>()
  readonly handle: PrimitiveHandle<ProgressPrimitive> = injectPrimitive(
    progress,
    () => ({
      value: this.value(),
      min: this.min(),
      max: this.max(),
      format: this.format(),
      locale: this.locale(),
      getValueLabel: this.getValueLabel(),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The bar's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The bar's track, which holds its indicator.
 * @experimental
 */
@Directive({ selector: "[uiProgressTrack]", exportAs: "uiProgressTrack" })
class UiProgressTrack implements OnInit {
  readonly #part = injectPart(injectHandle(progress), "track")
  /** The track's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The filled part of the track.
 * @experimental
 */
@Directive({
  selector: "[uiProgressIndicator]",
  exportAs: "uiProgressIndicator",
})
class UiProgressIndicator implements OnInit {
  readonly #part = injectPart(injectHandle(progress), "indicator")
  /** The indicator's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The bar's name, which `aria-labelledby` points at.
 * @experimental
 */
@Directive({ selector: "[uiProgressLabel]", exportAs: "uiProgressLabel" })
class UiProgressLabel implements OnInit {
  readonly #part = injectPart(injectHandle(progress), "label")
  /** The label's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The formatted value, like "40%", empty while indeterminate. Written empty, it shows the value; with
 * content of its own, that is shown instead.
 * @experimental
 */
@Directive({ selector: "[uiProgressValue]", exportAs: "uiProgressValue" })
class UiProgressValue implements OnInit {
  readonly #part = injectPart(injectHandle(progress), "value")
  /** The value's state, with its formatted `text`. */
  readonly state: Signal<ProgressValueState> = this.#part.state
  readonly #text = injectDefaultText(() => this.state().text)

  ngOnInit() {
    this.#text.decide()
    this.#part.init()
  }
}

export type {
  GaugeLabelDetails,
  NumberFormat,
  ProgressOptions,
  ProgressPrimitive,
  ProgressState,
  ProgressStatus,
  ProgressValueState,
} from "@ui-sdk/core/progress"

export {
  UiProgress,
  UiProgressIndicator,
  UiProgressLabel,
  UiProgressTrack,
  UiProgressValue,
}
