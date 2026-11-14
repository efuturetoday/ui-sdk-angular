import { Component } from "@angular/core"
import {
  UiColorPicker,
  UiColorPickerArea,
  UiColorPickerAreaThumb,
  UiColorPickerInput,
  UiColorPickerSlider,
  UiColorPickerSliderThumb,
  UiColorPickerSwatch,
} from "ngx-ui-sdk/color-picker"
import {
  UiPopover,
  UiPopoverContent,
  UiPopoverTrigger,
} from "ngx-ui-sdk/popover"

@Component({
  selector: "app-example",
  imports: [
    UiColorPicker,
    UiColorPickerArea,
    UiColorPickerAreaThumb,
    UiColorPickerInput,
    UiColorPickerSlider,
    UiColorPickerSliderThumb,
    UiColorPickerSwatch,
    UiPopover,
    UiPopoverContent,
    UiPopoverTrigger,
  ],
  template: `
    <div uiColorPicker aria-label="Background" defaultValue="#22c55e">
      <ng-container uiPopover>
        <button uiPopoverTrigger aria-label="Background">
          <div uiColorPickerSwatch></div>
        </button>
        <div *uiPopoverContent>
          <div uiColorPickerArea>
            <div uiColorPickerAreaThumb></div>
          </div>
          <div uiColorPickerSlider channel="hue">
            <div uiColorPickerSliderThumb></div>
          </div>
          <input uiColorPickerInput aria-label="Hex" />
        </div>
      </ng-container>
    </div>
  `,
})
class Example {}

export { Example }
