import { Component, signal } from "@angular/core"
import {
  UiMeter,
  UiMeterIndicator,
  UiMeterTrack,
  UiMeterValue,
} from "ngx-ui-sdk/meter"

// Parts rendered as other elements, and from their state.
@Component({
  selector: "app-fixture",
  imports: [UiMeter, UiMeterIndicator, UiMeterTrack, UiMeterValue],
  template: `
    <div class="fixture">
      <button>Before</button>
      <section
        uiMeter
        #meter="uiMeter"
        [value]="value()"
        aria-label="Memory"
        [class]="'gauge ' + (meter.state().percent >= 80 ? 'is-high' : 'is-ok')"
      >
        <span uiMeterValue #current="uiMeterValue">{{ current.state().text }} used</span>
        <div uiMeterTrack class="gauge-track"><div uiMeterIndicator class="gauge-indicator"></div></div>
      </section>
      <button (click)="value.set(90)">Fill</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `,
})
class Fixture {
  protected readonly value = signal(40)
}

export { Fixture }
