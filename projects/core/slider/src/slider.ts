import {
  computed,
  Directive,
  inject,
  InjectionToken,
  input,
  output,
} from "@angular/core"
import type { SlotName } from "@ui-sdk/core"
import { fieldControlId } from "@ui-sdk/core/renderer"
import {
  slider,
  type NumberFormat,
  type SliderController,
  type SliderPrimitive,
  type SliderValueChangeDetails,
  type SliderValueCommitDetails,
} from "@ui-sdk/core/slider"
import {
  type ɵJoinedPart as JoinedPart,
  ɵFieldContextToken as FieldContextToken,
  injectFieldControl,
  ɵinjectInputInside as injectInputInside,
  optionalBoolean,
  ɵbindPart as bindPart,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  TextSource,
  showText,
} from "@ngx-ui-sdk/core"

type Value = number | number[]

// The field a single thumb's input joins. A range joins it on the root instead.
const ThumbField = new InjectionToken<() => JoinedPart | undefined>(
  "slider-thumb-field"
)

/**
 * A slider, on the element it's written on: a group around its thumbs, and
 * the hidden input a form submits, which it makes at its end. One thumb holds
 * a number; a range, an array.
 * @experimental
 */
@Directive({
  selector: "[uiSlider]",
  exportAs: "uiSlider",
  providers: [
    provideRoot(slider, () => UiSlider),
    {
      provide: ThumbField,
      useFactory: () => {
        const root = inject(UiSlider)
        return () => (root.isRange() ? undefined : root.field?.join)
      },
    },
  ],
})
class UiSlider {
  /** The value: a number for one thumb, or one per thumb for a range. Bind it, or `[(value)]`, to control it. */
  readonly value = input<Value>()
  /** The value at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<Value>()
  /** The lowest value. */
  readonly min = input<number>()
  /** The highest value. */
  readonly max = input<number>()
  /** How far one arrow key press moves a thumb. */
  readonly step = input<number>()
  /** How far Page Up, Page Down and Shift with an arrow move a thumb. */
  readonly largeStep = input<number>()
  /** How many steps a range's thumbs keep between them. */
  readonly minStepsBetweenThumbs = input<number>()
  /** Which way the track runs. */
  readonly orientation = input<"horizontal" | "vertical">()
  /** Stops it from changing. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Shows the value without letting it change. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a form needs a value. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name its value submits under in a native form. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The id of the form it belongs to, if it isn't inside it. */
  readonly form = input<string>()
  /** How the value reads, as `Intl.NumberFormat` options or a function. */
  readonly format = input<NumberFormat>()
  /** The locale the value is formatted in. */
  readonly locale = input<string>()
  /** Sets its value from anywhere. Create one with `createSliderController()`. */
  readonly controller = input<SliderController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<Value>()
  /** Emits before the value changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: Value
    details: SliderValueChangeDetails
  }>()
  /** Emits once a drag or key press settles on a value. */
  readonly valueCommit = output<{
    value: Value
    details: SliderValueCommitDetails
  }>()
  /** @internal The field around it, which a range joins and a single thumb's input does. */
  readonly field = injectFieldControl()
  readonly #context = inject(FieldContextToken, { optional: true })
  readonly handle: PrimitiveHandle<SliderPrimitive> = injectPrimitive(
    slider,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      min: this.min(),
      max: this.max(),
      step: this.step(),
      largeStep: this.largeStep(),
      minStepsBetweenThumbs: this.minStepsBetweenThumbs(),
      orientation: this.orientation(),
      disabled: this.disabled() || this.field?.disabled(),
      readOnly: this.readOnly(),
      required: this.required(),
      name: this.name() ?? this.field?.name(),
      form: this.form(),
      format: this.format(),
      locale: this.locale(),
      controller: this.controller(),
      thumbInputId: this.#context
        ? fieldControlId(this.#context.handle.api.id)
        : undefined,
      debug: this.debug(),
      onValueChange: (value: Value, details: SliderValueChangeDetails) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
      onValueCommit: (value: Value, details: SliderValueCommitDetails) =>
        this.valueCommit.emit({ value, details }),
    })
  )
  /** @internal Whether it's a range, which a field's label names as a group. */
  readonly isRange = computed(() => {
    const shape = this.value() ?? this.defaultValue()
    return Array.isArray(shape) && shape.length > 1
  })
  readonly #part = injectPart(this.handle, "root", undefined, {
    join: {
      part: (own) => (this.isRange() ? this.field?.join.part(own) : undefined),
      merge: (own, joined) =>
        this.isRange() && this.field ? this.field.join.merge(own, joined) : own,
    },
  })
  /** The slider's state. */
  readonly state = this.#part.state
  readonly #input = bindPart(
    () => this.handle,
    "input" as SlotName<SliderPrimitive>,
    () => ({}) as never,
    injectInputInside()
  )
}

