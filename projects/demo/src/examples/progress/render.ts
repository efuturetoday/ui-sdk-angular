import { Component } from "@angular/core"
import {
  UiProgress,
  UiProgressIndicator,
  UiProgressLabel,
  UiProgressTrack,
  UiProgressValue,
} from "ngx-ui-sdk/progress"

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
    <div uiProgress [value]="18">
      <span uiProgressLabel>Battery</span>
      <span uiProgressValue #value="uiProgressValue">
        {{
          value.state().status === "complete"
            ? "Charged"
            : value.state().text + " charged"
        }}
      </span>
      <span uiProgressTrack
        ><div
          uiProgressIndicator
          #indicator="uiProgressIndicator"
          [attr.data-variant]="
            (indicator.state().percent ?? 0) < 20 ? 'destructive' : undefined
          "
        ></div
      ></span>
    </div>
  `,
})
class Example {}

export { Example }
