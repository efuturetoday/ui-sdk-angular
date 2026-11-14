import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import { UiTimeInput, UiTimeInputSegment } from "@ngx-ui-sdk/core/time-input"

@Component({
  selector: "app-example",
  imports: [UiText, UiField, UiFieldLabel, UiTimeInput, UiTimeInputSegment],
  template: `
    <div uiField>
      <label uiFieldLabel>Meeting time</label>
      <div uiTimeInput #d="uiTimeInput" defaultValue="09:30">
        @for (segment of d.state().segments; track segment.key) {
          @if (segment.editable) {
            <input uiTimeInputSegment [segment]="segment" />
          } @else {
            <span uiTimeInputSegment [segment]="segment" uiText></span>
          }
        }
      </div>
    </div>
  `,
})
class Example {}

export { Example }
