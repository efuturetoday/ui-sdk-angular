import { Component } from "@angular/core"
import { UiButton } from "ngx-ui-sdk/button"
import { injectLog } from "../../shared/log"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

@Component({
  selector: "app-example",
  imports: [UiButton],
  template: `
    <div data-slot="stack">
      <button uiButton #button="uiButton" [action]="save">
        {{
          button.state().pending
            ? "Saving…"
            : button.state().error
              ? "Try Again"
              : "Save Changes"
        }}
      </button>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected readonly save = async () => {
    await wait(1000)
    this.log("Couldn't save. Check your connection and try again.")
    throw new Error("Couldn't save")
  }
}

export { Example }
