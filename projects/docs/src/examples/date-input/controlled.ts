import { UiText } from "@ngx-ui-sdk/core"
import { Component, signal } from "@angular/core"
import { UiDateInput, UiDateInputSegment } from "@ngx-ui-sdk/core/date-input"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiText, UiDateInput, UiDateInputSegment, UiField, UiFieldLabel],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="value.set(null)">Clear</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Due date</label>
        <div
          uiDateInput
          #d="uiDateInput"
          [(value)]="value"
          (beforeValueChange)="log('Due date ' + ($event.value ?? 'empty'))">
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
  protected readonly log = injectLog()
  protected readonly value = signal<string | null | undefined>("2026-11-02")
}

export { Example }
