import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import {
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiSliderValue,
} from "@ngx-ui-sdk/core/slider"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiField,
    UiFieldDescription,
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
      <div uiSlider [defaultValue]="50" disabled>
        <div data-slot="row">
          <label uiFieldLabel>Brightness</label>
          <output uiSliderValue uiText></output>
        </div>
        <div uiSliderControl>
          <div uiSliderTrack>
            <div uiSliderIndicator></div>
            <div uiSliderThumb></div>
          </div>
        </div>
      </div>
      <p uiFieldDescription>Managed by your organization.</p>
    </div>
  `,
})
class Example {}

export { Example }
