import { Directive, inject, input, output, type OnInit } from "@angular/core"
import type { SlotName } from "@ui-sdk/core"
import {
  colorPicker,
  type ColorChannel,
  type ColorFormat,
  type ColorGamut,
  type ColorPickerController,
  type ColorPickerPrimitive,
  type ColorPickerSpace,
  type ColorPickerValueChangeDetails,
  type ColorPickerValueCommitDetails,
} from "@ui-sdk/core/color-picker"
import {
  injectFieldControl,
  ɵinjectInputInside as injectInputInside,
  optionalBoolean,
  ɵbindPart as bindPart,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
} from "@ngx-ui-sdk/core"

/**
 * A color picker, on the element it's written on: a group around its parts,
 * and the hidden input a form submits, which it makes at its end.
 * @experimental
 */
@Directive({
  selector: "[uiColorPicker]",
  exportAs: "uiColorPicker",
  providers: [provideRoot(colorPicker, () => UiColorPicker)],
})
class UiColorPicker implements OnInit {
  /** The color, as a CSS color. Bind it, or `[(value)]`, to control it. */
  readonly value = input<string>()
  /** The color at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<string>()
  /** The color space its area and sliders move in. */
  readonly space = input<ColorPickerSpace>()
  /** How the value is written, like `"hex"` or `"oklch"`. */
  readonly format = input<ColorFormat>()
  /** The gamut colors are kept in, or `false` for none. */
  readonly gamut = input<ColorGamut | false>()
  /** Stops it from changing. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Shows the color without letting it change. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a form needs a color. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name the color submits under in a native form. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The id of the form it belongs to, if it isn't inside it. */
  readonly form = input<string>()
  /** Sets the color from anywhere. Create one with `createColorPickerController()`. */
  readonly controller = input<ColorPickerController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new color once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string>()
  /** Emits before the color changes. `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string
    details: ColorPickerValueChangeDetails
  }>()
  /** Emits once a drag or key press settles on a color. */
  readonly valueCommit = output<{
    value: string
    details: ColorPickerValueCommitDetails
  }>()
  readonly #field = injectFieldControl()
  readonly handle: PrimitiveHandle<ColorPickerPrimitive> = injectPrimitive(
    colorPicker,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      space: this.space(),
      format: this.format(),
      gamut: this.gamut(),
      disabled: this.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      controller: this.controller(),
      debug: this.debug(),
      onValueChange: (
        value: string,
        details: ColorPickerValueChangeDetails
      ) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
      onValueCommit: (value: string, details: ColorPickerValueCommitDetails) =>
        this.valueCommit.emit({ value, details }),
    })
  )
  readonly #part = injectPart(this.handle, "root", undefined, {
    join: this.#field?.join,
  })
  /** The picker's state. */
  readonly state = this.#part.state
  readonly #hidden = bindPart(
    () => this.handle,
    "hidden-input" as SlotName<ColorPickerPrimitive>,
    () => ({}) as never,
    injectInputInside()
  )

  ngOnInit() {
    this.handle.init()
    this.#part.init()
    this.#hidden.init()
  }
}

/**
 * A two-channel area, like saturation and lightness, with a `uiColorPickerAreaThumb`.
 * @experimental
 */
@Directive({ selector: "[uiColorPickerArea]", exportAs: "uiColorPickerArea" })
class UiColorPickerArea implements OnInit {
  /** The channel along its width. */
  readonly x = input<ColorChannel>()
  /** The channel along its height. */
  readonly y = input<ColorChannel>()
  readonly #part = injectPart(injectHandle(colorPicker), "area", () => ({
    x: this.x(),
    y: this.y(),
  }))
  /** The picker's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The area's thumb, which takes focus and arrow keys.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerAreaThumb]",
  exportAs: "uiColorPickerAreaThumb",
})
class UiColorPickerAreaThumb implements OnInit {
  readonly #area = inject(UiColorPickerArea)
  readonly #part = injectPart(injectHandle(colorPicker), "area-thumb", () => ({
    x: this.#area.x(),
    y: this.#area.y(),
  }))
  /** The picker's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A `<canvas>` that paints the area's colors.
 * @experimental
 */
