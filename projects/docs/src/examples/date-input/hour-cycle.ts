import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import { UiTimeInput, UiTimeInputSegment } from "@ngx-ui-sdk/core/time-input"

@Component({
  selector: "app-example",
  imports: [UiField, UiFieldLabel, UiTimeInput, UiTimeInputSegment],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>12-hour clock</label>
        <div uiTimeInput #a="uiTimeInput" [hourCycle]="12" defaultValue="18:45">
          @for (segment of a.state().segments; track segment.key) {
            @if (segment.editable) {
              <input uiTimeInputSegment [segment]="segment" />
            } @else {
              <span uiTimeInputSegment [segment]="segment"></span>
            }
          }
        </div>
      </div>
      <div uiField>
        <label uiFieldLabel>24-hour clock</label>
        <div uiTimeInput #b="uiTimeInput" [hourCycle]="24" defaultValue="18:45">
          @for (segment of b.state().segments; track segment.key) {
            @if (segment.editable) {
              <input uiTimeInputSegment [segment]="segment" />
            } @else {
              <span uiTimeInputSegment [segment]="segment"></span>
            }
          }
        </div>
      </div>
      <div uiField>
        <label uiFieldLabel>With seconds</label>
        <div
          uiTimeInput
          #c="uiTimeInput"
          granularity="second"
          [hourCycle]="24"
          defaultValue="18:45:30"
        >
          @for (segment of c.state().segments; track segment.key) {
            @if (segment.editable) {
              <input uiTimeInputSegment [segment]="segment" />
            } @else {
              <span uiTimeInputSegment [segment]="segment"></span>
            }
          }
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
