import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
} from "@ngx-ui-sdk/core/slider"

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
  ],
  template: `
    <div data-slot="row">
      @for (channel of channels; track channel.label) {
        <div uiField>
          <div uiSlider orientation="vertical" [defaultValue]="channel.value">
            <div uiSliderControl>
              <div uiSliderTrack>
                <div uiSliderIndicator></div>
                <div uiSliderThumb></div>
              </div>
            </div>
          </div>
          <label uiFieldLabel>{{ channel.label }}</label>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly channels = [
    { label: "Bass", value: 50 },
    { label: "Treble", value: 25 },
  ]
}

export { Example }
