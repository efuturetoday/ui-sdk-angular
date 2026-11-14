import { Component } from "@angular/core"
import {
  UiField,
  UiFieldLabel,
  UiTimeInput,
  UiTimeInputSegment,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiField, UiFieldLabel, UiTimeInput, UiTimeInputSegment],
  template: `
    <div uiField>
      <label uiFieldLabel>Meeting time</label>
      <div uiTimeInput #d="uiTimeInput" defaultValue="09:30">
        @for (segment of d.state().segments; track segment.key) {
          @if (segment.editable) {
            <input uiTimeInputSegment [segment]="segment" />
          } @else {
            <span uiTimeInputSegment [segment]="segment"></span>
          }
        }
      </div>
    </div>
  `,
})
class Example {}

export { Example }
