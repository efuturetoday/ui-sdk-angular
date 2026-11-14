import { Component, signal } from "@angular/core"
import { meterFixture } from "tests/fixtures/meter"
import {
  UiMeter,
  UiMeterIndicator,
  UiMeterLabel,
  UiMeterTrack,
  UiMeterValue,
} from "ngx-ui-sdk"

const { storage, requests, disk, score } = meterFixture

@Component({
  selector: "app-fixture",
  imports: [UiMeter, UiMeterIndicator, UiMeterLabel, UiMeterTrack, UiMeterValue],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiMeter class="gauge" [value]="value()">
        <span uiMeterLabel>{{ storage.label }}</span>
        <span uiMeterValue class="gauge-value"></span>
        <div uiMeterTrack class="gauge-track"><div uiMeterIndicator class="gauge-indicator"></div></div>
      </div>
      <div uiMeter class="gauge" [value]="requests.value" [max]="requests.max" [getValueLabel]="requests.valueLabel">
        <span uiMeterLabel>{{ requests.label }}</span>
        <span uiMeterValue class="gauge-value"></span>
        <div uiMeterTrack class="gauge-track"><div uiMeterIndicator class="gauge-indicator"></div></div>
      </div>
      <div uiMeter class="gauge" [value]="disk.value" [max]="disk.max" [format]="disk.format">
        <span uiMeterLabel>{{ disk.label }}</span>
        <span uiMeterValue class="gauge-value"></span>
        <div uiMeterTrack class="gauge-track"><div uiMeterIndicator class="gauge-indicator"></div></div>
      </div>
      <div uiMeter class="gauge" [value]="score.value" [min]="score.min" [max]="score.max">
        <span uiMeterLabel>{{ score.label }}</span>
        <span uiMeterValue class="gauge-value"></span>
        <div uiMeterTrack class="gauge-track"><div uiMeterIndicator class="gauge-indicator"></div></div>
      </div>
      <button (click)="value.set(value() + storage.step)">Fill</button>
      <button (click)="value.set(storage.value)">Reset</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `,
})
class Fixture {
  protected readonly storage = storage
  protected readonly requests = requests
  protected readonly disk = disk
  protected readonly score = score
  protected readonly value = signal(storage.value)
}

export { Fixture }
