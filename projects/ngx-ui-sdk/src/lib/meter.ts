import { Directive, input, type OnInit, type Signal } from "@angular/core"
import {
  meter,
  type MeterLabelDetails,
  type MeterPrimitive,
  type MeterValueState,
  type NumberFormat,
} from "@ui-sdk/core/meter"
import { injectDefaultText } from "./content"
import { injectPart } from "./part"
import {
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "./primitive"

/**
 * A reading between a minimum and a maximum, like disk usage. Put its label,
 * value and track inside.
 * @experimental
 */
@Directive({
  selector: "[uiMeter]",
  exportAs: "uiMeter",
  providers: [provideRoot(meter, () => UiMeter)],
})
class UiMeter implements OnInit {
  /** The reading, between `min` and `max`. Outside them, the fill is clamped. Left out, it's `min`. */
  readonly value = input<number>()
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
    input<(value: number, details: MeterLabelDetails) => string>()
  readonly handle: PrimitiveHandle<MeterPrimitive> = injectPrimitive(
    meter,
    () => ({
      value: this.value() as number,
      min: this.min(),
      max: this.max(),
      format: this.format(),
      locale: this.locale(),
      getValueLabel: this.getValueLabel(),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The meter's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The meter's track, which holds its indicator.
 * @experimental
 */
@Directive({ selector: "[uiMeterTrack]", exportAs: "uiMeterTrack" })
class UiMeterTrack implements OnInit {
  readonly #part = injectPart(injectHandle(meter), "track")
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
@Directive({ selector: "[uiMeterIndicator]", exportAs: "uiMeterIndicator" })
class UiMeterIndicator implements OnInit {
  readonly #part = injectPart(injectHandle(meter), "indicator")
  /** The indicator's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The meter's name, which `aria-labelledby` points at.
 * @experimental
 */
@Directive({ selector: "[uiMeterLabel]", exportAs: "uiMeterLabel" })
class UiMeterLabel implements OnInit {
  readonly #part = injectPart(injectHandle(meter), "label")
  /** The label's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The formatted value, like "40%". Written empty, it shows the value; with
 * content of its own, that is shown instead.
 * @experimental
 */
@Directive({ selector: "[uiMeterValue]", exportAs: "uiMeterValue" })
class UiMeterValue implements OnInit {
  readonly #part = injectPart(injectHandle(meter), "value")
  /** The value's state, with its formatted `text`. */
  readonly state: Signal<MeterValueState> = this.#part.state
  readonly #text = injectDefaultText(() => this.state().text)

  ngOnInit() {
    this.#text.decide()
    this.#part.init()
  }
}

export type {
  MeterLabelDetails,
  MeterOptions,
  MeterPrimitive,
  MeterState,
  MeterValueState,
  NumberFormat,
} from "@ui-sdk/core/meter"

export { UiMeter, UiMeterIndicator, UiMeterLabel, UiMeterTrack, UiMeterValue }
