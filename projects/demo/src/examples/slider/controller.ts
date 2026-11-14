import { Component } from "@angular/core"
import {
  createSliderController,
  UiField,
  UiFieldLabel,
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiSliderValue,
} from "ngx-ui-sdk"
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
        <button type="button" (click)="volume.setValue(0)">Mute</button>
        <button type="button" (click)="volume.setValue(volume.getValue() + 10)">
          Louder
        </button>
        <button type="button" (click)="log('Volume is ' + volume.getValue())">
          Read
        </button>
        <button type="button" (click)="volume.focus()">Focus</button>
      </div>
      <div uiField>
        <div
          uiSlider
          [defaultValue]="40"
          [controller]="volume"
          (beforeValueChange)="
            log('Volume ' + $event.value + ' (' + $event.details.reason + ')')
          "
        >
          <div data-slot="row">
            <label uiFieldLabel>Volume</label>
            <output uiSliderValue></output>
          </div>
          <div uiSliderControl>
            <div uiSliderTrack>
              <div uiSliderIndicator></div>
              <div uiSliderThumb></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly volume = createSliderController<number>()
}

export { Example }
