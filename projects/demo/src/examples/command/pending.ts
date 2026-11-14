import { Component } from "@angular/core"
import { LucideLoaderCircle } from "@lucide/angular"
import {
  UiCommand,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

@Component({
  selector: "app-example",
  imports: [
    LucideLoaderCircle,
    UiCommand,
    UiCommandInput,
    UiCommandItem,
    UiCommandList,
  ],
  template: `
    <div data-slot="stack">
      <div uiCommand>
        <input
          uiCommandInput
          aria-label="Search actions"
          placeholder="Search actions…"
        />
        <div uiCommandList>
          <div
            uiCommandItem
            #deployItem="uiCommandItem"
            value="deploy"
            [onSelect]="deploy"
          >
            Deploy to production
            @if (deployItem.state().pending) {
              <svg
                lucideLoaderCircle
                data-slot="spinner"
                aria-hidden="true"
              ></svg>
            }
          </div>
          <div
            uiCommandItem
            #syncItem="uiCommandItem"
            value="sync"
            [onSelect]="sync"
          >
            Sync with server
            @if (syncItem.state().pending) {
              <svg
                lucideLoaderCircle
                data-slot="spinner"
                aria-hidden="true"
              ></svg>
            } @else if (syncItem.state().error !== undefined) {
              <span data-slot="hint">Failed, try again</span>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()

  protected readonly deploy = async () => {
    await wait(1200)
    this.log("Deployed to production")
  }

  protected readonly sync = async () => {
    await wait(600)
    this.log("Couldn't sync: offline")
    throw new Error("Offline")
  }
}

export { Example }
