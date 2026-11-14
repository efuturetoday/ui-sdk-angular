import { Component, signal } from "@angular/core"
import { segmentedControlOptions } from "tests/fixtures/page"
import { segmentedControlFixture } from "tests/fixtures/segmented-control"
import {
  createSegmentedControlController,
  UiSegmentedControl,
  UiSegmentedControlIndicator,
  UiSegmentedControlInput,
  UiSegmentedControlItem,
} from "@ngx-ui-sdk/core/segmented-control"

@Component({
  selector: "app-fixture",
  imports: [
    UiSegmentedControl,
    UiSegmentedControlIndicator,
    UiSegmentedControlInput,
    UiSegmentedControlItem,
  ],
  template: `
    <form class="fixture" (submit)="onSubmit($event)">
      <button type="button">Before</button>
      <div
        uiSegmentedControl
        [attr.aria-label]="fixture.label"
        [name]="fixture.name"
        [defaultValue]="options.defaultValue"
        [disabled]="options.disabled"
        [orientation]="options.orientation"
        [controller]="controller"
        (beforeValueChange)="onValueChange($event)"
      >
        <span uiSegmentedControlIndicator></span>
        @for (item of fixture.items; track item.value) {
          <button uiSegmentedControlItem #segment="uiSegmentedControlItem" [value]="item.value" [disabled]="item.disabled">
            {{ item.label }}
          </button>
          <input [uiSegmentedControlInput]="segment" />
        }
      </div>
      <button type="button">After</button>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button type="button" (click)="controller.setValue('calendar')">Show calendar</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Submitted">{{ submitted() }}</output>
    </form>
  `,
})
class Fixture {
  protected readonly fixture = segmentedControlFixture
  protected readonly controller = createSegmentedControlController()
  protected readonly options = segmentedControlOptions()
  protected readonly action = signal("")
  protected readonly submitted = signal("")

  protected onValueChange({
    value,
    details,
  }: {
    value: string | null
    details: { reason: string; cancel: () => void }
  }) {
    if (value === this.options.cancel) {
      return details.cancel()
    }
    this.action.set(`${value}:${details.reason}`)
  }

  protected onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    this.submitted.set(
      Array.from(
        new FormData(form),
        ([key, value]) => `${key}=${value}`
      ).join("&")
    )
  }
}

export { Fixture }
