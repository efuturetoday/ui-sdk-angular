import { Component } from "@angular/core"
import {
  UiDateInput,
  UiDateInputSegment,
  UiField,
  UiFieldError,
  UiFieldLabel,
  UiTimeInput,
  UiTimeInputSegment,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
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
          required
        >
          @for (segment of d.state().segments; track segment.key) {
            @if (segment.editable) {
              <input uiDateInputSegment [segment]="segment" />
            } @else {
              <span uiDateInputSegment [segment]="segment"></span>
            }
          }
        </div>
        <div *uiFieldError></div>
      </div>
      <div uiField>
        <label uiFieldLabel>Time</label>
        <div
          uiTimeInput
          #t="uiTimeInput"
          name="time"
          defaultValue="09:30"
          required
        >
          @for (segment of t.state().segments; track segment.key) {
            @if (segment.editable) {
              <input uiTimeInputSegment [segment]="segment" />
            } @else {
              <span uiTimeInputSegment [segment]="segment"></span>
            }
          }
        </div>
        <div *uiFieldError></div>
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
