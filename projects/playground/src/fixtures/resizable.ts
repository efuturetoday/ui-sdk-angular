import { Component, signal } from "@angular/core"
import {
  formatLayout,
  resizableFixture as f,
  resizableOptions,
} from "tests/fixtures/resizable"
import {
  createResizableController,
  type ResizableLayoutChangeDetails,
  type ResizableLayoutCommitDetails,
  UiResizable,
  UiResizableHandle,
  UiResizablePanel,
} from "ui-sdk-angular"

@Component({
  selector: "app-fixture",
  imports: [UiResizable, UiResizableHandle, UiResizablePanel],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiResizable
        class="resizable"
        [layout]="options.controlled ? layout() : undefined"
        (layoutChange)="!options.ignore && layout.set($event)"
        [orientation]="options.orientation"
        [disabled]="options.disabled"
        [step]="options.step"
        [largeStep]="options.largeStep"
        [autoSaveId]="options.autoSaveId"
        [defaultLayout]="options.defaultLayout"
        [controller]="controller"
        (beforeLayoutChange)="editor.change($event.layout, $event.details)"
        (layoutCommit)="editor.complete($event.layout, $event.details)"
      >
        <div
          uiResizablePanel
          [id]="sidebar.id"
          [defaultSize]="sidebar.defaultSize"
          [minSize]="sidebar.minSize"
          [maxSize]="sidebar.maxSize"
          [collapsible]="sidebar.collapsible"
          class="resizable-panel"
          role="group"
          [attr.aria-label]="sidebar.label"
        >
          <button>Sidebar action</button>
        </div>
        <div
          uiResizableHandle
          class="resizable-handle"
          [attr.aria-label]="f.editor.handles[0]"
          [disabled]="options.locked"
        ></div>
        <div
          uiResizablePanel
          [id]="main.id"
          [minSize]="main.minSize"
          class="resizable-panel"
          role="group"
          [attr.aria-label]="main.label"
        >
          <div
            uiResizable
            class="resizable-nested"
            orientation="vertical"
            (beforeLayoutChange)="area.change($event.layout, $event.details)"
            (layoutCommit)="area.complete($event.layout, $event.details)"
          >
            <div
              uiResizablePanel
              [id]="code.id"
              [defaultSize]="code.defaultSize"
              [minSize]="code.minSize"
              class="resizable-panel"
              role="group"
              [attr.aria-label]="code.label"
            ></div>
            <div
              uiResizableHandle
              class="resizable-handle"
              [attr.aria-label]="f.main.handle"
            ></div>
            <div
              uiResizablePanel
              [id]="terminal.id"
              [minSize]="terminal.minSize"
              [collapsible]="terminal.collapsible"
              class="resizable-panel"
              role="group"
              [attr.aria-label]="terminal.label"
            ></div>
          </div>
        </div>
        <div
          uiResizableHandle
          class="resizable-handle"
          [attr.aria-label]="f.editor.handles[1]"
        ></div>
        <div
          uiResizablePanel
          [id]="preview.id"
          [defaultSize]="preview.defaultSize"
          [minSize]="preview.minSize"
          class="resizable-panel"
          role="group"
          [attr.aria-label]="preview.label"
        ></div>
      </div>
      <div class="row">
        <button (click)="controller.collapse(sidebar.id)">
          {{ f.buttons.collapse }}
        </button>
        <button (click)="controller.expand(sidebar.id)">
          {{ f.buttons.expand }}
        </button>
        <button (click)="controller.resize(preview.id, f.previewSize)">
          {{ f.buttons.resize }}
        </button>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Committed">{{ committed().join(" ") }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly options = resizableOptions()
  protected readonly controller = createResizableController()
  protected readonly sidebar = f.editor.panels.sidebar
  protected readonly main = f.editor.panels.main
  protected readonly preview = f.editor.panels.preview
  protected readonly code = f.main.panels.code
  protected readonly terminal = f.main.panels.terminal
  protected readonly action = signal("")
  protected readonly committed = signal<string[]>([])
  protected readonly layout = signal([25, 50, 25])

  // Records a change, or cancels it when the URL asks.
  #report(
    group: string,
    next: number[],
    details: ResizableLayoutChangeDetails
  ) {
    if (group === f.editor.id && this.options.cancel) {
      return details.cancel()
    }
    this.action.set(formatLayout(group, next, details.reason))
  }

  #commit(
    group: string,
    next: number[],
    details: ResizableLayoutCommitDetails
  ) {
    this.committed.update((all) => [
      ...all,
      formatLayout(group, next, details.reason),
    ])
  }

  protected readonly editor = {
    change: (next: number[], details: ResizableLayoutChangeDetails) =>
      this.#report(f.editor.id, next, details),
    complete: (next: number[], details: ResizableLayoutCommitDetails) =>
      this.#commit(f.editor.id, next, details),
  }
  protected readonly area = {
    change: (next: number[], details: ResizableLayoutChangeDetails) =>
      this.#report(f.main.id, next, details),
    complete: (next: number[], details: ResizableLayoutCommitDetails) =>
      this.#commit(f.main.id, next, details),
  }
}

export { Fixture }
