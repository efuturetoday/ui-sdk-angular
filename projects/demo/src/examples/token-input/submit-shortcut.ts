import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "ngx-ui-sdk/field"
import {
  toLabel,
  type TokenInputValue,
  UiTokenInput,
  UiTokenInputEditor,
} from "ngx-ui-sdk/token-input"
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
