import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiSliderValue,
} from "@ngx-ui-sdk/core/slider"

type Format = {
  label: string
  defaultValue: number
  max: number
  step: number
  format: Intl.NumberFormatOptions | ((value: number) => string)
  locale?: string
}

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiField,
    UiFieldLabel,
    UiSlider,
    UiSliderControl,
    UiSliderIndicator,
    UiSliderThumb,
    UiSliderTrack,
    UiSliderValue,
  ],
  template: `
    <div data-slot="stack">
      @for (slider of sliders; track slider.label) {
        <div uiField>
          <div
            uiSlider
            [defaultValue]="slider.defaultValue"
            [max]="slider.max"
            [step]="slider.step"
            [format]="slider.format"
            [locale]="slider.locale"
          >
            <div data-slot="row">
              <label uiFieldLabel>{{ slider.label }}</label>
              <output uiSliderValue uiText></output>
            </div>
            <div uiSliderControl>
              <div uiSliderTrack>
                <div uiSliderIndicator></div>
                <div uiSliderThumb></div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly sliders: Format[] = [
    {
      label: "Budget",
      defaultValue: 40,
      max: 100,
      step: 1,
      format: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
    },
    {
      label: "Opacity",
      defaultValue: 0.6,
      max: 1,
      step: 0.01,
      format: { style: "percent" },
    },
    {
      label: "Weight",
      defaultValue: 20,
      max: 50,
      step: 0.5,
      format: { style: "unit", unit: "kilogram" },
    },
    {
      label: "Duration",
      defaultValue: 90,
      max: 600,
      step: 15,
      format: (seconds: number) =>
        `${Math.floor(seconds / 60)} min ${seconds % 60} s`,
    },
    {
      label: "Preis",
      defaultValue: 40,
      max: 100,
      step: 1,
      format: { style: "currency", currency: "EUR" },
      locale: "de-DE",
    },
  ]
}

export { Example }
