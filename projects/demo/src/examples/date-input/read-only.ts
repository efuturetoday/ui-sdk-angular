import { Component } from "@angular/core"
import {
  UiDateInput,
  UiDateInputSegment,
  UiField,
  UiFieldLabel,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiDateInput, UiDateInputSegment, UiField, UiFieldLabel],
  template: `
    <div uiField>
      <label uiFieldLabel>Signed on</label>
      <div uiDateInput #d="uiDateInput" defaultValue="2026-11-02" readOnly>
        @for (segment of d.state().segments; track segment.key) {
          @if (segment.editable) {
            <input uiDateInputSegment [segment]="segment" />
          } @else {
            <span uiDateInputSegment [segment]="segment"></span>
          }
        }
      </div>
    </div>
  `,
})
class Example {}

export { Example }
