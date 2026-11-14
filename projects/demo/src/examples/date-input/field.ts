import { Component } from "@angular/core"
import {
  UiDateInput,
  UiDateInputSegment,
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiDateInput,
    UiDateInputSegment,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Birthday</label>
      <div uiDateInput #d="uiDateInput" name="birthday">
        @for (segment of d.state().segments; track segment.key) {
          @if (segment.editable) {
            <input uiDateInputSegment [segment]="segment" />
          } @else {
            <span uiDateInputSegment [segment]="segment"></span>
          }
        }
      </div>
      <p uiFieldDescription>We send a card on the day.</p>
    </div>
  `,
})
class Example {}

export { Example }
