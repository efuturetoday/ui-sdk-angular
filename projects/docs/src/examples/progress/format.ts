import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { type NumberFormat } from "@ngx-ui-sdk/core/meter"
import {
  UiProgress,
  UiProgressIndicator,
  UiProgressLabel,
  UiProgressTrack,
  UiProgressValue,
} from "@ngx-ui-sdk/core/progress"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiProgress,
    UiProgressIndicator,
    UiProgressLabel,
    UiProgressTrack,
    UiProgressValue,
  ],
  template: `
    <div data-slot="stack">
      @for (b of bars; track b.label) {
        <div
          uiProgress
          [value]="b.value"
          [max]="b.max"
          [format]="b.format"
          [locale]="b.locale">
          <span uiProgressLabel>{{ b.label }}</span>
          <span uiProgressValue uiText></span>
          <div uiProgressTrack><div uiProgressIndicator></div></div>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly bars: {
    label: string
    value: number
    max?: number
    format?: NumberFormat
    locale?: string
  }[] = [
    {
      label: "Download",
      value: 120,
      max: 250,
      format: { style: "unit", unit: "gigabyte" },
    },
    {
      label: "Video render",
      value: 87.25,
      format: { style: "percent", maximumFractionDigits: 1 },
    },
    {
      label: "Backup",
      value: 45,
      max: 60,
      format: (minutes: number) => `${60 - minutes} min left`,
    },
    { label: "Synchronisierung", value: 40, locale: "de-DE" },
  ]
}

export { Example }
