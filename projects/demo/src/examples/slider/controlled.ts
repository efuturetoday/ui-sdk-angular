import { Component, signal } from "@angular/core"
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
import { injectLog } from "../../shared/log"

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
      <div data-slot="controls">
        <button type="button" (click)="value.set([0.3, 0.7])">Reset</button>
      </div>
      <div uiField>
        <div
          uiSlider
          [(value)]="value"
          [min]="0"
          [max]="1"
          [step]="0.1"
          (beforeValueChange)="
            log(
              $any($event.value).join(' – ') +
                ' (' +
                $event.details.reason +
                ')'
            )
          "
        >
          <div data-slot="row">
            <label uiFieldLabel>Temperature</label>
            <output uiSliderValue></output>
          </div>
          <div uiSliderControl>
            <div uiSliderTrack>
              <div uiSliderIndicator></div>
              <div
                uiSliderThumb
                [index]="0"
                aria-label="Minimum temperature"
              ></div>
              <div
                uiSliderThumb
                [index]="1"
                aria-label="Maximum temperature"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly value = signal<number | number[] | undefined>([0.3, 0.7])
}

export { Example }
