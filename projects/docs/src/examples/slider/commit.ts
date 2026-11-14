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
import { injectLog } from "../../shared/log"

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
    <div uiField>
      <div
        uiSlider
        [defaultValue]="50"
        (valueCommit)="
          log('Saved ' + $event.value + ' (' + $event.details.reason + ')')
        "
      >
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
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
}

export { Example }
