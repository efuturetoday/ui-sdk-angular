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
    <div data-slot="stack">
      <div uiField>
        <div
          uiSlider
          [defaultValue]="2010"
          [min]="1990"
          [max]="2030"
          [step]="5"
          [format]="{ useGrouping: false }"
        >
          <div data-slot="row">
            <label uiFieldLabel>Year</label>
            <output uiSliderValue></output>
          </div>
          <div uiSliderControl>
            <div uiSliderTrack>
              <div uiSliderIndicator></div>
              <div uiSliderThumb></div>
            </div>
          </div>
          <div data-slot="ticks" aria-hidden="true">
            @for (tick of ticks(9); track tick) {
              <span></span>
            }
          </div>
        </div>
      </div>
      <div uiField>
        <div uiSlider [defaultValue]="0.5" [min]="0" [max]="1" [step]="0.05">
          <div data-slot="row">
            <label uiFieldLabel>Opacity</label>
            <output uiSliderValue></output>
          </div>
          <div uiSliderControl>
            <div uiSliderTrack>
              <div uiSliderIndicator></div>
              <div uiSliderThumb></div>
            </div>
          </div>
          <div data-slot="ticks" aria-hidden="true">
            @for (tick of ticks(21); track tick) {
              <span></span>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected ticks(count: number) {
    return Array.from({ length: count }, (_, index) => index + 1)
  }
}

export { Example }
