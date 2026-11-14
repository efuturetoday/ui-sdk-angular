import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
} from "ngx-ui-sdk/checkbox"
import {
  UiResizable,
  UiResizableHandle,
  UiResizablePanel,
} from "ngx-ui-sdk/resizable"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiResizable,
    UiResizableHandle,
    UiResizablePanel,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <label data-slot="label">
          <button
            uiCheckbox
            #lock="uiCheckbox"
            [checked]="locked()"
            (checkedChange)="locked.set($event === true)"
          >
            <span *uiCheckboxIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </button>
          <input [uiCheckboxInput]="lock" />
          Lock layout
        </label>
      </div>
      <div uiResizable [disabled]="locked()">
        <div uiResizablePanel [minSize]="15">
          <h3>Pinned</h3>
          <span data-slot="hint">2 notes</span>
        </div>
        <div uiResizableHandle disabled aria-label="Resize pinned"></div>
        <div uiResizablePanel [minSize]="15">
          <h3>Inbox</h3>
          <span data-slot="hint">3 unread</span>
        </div>
        <div uiResizableHandle aria-label="Resize inbox"></div>
        <div uiResizablePanel [minSize]="15">
          <h3>Message</h3>
          <span data-slot="hint">From Kofi Mensah</span>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly locked = signal(false)
}

export { Example }
