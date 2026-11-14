import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import { UiDateInput, UiDateInputSegment } from "@ngx-ui-sdk/core/date-input"
import { UiField, UiFieldError, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import { UiTimeInput, UiTimeInputSegment } from "@ngx-ui-sdk/core/time-input"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiDateInput,
    UiDateInputSegment,
    UiField,
    UiFieldError,
    UiFieldLabel,
    UiTimeInput,
    UiTimeInputSegment,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Date</label>
        <div
          uiDateInput
          #d="uiDateInput"
          name="date"
          defaultValue="2026-11-02"
          required>
          @for (segment of d.state().segments; track segment.key) {
            @if (segment.editable) {
              <input uiDateInputSegment [segment]="segment" />
            } @else {
              <span uiDateInputSegment [segment]="segment" uiText></span>
            }
          }
        </div>
        <div *uiFieldError uiText></div>
      </div>
      <div uiField>
        <label uiFieldLabel>Time</label>
        <div
          uiTimeInput
          #t="uiTimeInput"
          name="time"
          defaultValue="09:30"
          required>
          @for (segment of t.state().segments; track segment.key) {
            @if (segment.editable) {
              <input uiTimeInputSegment [segment]="segment" />
            } @else {
              <span uiTimeInputSegment [segment]="segment" uiText></span>
            }
          }
        </div>
        <div *uiFieldError uiText></div>
      </div>
      <div data-slot="row">
        <button type="reset">Reset</button>
        <button type="submit" data-variant="solid">Book</button>
      </div>
    </form>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`
    )
    this.log(`Submitted ${data.join(", ")}`)
  }
}

export { Example }
