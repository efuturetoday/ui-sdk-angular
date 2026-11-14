import { Component, signal } from "@angular/core"
import { serialize, sliderFixture as f, sliderOptions } from "tests/fixtures/slider"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
  UiSlider,
  UiSliderControl,
  UiSliderIndicator,
  UiSliderThumb,
  UiSliderTrack,
  UiSliderValue,
} from "ngx-ui-sdk"

type Value = number | number[]

@Component({
  selector: "app-fixture",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiSlider,
    UiSliderControl,
    UiSliderIndicator,
    UiSliderThumb,
    UiSliderTrack,
    UiSliderValue,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        <div uiField>
          <label uiFieldLabel>{{ f.volume.label }}</label>
          <div
            uiSlider
            [orientation]="o.orientation"
            [disabled]="o.disabled"
            [largeStep]="o.largeStep"
            [locale]="o.locale"
            [name]="f.volume.name"
            [format]="o.volumeFormat"
            [value]="o.controlled ? volume() : undefined"
            [defaultValue]="o.controlled ? undefined : o.volume"
            (beforeValueChange)="report(f.volume.name, $event.value, $event.details)"
            (valueChange)="volume.set($event)"
            (valueCommit)="commit(f.volume.name, $event.value)"
          >
            <output uiSliderValue class="slider-value"></output>
            <div uiSliderControl class="slider-control">
              <div uiSliderTrack class="slider-track">
                <div uiSliderIndicator class="slider-indicator"></div>
                <div uiSliderThumb class="slider-thumb"></div>
              </div>
            </div>
          </div>
          <p uiFieldDescription>{{ f.volume.description }}</p>
        </div>

        <div uiField>
          <label uiFieldLabel>{{ f.price.label }}</label>
          <div
            uiSlider
            [orientation]="o.orientation"
            [disabled]="o.disabled"
            [largeStep]="o.largeStep"
            [locale]="o.locale"
            [name]="f.price.name"
            [defaultValue]="o.price"
            [minStepsBetweenThumbs]="o.minSteps"
            [format]="o.format"
            (beforeValueChange)="report(f.price.name, $event.value, $event.details)"
            (valueCommit)="commit(f.price.name, $event.value)"
          >
            <output uiSliderValue class="slider-value"></output>
            <div uiSliderControl class="slider-control">
              <div uiSliderTrack class="slider-track">
                <div uiSliderIndicator class="slider-indicator"></div>
                @for (label of f.price.thumbs; track label; let index = $index) {
                  <div
                    uiSliderThumb
                    class="slider-thumb"
                    [index]="index"
                    [attr.aria-label]="label"
                  ></div>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Committed">{{ commits().join(" ") }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly o = sliderOptions()
  protected readonly action = signal("")
  protected readonly commits = signal<string[]>([])
  protected readonly submitted = signal("")
  protected readonly volume = signal<Value>(this.o.volume)

  // Records a change, or cancels it when the URL asks.
  protected report(name: string, value: Value, details: { cancel: () => void }) {
    if (this.o.cancel === name) {
      return details.cancel()
    }
    this.action.set(`${name}:${String(value)}`)
  }

  protected commit(name: string, value: Value) {
    this.commits.set([...this.commits(), `${name}:${String(value)}`])
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(serialize(event.currentTarget as HTMLFormElement))
  }
}

export { Fixture }
