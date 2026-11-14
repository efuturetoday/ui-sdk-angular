import { Component, signal } from "@angular/core"
import { progressFixture } from "tests/fixtures/progress"
import {
  UiProgress,
  UiProgressIndicator,
  UiProgressLabel,
  UiProgressTrack,
  UiProgressValue,
} from "@ngx-ui-sdk/core/progress"

const { upload, loading, files, disk } = progressFixture

@Component({
  selector: "app-fixture",
  imports: [
    UiProgress,
    UiProgressIndicator,
    UiProgressLabel,
    UiProgressTrack,
    UiProgressValue,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiProgress class="gauge" [value]="value()">
        <span uiProgressLabel>{{ upload.label }}</span>
        <span uiProgressValue class="gauge-value"></span>
        <div uiProgressTrack class="gauge-track"><div uiProgressIndicator class="gauge-indicator"></div></div>
      </div>
      <div uiProgress class="gauge" [value]="null">
        <span uiProgressLabel>{{ loading.label }}</span>
        <span uiProgressValue class="gauge-value"></span>
        <div uiProgressTrack class="gauge-track"><div uiProgressIndicator class="gauge-indicator"></div></div>
      </div>
      <div uiProgress class="gauge" [value]="files.value" [max]="files.max" [getValueLabel]="filesLabel">
        <span uiProgressLabel>{{ files.label }}</span>
        <span uiProgressValue class="gauge-value"></span>
        <div uiProgressTrack class="gauge-track"><div uiProgressIndicator class="gauge-indicator"></div></div>
      </div>
      <div uiProgress class="gauge" [value]="disk.value" [max]="disk.max" [format]="disk.format">
        <span uiProgressLabel>{{ disk.label }}</span>
        <span uiProgressValue class="gauge-value"></span>
        <div uiProgressTrack class="gauge-track"><div uiProgressIndicator class="gauge-indicator"></div></div>
      </div>
      <button (click)="value.set(min(100, value() + upload.step))">Advance</button>
      <button (click)="value.set(upload.value)">Restart</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `,
})
class Fixture {
  protected readonly upload = upload
  protected readonly loading = loading
  protected readonly files = files
  protected readonly disk = disk
  protected readonly value = signal(upload.value)
  protected readonly min = Math.min
  protected readonly filesLabel = (value: number | null) =>
    files.valueLabel(value!)
}

export { Fixture }
