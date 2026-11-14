import { Component } from "@angular/core"
import {
  createDateInputController,
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
      <div data-slot="controls">
        <button type="button" (click)="publish.setValue('2026-12-25')">
          Christmas
        </button>
        <button type="button" (click)="publish.focus('year')">Edit Year</button>
        <button type="button" (click)="publish.clear()">Clear</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Publish on</label>
        <div uiDateInput #d="uiDateInput" [controller]="publish">
          @for (segment of d.state().segments; track segment.key) {
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
class Example {
  protected readonly publish = createDateInputController()
}

export { Example }