/**
 * Where presses land. A press on it moves the nearest thumb there.
 * @experimental
 */
@Directive({ selector: "[uiSliderControl]", exportAs: "uiSliderControl" })
class UiSliderControl {
  readonly #part = injectPart(injectHandle(slider), "control")
  /** The control's state. */
  readonly state = this.#part.state
}

/**
 * The rail the thumbs move along. Positions are percentages of it.
 * @experimental
 */
@Directive({ selector: "[uiSliderTrack]", exportAs: "uiSliderTrack" })
class UiSliderTrack {
  readonly #part = injectPart(injectHandle(slider), "track")
  /** The track's state. */
  readonly state = this.#part.state
}

/**
 * The filled part of the track: up to a single thumb, or between a range's thumbs.
 * @experimental
 */
@Directive({ selector: "[uiSliderIndicator]", exportAs: "uiSliderIndicator" })
class UiSliderIndicator {
  readonly #part = injectPart(injectHandle(slider), "indicator")
  /** The indicator's state. */
  readonly state = this.#part.state
}

// The thumb's attributes that name and describe it, which belong to its input.
const inputAttributes = ["aria-label", "aria-labelledby", "aria-describedby"]

/**
 * A thumb, with the native range input that takes focus, which it makes
 * inside it. Its `aria-label`, `aria-labelledby` and `aria-describedby` move
 * to that input.
 * @experimental
 */
@Directive({ selector: "[uiSliderThumb]", exportAs: "uiSliderThumb" })
class UiSliderThumb {
  /** Which thumb it is, from 0, for a range. */
  readonly index = input<number>(0)
  readonly #handle = injectHandle(slider)
  readonly #field = inject(ThumbField)
  readonly #part = injectPart(this.#handle, "thumb", () => ({
    index: this.index(),
    id: String(this.index()),
  }))
  /** The thumb's state. */
  readonly state = this.#part.state
  readonly #input = bindPart(
    () => this.#handle,
    "thumb-input",
    () => ({ index: this.index(), id: String(this.index()) }),
    injectInputInside(inputAttributes),
    undefined,
    {
      part: (own) => this.#field()?.part(own),
      merge: (own, joined) => this.#field()?.merge(own, joined) ?? own,
    } as JoinedPart
  )
}

/**
 * The formatted value, a range joined with an en dash. With `uiText`, it
 * shows it; with content of its own, the content.
 * @experimental
 */
@Directive({
  providers: [{ provide: TextSource, useExisting: UiSliderValue }],
  selector: "[uiSliderValue]",
  exportAs: "uiSliderValue",
})
class UiSliderValue implements TextSource {
  readonly #part = injectPart(injectHandle(slider), "value")
  /** The value's state, with its `text`. */
  readonly state = this.#part.state
  /** Shows the part's text where `uiText` is. */
  readonly attach = showText(() => this.state().text)
}

export { createSliderController } from "@ui-sdk/core/slider"
export type {
  NumberFormat,
  SliderApi,
  SliderChangeOptions,
  SliderController,
  SliderOptions,
  SliderPrimitive,
  SliderState,
  SliderThumbProps,
  SliderThumbState,
  SliderValueChangeDetails,
  SliderValueChangeReason,
  SliderValueCommitDetails,
  SliderValueState,
} from "@ui-sdk/core/slider"

export {
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiSliderValue,
}
