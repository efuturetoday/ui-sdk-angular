import { Component } from "@angular/core"
import { UiDateInput, UiDateInputSegment } from "@ngx-ui-sdk/core/date-input"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"

@Component({
  selector: "app-example",
  imports: [UiDateInput, UiDateInputSegment, UiField, UiFieldLabel],
  template: `
    <div uiField>
      <label uiFieldLabel>Start date</label>
      <div uiDateInput #d="uiDateInput">
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
