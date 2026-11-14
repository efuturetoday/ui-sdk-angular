import { Component } from "@angular/core"
import {
  UiProgress,
  UiProgressIndicator,
  UiProgressLabel,
  UiProgressTrack,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [UiProgress, UiProgressIndicator, UiProgressLabel, UiProgressTrack],
  template: `
    <div uiProgress [value]="null">
      <span uiProgressLabel>Connecting to server</span>
      <div uiProgressTrack><div uiProgressIndicator></div></div>
    </div>
  `,
})
class Example {}

export { Example }
