import { Component } from "@angular/core"
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
    <div uiProgress [value]="3" [min]="1" [max]="5">
      <span uiProgressLabel>Account setup, step 3 of 5</span>
      <span uiProgressValue></span>
      <div uiProgressTrack><div uiProgressIndicator></div></div>
    </div>
  `,
})
class Example {}

export { Example }
