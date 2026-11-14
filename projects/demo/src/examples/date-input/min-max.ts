import { Component } from "@angular/core"
import {
  UiDateInput,
  UiDateInputSegment,
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiDateInput,
    UiDateInputSegment,
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Check-in</label>
      <div
        uiDateInput
        #d="uiDateInput"
        min="2026-01-01"
        max="2026-12-31"
        defaultValue="2026-06-15"
      >
        @for (segment of d.state().segments; track segment.key) {
          @if (segment.editable) {
            <input uiDateInputSegment [segment]="segment" />
          } @else {
            <span uiDateInputSegment [segment]="segment"></span>
          }
        }
      </div>
      <p uiFieldDescription>Any day in 2026.</p>
      <div *uiFieldError></div>
    </div>
  `,
})
class Example {}

export { Example }
