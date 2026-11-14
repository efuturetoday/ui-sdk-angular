import { Component } from "@angular/core"
import { LucideMoveHorizontal } from "@lucide/angular"
import {
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputGroup,
  UiNumberInputScrubArea,
  UiNumberInputScrubAreaCursor,
} from "@ngx-ui-sdk/core/number-input"
import { injectLog } from "../../shared/log"
import { uniqueId } from "../../shared/id"

@Component({
  selector: "app-example",
  imports: [
    LucideMoveHorizontal,
    UiNumberInput,
    UiNumberInputControl,
    UiNumberInputGroup,
    UiNumberInputScrubArea,
    UiNumberInputScrubAreaCursor,
  ],
  template: `
    <div data-slot="card" role="group" [attr.aria-labelledby]="title">
      <h3 [id]="title">Frame</h3>
      <div data-slot="grid">
        @for (field of fields; track field.label) {
          <div
            uiNumberInput
            [defaultValue]="field.defaultValue"
            [min]="field.min"
            (valueCommit)="log(field.label + ' ' + ($event.value ?? 'empty'))">
            <div uiNumberInputGroup>
              <span uiNumberInputScrubArea [pixelsPerStep]="1">
                <span aria-hidden="true">{{ field.handle }}</span>
                <span *uiNumberInputScrubAreaCursor>
                  <svg lucideMoveHorizontal aria-hidden="true"></svg>
                </span>
              </span>
              <input uiNumberInputControl [attr.aria-label]="field.label" />
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly fields: {
    label: string
    handle: string
    defaultValue: number
    min?: number
  }[] = [
    { label: "X position", handle: "X", defaultValue: 120 },
    { label: "Y position", handle: "Y", defaultValue: 48 },
    { label: "Width", handle: "W", defaultValue: 320, min: 0 },
    { label: "Height", handle: "H", defaultValue: 240, min: 0 },
  ]
  protected readonly log = injectLog()
  protected readonly title = uniqueId()
}

export { Example }
