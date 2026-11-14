import { Component } from "@angular/core"
import {
  UiColorPicker,
  UiColorPickerArea,
  UiColorPickerAreaThumb,
  UiColorPickerSlider,
  UiColorPickerSliderThumb,
  UiColorPickerSwatch,
  UiField,
  UiFieldLabel,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiColorPicker,
    UiColorPickerArea,
    UiColorPickerAreaThumb,
    UiColorPickerSlider,
    UiColorPickerSliderThumb,
    UiColorPickerSwatch,
    UiField,
    UiFieldLabel,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Brand color</label>
        <div uiColorPicker name="brand" defaultValue="#f97316">
          <div uiColorPickerArea>
            <div uiColorPickerAreaThumb></div>
          </div>
          <div data-slot="row">
            <div uiColorPickerSwatch></div>
            <div uiColorPickerSlider channel="hue">
              <div uiColorPickerSliderThumb></div>
            </div>
          </div>
        </div>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.log(
      `Submitted brand=${new FormData(event.currentTarget as HTMLFormElement).get("brand")}`
    )
  }
}

export { Example }