@Directive({
  selector: "canvas[uiColorPickerAreaCanvas]",
  exportAs: "uiColorPickerAreaCanvas",
})
class UiColorPickerAreaCanvas implements OnInit {
  readonly #area = inject(UiColorPickerArea)
  readonly #part = injectPart(injectHandle(colorPicker), "area-canvas", () => ({
    x: this.#area.x(),
    y: this.#area.y(),
  }))

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A one-channel slider, like hue or alpha, with a `uiColorPickerSliderThumb`.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerSlider]",
  exportAs: "uiColorPickerSlider",
})
class UiColorPickerSlider implements OnInit {
  /** The channel it moves. */
  readonly channel = input<ColorChannel>()
  /** Which way it runs. */
  readonly orientation = input<"horizontal" | "vertical">()
  /** @internal The slider's id, which its thumb names. */
  readonly id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(colorPicker), "slider", () => ({
    id: this.id,
    channel: this.channel(),
    orientation: this.orientation(),
  }))
  /** The slider's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The slider's thumb, which takes focus and arrow keys.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerSliderThumb]",
  exportAs: "uiColorPickerSliderThumb",
})
class UiColorPickerSliderThumb implements OnInit {
  readonly #slider = inject(UiColorPickerSlider)
  readonly #part = injectPart(
    injectHandle(colorPicker),
    "slider-thumb",
    () => ({
      id: this.#slider.id,
      channel: this.#slider.channel(),
      orientation: this.#slider.orientation(),
    })
  )
  /** The slider's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A text field, on an `<input>`, that shows the color and takes one typed.
 * @experimental
 */
@Directive({
  selector: "input[uiColorPickerInput]",
  exportAs: "uiColorPickerInput",
})
class UiColorPickerInput implements OnInit {
  readonly #part = injectPart(injectHandle(colorPicker), "input")
  /** The picker's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A number field, on an `<input>`, for one channel, like red or hue.
 * @experimental
 */
@Directive({
  selector: "input[uiColorPickerChannelInput]",
  exportAs: "uiColorPickerChannelInput",
})
class UiColorPickerChannelInput implements OnInit {
  /** The channel it shows and sets. */
  readonly channel = input<ColorChannel>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(
    injectHandle(colorPicker),
    "channel-input",
    () => ({ id: this.#id, channel: this.channel() })
  )
  /** The picker's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shows the color.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerSwatch]",
  exportAs: "uiColorPickerSwatch",
})
class UiColorPickerSwatch implements OnInit {
  readonly #part = injectPart(injectHandle(colorPicker), "swatch")
  /** The picker's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Picks a color from the screen, where the browser has an eye dropper.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerEyeDropper]",
  exportAs: "uiColorPickerEyeDropper",
})
class UiColorPickerEyeDropper implements OnInit {
  readonly #part = injectPart(injectHandle(colorPicker), "eye-dropper")
  /** The picker's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A list of preset colors, each a `uiColorPickerSwatchItem`.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerSwatches]",
  exportAs: "uiColorPickerSwatches",
})
class UiColorPickerSwatches implements OnInit {
  readonly #part = injectPart(injectHandle(colorPicker), "swatches")
  /** The picker's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A preset color. Pressing it picks it.
 * @experimental
 */
@Directive({
  selector: "[uiColorPickerSwatchItem]",
  exportAs: "uiColorPickerSwatchItem",
})
class UiColorPickerSwatchItem implements OnInit {
  /** The color it picks, as a CSS color. */
  readonly value = input.required<string>()
  readonly #part = injectPart(injectHandle(colorPicker), "swatch-item", () => ({
    value: this.value(),
  }))
  /** The item's state, with whether it's `selected`. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createColorPickerController } from "@ui-sdk/core/color-picker"
export type {
  Color,
  ColorChannel,
  ColorFormat,
  ColorGamut,
  ColorPickerApi,
  ColorPickerAreaProps,
  ColorPickerChangeOptions,
  ColorPickerChannelInputProps,
  ColorPickerController,
  ColorPickerOptions,
  ColorPickerPrimitive,
  ColorPickerSliderProps,
  ColorPickerSliderState,
  ColorPickerSpace,
  ColorPickerState,
  ColorPickerSwatchItemProps,
  ColorPickerSwatchItemState,
  ColorPickerValueChangeDetails,
  ColorPickerValueChangeReason,
  ColorPickerValueCommitDetails,
} from "@ui-sdk/core/color-picker"

export {
  UiColorPicker,
  UiColorPickerArea,
  UiColorPickerAreaCanvas,
  UiColorPickerAreaThumb,
  UiColorPickerChannelInput,
  UiColorPickerEyeDropper,
  UiColorPickerInput,
  UiColorPickerSlider,
  UiColorPickerSliderThumb,
  UiColorPickerSwatch,
  UiColorPickerSwatches,
  UiColorPickerSwatchItem,
}
