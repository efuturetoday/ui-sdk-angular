import { Directive, input, type Signal } from "@angular/core"
import {
  meter,
  type MeterLabelDetails,
  type MeterPrimitive,
  type MeterValueState,
  type NumberFormat,
} from "@ui-sdk/core/meter"
import {
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  TextSource,
  showText,
} from "@ngx-ui-sdk/core"

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
class UiMeter {
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
}

/**
 * The meter's track, which holds its indicator.
 * @experimental
 */
@Directive({ selector: "[uiMeterTrack]", exportAs: "uiMeterTrack" })
class UiMeterTrack {
  readonly #part = injectPart(injectHandle(meter), "track")
  /** The track's state. */
  readonly state = this.#part.state
}

/**
 * The filled part of the track.
 * @experimental
 */
@Directive({ selector: "[uiMeterIndicator]", exportAs: "uiMeterIndicator" })
class UiMeterIndicator {
  readonly #part = injectPart(injectHandle(meter), "indicator")
  /** The indicator's state. */
  readonly state = this.#part.state
}

/**
 * The meter's name, which `aria-labelledby` points at.
 * @experimental
 */
@Directive({ selector: "[uiMeterLabel]", exportAs: "uiMeterLabel" })
class UiMeterLabel {
  readonly #part = injectPart(injectHandle(meter), "label")
  /** The label's state. */
  readonly state = this.#part.state
}

/**
 * The formatted value, like "40%". With `uiText`, it shows the value; with
 * content of its own, that is shown instead.
 * @experimental
 */
@Directive({
  providers: [{ provide: TextSource, useExisting: UiMeterValue }],
  selector: "[uiMeterValue]",
  exportAs: "uiMeterValue",
})
class UiMeterValue implements TextSource {
  readonly #part = injectPart(injectHandle(meter), "value")
  /** The value's state, with its formatted `text`. */
  readonly state: Signal<MeterValueState> = this.#part.state
  /** Shows the part's text where `uiText` is. */
  readonly attach = showText(() => this.state().text)
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
