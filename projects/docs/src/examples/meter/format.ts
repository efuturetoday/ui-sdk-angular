import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { type NumberFormat } from "@ngx-ui-sdk/core/meter"
import {
  UiMeter,
  UiMeterIndicator,
  UiMeterLabel,
  UiMeterTrack,
  UiMeterValue,
} from "@ngx-ui-sdk/core/meter"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiMeter,
    UiMeterIndicator,
    UiMeterLabel,
    UiMeterTrack,
    UiMeterValue,
  ],
  template: `
    <div data-slot="stack">
      @for (m of meters; track m.label) {
        <div
          uiMeter
          [value]="m.value"
          [max]="m.max"
          [format]="m.format"
          [locale]="m.locale"
        >
          <span uiMeterLabel>{{ m.label }}</span>
          <span uiMeterValue uiText></span>
          <div uiMeterTrack><div uiMeterIndicator></div></div>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly meters: {
    label: string
    value: number
    max?: number
    format?: NumberFormat
    locale?: string
  }[] = [
    {
      label: "Storage",
      value: 120,
      max: 250,
      format: { style: "unit", unit: "gigabyte" },
    },
    {
      label: "Budget",
      value: 1840,
      max: 2500,
      format: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
    },
    {
      label: "Seats",
      value: 18,
      max: 25,
      format: (seats: number) => `${seats} of 25 seats`,
    },
    { label: "Auslastung", value: 40, locale: "de-DE" },
  ]
}

export { Example }
