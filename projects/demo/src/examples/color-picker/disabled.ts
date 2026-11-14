import { Component } from "@angular/core"
import {
  UiColorPicker,
  UiColorPickerArea,
  UiColorPickerAreaThumb,
  UiColorPickerInput,
  UiColorPickerSlider,
  UiColorPickerSliderThumb,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiColorPicker,
    UiColorPickerArea,
    UiColorPickerAreaThumb,
    UiColorPickerInput,
    UiColorPickerSlider,
    UiColorPickerSliderThumb,
  ],
  template: `
    <div uiColorPicker aria-label="Brand color" defaultValue="#0ea5e9" disabled>
      <div uiColorPickerArea>
        <div uiColorPickerAreaThumb></div>
      </div>
      <div uiColorPickerSlider channel="hue">
        <div uiColorPickerSliderThumb></div>
      </div>
      <input uiColorPickerInput aria-label="Hex" />
    </div>
  `,
})
class Example {}

export { Example }
