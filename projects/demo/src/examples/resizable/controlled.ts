import { Component, signal } from "@angular/core"
import {
  type ResizableLayoutChangeDetails,
  UiResizable,
  UiResizableHandle,
  UiResizablePanel,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiResizable, UiResizableHandle, UiResizablePanel],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="layout.set([50, 50])">
          Split Evenly
        </button>
        <button type="button" (click)="layout.set([30, 70])">Reset</button>
      </div>
      <div
        uiResizable
        [(layout)]="layout"
        (beforeLayoutChange)="onLayoutChange($event.layout, $event.details)"
      >
        <div uiResizablePanel [minSize]="20">
          <h3>Files</h3>
          <ul>
            <li>page.tsx</li>
            <li>layout.tsx</li>
            <li>globals.css</li>
          </ul>
        </div>
        <div uiResizableHandle aria-label="Resize files"></div>
        <div uiResizablePanel [minSize]="20">
          <h3>page.tsx</h3>
          <span data-slot="hint">Saved just now</span>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly layout = signal<number[] | undefined>([30, 70])

  protected onLayoutChange(
    next: number[],
    details: ResizableLayoutChangeDetails
  ) {
    if (this.#format(next) !== this.#format(this.layout() ?? [])) {
      this.log(`${this.#format(next)} (${details.reason})`)
    }
  }

  #format(layout: number[]) {
    return layout.map(Math.round).join(" / ")
  }
}

export { Example }
