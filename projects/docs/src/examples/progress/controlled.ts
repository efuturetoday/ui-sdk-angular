import { UiText } from "@ngx-ui-sdk/core"
import { Component, signal } from "@angular/core"
import {
  UiProgress,
  UiProgressIndicator,
  UiProgressLabel,
  UiProgressTrack,
  UiProgressValue,
} from "@ngx-ui-sdk/core/progress"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    UiProgress,
    UiProgressIndicator,
    UiProgressLabel,
    UiProgressTrack,
    UiProgressValue,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          type="button"
          [attr.aria-disabled]="uploaded() >= total"
          (click)="uploadNext()"
        >
          Upload Next
        </button>
        <button type="button" (click)="reset()">Reset</button>
      </div>
      <div uiProgress [value]="(uploaded() / total) * 100">
        <span uiProgressLabel>Uploading photos</span>
        <span uiProgressValue uiText></span>
        <div uiProgressTrack><div uiProgressIndicator></div></div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly total = 5
  protected readonly log = injectLog()
  protected readonly uploaded = signal(1)

  protected uploadNext() {
    if (this.uploaded() >= this.total) {
      return
    }
    this.uploaded.update((uploaded) => uploaded + 1)
    this.log(`Uploaded ${this.uploaded()} of ${this.total} photos`)
  }

  protected reset() {
    this.uploaded.set(0)
    this.log("Reset to 0 photos")
  }
}

export { Example }
