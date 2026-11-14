import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import {
  createDateInputController,
  UiDateInput,
  UiDateInputSegment,
} from "@ngx-ui-sdk/core/date-input"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"

@Component({
  selector: "app-example",
  imports: [UiText, UiDateInput, UiDateInputSegment, UiField, UiFieldLabel],
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
              <span uiDateInputSegment [segment]="segment" uiText></span>
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
