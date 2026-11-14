import { Component, signal } from "@angular/core"
import {
  UiDateInput,
  UiDateInputSegment,
  UiField,
  UiFieldLabel,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiDateInput, UiDateInputSegment, UiField, UiFieldLabel],
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
          (beforeValueChange)="log('Due date ' + ($event.value ?? 'empty'))"
        >
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
  protected readonly log = injectLog()
  protected readonly value = signal<string | null | undefined>("2026-11-02")
}

export { Example }
