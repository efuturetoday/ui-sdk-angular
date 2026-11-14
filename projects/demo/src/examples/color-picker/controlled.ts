import { Component, signal } from "@angular/core"
import {
  createColorPickerController,
  UiColorPicker,
  UiColorPickerArea,
  UiColorPickerAreaThumb,
  UiColorPickerInput,
  UiColorPickerSlider,
  UiColorPickerSliderThumb,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

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
    <div>
      <div data-slot="controls">
        <button type="button" (click)="picker.setValue('#663399')">
          Use Purple
        </button>
      </div>
      <div
        uiColorPicker
        [(value)]="value"
        aria-label="Theme color"
        [controller]="picker"
        (valueCommit)="
          log('committed: ' + $event.value + ' (' + $event.details.reason + ')')
        "
      >
        <div uiColorPickerArea>
          <div uiColorPickerAreaThumb></div>
        </div>
        <div uiColorPickerSlider channel="hue">
          <div uiColorPickerSliderThumb></div>
        </div>
        <input uiColorPickerInput aria-label="Hex" />
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly picker = createColorPickerController()
  protected readonly value = signal<string | undefined>("#0ea5e9")
}

export { Example }
