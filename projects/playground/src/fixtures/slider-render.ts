import { Component, signal } from "@angular/core"
import {
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputIncrement,
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiSliderValue,
} from "ui-sdk-angular"

// Parts rendered as other elements, and from their state. One fixture covers
// Slider and Number Input.
@Component({
  selector: "app-fixture",
  imports: [
    UiNumberInput,
    UiNumberInputControl,
    UiNumberInputIncrement,
    UiSlider,
    UiSliderControl,
    UiSliderIndicator,
    UiSliderThumb,
    UiSliderTrack,
    UiSliderValue,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiSlider
        [defaultValue]="40"
        (valueChange)="action.set('brightness:' + $event)"
      >
        <output uiSliderValue #current="uiSliderValue" class="slider-value">Brightness {{ current.state().text }}</output>
        <div uiSliderControl class="slider-control">
          <div uiSliderTrack class="slider-track">
            <div uiSliderIndicator class="slider-indicator"></div>
            <span
              uiSliderThumb
              #thumb="uiSliderThumb"
              class="slider-thumb"
              aria-label="Brightness"
            >
              <span class="thumb-label">{{ thumb.state().thumbValue }}</span>
            </span>
          </div>
        </div>
      </div>
      <div uiNumberInput [defaultValue]="8" [max]="9">
        <input uiNumberInputControl aria-label="Count" />
        <button
          uiNumberInputIncrement
          #increase="uiNumberInputIncrement"
          aria-label="Increase count"
        >
          {{ increase.state().disabled ? "At most" : "More" }}
        </button>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly action = signal("")
}

export { Fixture }
