import { Component } from "@angular/core"
import type { GaugeLabelDetails } from "ngx-ui-sdk"
import {
  UiProgress,
  UiProgressIndicator,
  UiProgressLabel,
  UiProgressTrack,
  UiProgressValue,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiProgress,
    UiProgressIndicator,
    UiProgressLabel,
    UiProgressTrack,
    UiProgressValue,
  ],
  template: `
    <div uiProgress [value]="3" [max]="12" [getValueLabel]="valueLabel">
      <span uiProgressLabel>Copying files</span>
      <span uiProgressValue>3 of 12</span>
      <div uiProgressTrack><div uiProgressIndicator></div></div>
    </div>
  `,
})
class Example {
  protected readonly valueLabel = (
    value: number | null,
    details: GaugeLabelDetails
  ) => `${value} of ${details.max} files, ${details.formatted}`
}

export { Example }
