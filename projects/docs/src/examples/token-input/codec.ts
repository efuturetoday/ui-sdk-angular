import { Component } from "@angular/core"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  fromText,
  toText,
  type TokenCodec,
  UiTokenInput,
  UiTokenInputEditor,
} from "@ngx-ui-sdk/core/token-input"
import { injectLog } from "../../shared/log"

const chat: TokenCodec = {
  format: (token) => `<@${token.value}>`,
  parse: (text) =>
    text.split(/(<@[\w.-]+>)/).map((part) => {
      const id = /^<@([\w.-]+)>$/.exec(part)?.[1]
      return id ? { type: "mention", value: id, label: `@${id}` } : part
    }),
}

@Component({
  selector: "app-example",
  imports: [UiField, UiFieldLabel, UiTokenInput, UiTokenInputEditor],
  template: `
    <div uiField>
      <label uiFieldLabel>Message</label>
      <ng-container
        uiTokenInput
        [codec]="chat"
        copy="label"
        [defaultValue]="draft"
        (beforeValueChange)="log(toText($event.value, chat))">
        <div uiTokenInputEditor></div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly chat = chat
  protected readonly draft = fromText(
    "Ping <@hollis> and <@ines> about the launch",
    chat
  )
  protected readonly log = injectLog()
  protected readonly toText = toText
}

export { Example }
