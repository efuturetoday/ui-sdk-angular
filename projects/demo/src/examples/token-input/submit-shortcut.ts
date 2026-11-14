import { Component } from "@angular/core"
import {
  toLabel,
  type TokenInputValue,
  UiField,
  UiFieldLabel,
  UiTokenInput,
  UiTokenInputEditor,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiField, UiFieldLabel, UiTokenInput, UiTokenInputEditor],
  template: `
    <div uiField>
      <label uiFieldLabel>Message</label>
      <ng-container uiTokenInput submitShortcut="mod+enter" [onSubmit]="send">
        <div uiTokenInputEditor placeholder="Write a message…"></div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly send = (value: TokenInputValue) =>
    this.log(`Sent ${toLabel(value)}`)
}

export { Example }
