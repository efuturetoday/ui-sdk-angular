import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { UiDateInput, UiDateInputSegment } from "@ngx-ui-sdk/core/date-input"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"

@Component({
  selector: "app-example",
  imports: [UiText, UiDateInput, UiDateInputSegment, UiField, UiFieldLabel],
  template: `
    <div uiField>
      <label uiFieldLabel>Signed on</label>
      <div uiDateInput #d="uiDateInput" defaultValue="2026-11-02" readOnly>
        @for (segment of d.state().segments; track segment.key) {
          @if (segment.editable) {
            <input uiDateInputSegment [segment]="segment" />
          } @else {
            <span uiDateInputSegment [segment]="segment" uiText></span>
          }
        }
      </div>
    </div>
  `,
})
class Example {}

export { Example }
