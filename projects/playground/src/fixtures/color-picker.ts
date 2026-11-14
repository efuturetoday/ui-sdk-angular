import { Component, signal } from "@angular/core"
import { colorPickerFixture } from "tests/fixtures/color-picker"
import { colorPickerOptions } from "tests/fixtures/page"
import {
  createColorPickerController,
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
  type ColorPickerValueChangeDetails,
} from "ui-sdk-angular"

@Component({
  selector: "app-fixture",
  imports: [
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
  ],
  template: `
    <form class="fixture" (submit)="onSubmit($event)">
      <button type="button">Before</button>
      <div
        uiColorPicker
        [attr.aria-label]="f.label"
        [name]="f.name"
        [defaultValue]="o.defaultValue"
        [disabled]="o.disabled"
        [readOnly]="o.readOnly"
        [space]="o.space"
        [format]="o.format"
        [gamut]="o.gamut"
        [controller]="controller"
        (beforeValueChange)="onValueChange($event.value, $event.details)"
        (valueCommit)="
          committed.set($event.value + ':' + $event.details.reason)
        "
      >
        <div uiColorPickerArea>
          @if (o.space === "oklch") {
            <canvas uiColorPickerAreaCanvas></canvas>
          }
          <div uiColorPickerAreaThumb></div>
        </div>
        <div uiColorPickerSlider channel="hue">
          <div uiColorPickerSliderThumb></div>
        </div>
        <div uiColorPickerSlider channel="alpha">
          <div uiColorPickerSliderThumb></div>
        </div>
        <input uiColorPickerInput [attr.aria-label]="f.inputLabel" />
        <input uiColorPickerChannelInput channel="alpha" />
        <div uiColorPickerSwatch></div>
        <button uiColorPickerEyeDropper>Pick from screen</button>
        <div uiColorPickerSwatches aria-label="Presets">
          @for (swatch of f.swatches; track swatch) {
            <button uiColorPickerSwatchItem [value]="swatch"></button>
          }
        </div>
      </div>
      <button type="button">After</button>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button type="button" (click)="controller.setValue('rebeccapurple')">
        Use purple
      </button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Committed">{{ committed() }}</output>
      <output aria-label="Submitted">{{ submitted() }}</output>
    </form>
  `,
})
class Fixture {
  protected readonly f = colorPickerFixture
  protected readonly o = colorPickerOptions() as ReturnType<
    typeof colorPickerOptions
  > & { space?: "hsv" | "hsl" | "srgb" | "oklch"; format?: "hex"; gamut?: "srgb" | "p3" | false }
  protected readonly controller = createColorPickerController()
  protected readonly action = signal("")
  protected readonly committed = signal("")
  protected readonly submitted = signal("")

  protected onValueChange(value: string, details: ColorPickerValueChangeDetails) {
    if (this.o.cancel) {
      return details.cancel()
    }
    this.action.set(`${value}:${details.reason}`)
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    this.submitted.set(
      Array.from(new FormData(form), ([key, value]) => `${key}=${value}`).join(
        "&"
      )
    )
  }
}

export { Fixture }
