import { Component } from "@angular/core"
import {
  createTokenInputController,
  type Token,
  type TokenInputValue,
  UiField,
  UiFieldLabel,
  UiTokenInput,
  UiTokenInputEditor,
} from "ui-sdk-angular"

const loadFile = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

@Component({
  selector: "app-example",
  imports: [UiField, UiFieldLabel, UiTokenInput, UiTokenInputEditor],
  template: `
    <div data-slot="stack">
      <div data-slot="controls" (mousedown)="$event.preventDefault()">
        <button type="button" (click)="attachFile()">Attach File</button>
        <button type="button" (click)="showPath()">Show Path</button>
        <button type="button" (click)="removeFirst()">Remove First</button>
        <button type="button" (click)="prompt.undo()">Undo</button>
        <button type="button" (click)="prompt.clear()">Clear</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Prompt</label>
        <ng-container uiTokenInput [controller]="prompt" [defaultValue]="draft">
          <div uiTokenInputEditor></div>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {
  protected readonly draft: TokenInputValue = [
    "Compare ",
    { type: "file", value: "src/routes.ts", label: "routes.ts" },
    " with ",
  ]
  protected readonly prompt = createTokenInputController()

  #firstToken() {
    return this.prompt
      .getValue()
      .find((segment): segment is Token => typeof segment !== "string")
  }

  protected attachFile() {
    this.prompt.insert(
      { type: "file", value: "package.json", label: "package.json" },
      { at: "end", resolve: loadFile() }
    )
  }

  protected showPath() {
    const token = this.#firstToken()
    if (token) {
      this.prompt.updateToken(token.id!, { label: token.value })
    }
  }

  protected removeFirst() {
    const token = this.#firstToken()
    if (token) {
      this.prompt.removeToken(token.id!)
    }
  }
}

export { Example }
