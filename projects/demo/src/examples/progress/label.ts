import { Component } from "@angular/core"
import {
  UiProgress,
  UiProgressIndicator,
  UiProgressLabel,
  UiProgressTrack,
  UiProgressValue,
} from "ui-sdk-angular"

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
    <div uiProgress [value]="56">
      <span uiProgressLabel>Upload progress</span>
      <span uiProgressValue></span>
      <div uiProgressTrack><div uiProgressIndicator></div></div>
    </div>
  `,
})
class Example {}

export { Example }
