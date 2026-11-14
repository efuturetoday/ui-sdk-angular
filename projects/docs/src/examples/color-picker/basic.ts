import { Component, signal } from "@angular/core"
import { LucidePipette } from "@lucide/angular"
import { formatColor, parseColor } from "@ui-sdk/core/color"
import {
  type ColorFormat,
  UiColorPicker,
  UiColorPickerArea,
  UiColorPickerAreaThumb,
  UiColorPickerEyeDropper,
  UiColorPickerInput,
  UiColorPickerSlider,
  UiColorPickerSliderThumb,
  UiColorPickerSwatch,
  UiColorPickerSwatches,
  UiColorPickerSwatchItem,
} from "@ngx-ui-sdk/core/color-picker"

const formats: { label: string; value: ColorFormat }[] = [
  { label: "Hex", value: "hex" },
  { label: "RGB", value: "srgb" },
  { label: "HSL", value: "hsl" },
  { label: "OKLCH", value: "oklch" },
]

@Component({
  selector: "app-example",
  imports: [
    LucidePipette,
    UiColorPicker,
    UiColorPickerArea,
    UiColorPickerAreaThumb,
    UiColorPickerEyeDropper,
    UiColorPickerInput,
    UiColorPickerSlider,
    UiColorPickerSliderThumb,
    UiColorPickerSwatch,
    UiColorPickerSwatches,
    UiColorPickerSwatchItem,
  ],
  template: `
    <div
      uiColorPicker
      [(value)]="value"
      aria-label="Brand color"
      [format]="format()"
    >
      <div uiColorPickerArea>
        <div uiColorPickerAreaThumb></div>
      </div>
      <div data-slot="row">
        <button uiColorPickerEyeDropper aria-label="Pick from screen">
          <svg lucidePipette aria-hidden="true"></svg>
        </button>
        <div data-slot="color-picker-sliders">
          <div uiColorPickerSlider channel="hue">
            <div uiColorPickerSliderThumb></div>
          </div>
          <div uiColorPickerSlider channel="alpha">
            <div uiColorPickerSliderThumb></div>
          </div>
        </div>
        <div uiColorPickerSwatch></div>
      </div>
      <div data-slot="row">
        <select
          aria-label="Format"
          [value]="format()"
          (change)="changeFormat($event)"
        >
          @for (option of formats; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
        <input uiColorPickerInput aria-label="Color" />
      </div>
      <div uiColorPickerSwatches aria-label="Presets">
        @for (preset of presets; track preset) {
          <button uiColorPickerSwatchItem [value]="preset"></button>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly presets = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#0ea5e9",
    "#6366f1",
    "#a855f7",
    "#ec4899",
  ]
  protected readonly formats = formats
  protected readonly format = signal<ColorFormat>("hex")
  protected readonly value = signal<string | undefined>("#0ea5e9")

  protected changeFormat(event: Event) {
    const next = (event.target as HTMLSelectElement).value as ColorFormat
    this.format.set(next)
    this.value.set(formatColor(parseColor(this.value()!)!, next))
  }
}

export { Example }
