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
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Date (en-GB)</label>
        <div
          uiDateInput
          #a="uiDateInput"
          locale="en-GB"
          defaultValue="2026-11-02"
        >
          @for (segment of a.state().segments; track segment.key) {
            @if (segment.editable) {
              <input uiDateInputSegment [segment]="segment" />
            } @else {
              <span uiDateInputSegment [segment]="segment"></span>
            }
          }
        </div>
      </div>
      <div uiField>
        <label uiFieldLabel>Datum (de-DE)</label>
        <div
          uiDateInput
          #b="uiDateInput"
          locale="de-DE"
          defaultValue="2026-11-02"
        >
          @for (segment of b.state().segments; track segment.key) {
            @if (segment.editable) {
              <input uiDateInputSegment [segment]="segment" />
            } @else {
              <span uiDateInputSegment [segment]="segment"></span>
            }
          }
        </div>
      </div>
      <div uiField>
        <label uiFieldLabel>日付 (ja-JP)</label>
        <div
          uiDateInput
          #c="uiDateInput"
          locale="ja-JP"
          defaultValue="2026-11-02"
        >
          @for (segment of c.state().segments; track segment.key) {
            @if (segment.editable) {
              <input uiDateInputSegment [segment]="segment" />
            } @else {
              <span uiDateInputSegment [segment]="segment"></span>
            }
          }
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
