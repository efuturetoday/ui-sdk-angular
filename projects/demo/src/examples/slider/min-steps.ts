import { Component } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiSliderValue,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [
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
    <div uiField>
      <div
        uiSlider
        [defaultValue]="[540, 1020]"
        [min]="0"
        [max]="1440"
        [step]="15"
        [minStepsBetweenThumbs]="16"
        [format]="time"
      >
        <div data-slot="row">
          <label uiFieldLabel>Opening hours</label>
          <output uiSliderValue></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <div uiSliderThumb [index]="0" aria-label="Opens"></div>
            <div uiSliderThumb [index]="1" aria-label="Closes"></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly time = (minutes: number) =>
    `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`
}

export { Example }
