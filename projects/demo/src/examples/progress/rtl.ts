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
    <div dir="rtl">
      <div uiProgress [value]="56" locale="ar-EG">
        <span uiProgressLabel>تقدم الرفع</span>
        <span uiProgressValue></span>
        <div uiProgressTrack><div uiProgressIndicator></div></div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
