import { UiText } from "@ngx-ui-sdk/core"
import { Component } from "@angular/core"
import {
  UiProgress,
  UiProgressIndicator,
  UiProgressLabel,
  UiProgressTrack,
  UiProgressValue,
} from "@ngx-ui-sdk/core/progress"

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
    <div uiProgress [value]="60">
      <span uiProgressLabel>Exporting video</span>
      <span uiProgressValue uiText></span>
      <div uiProgressTrack><div uiProgressIndicator></div></div>
    </div>
  `,
})
class Example {}

export { Example }
