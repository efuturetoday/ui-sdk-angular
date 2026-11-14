import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core"
import {
  UiResizable,
  UiResizableHandle,
  UiResizablePanel,
} from "ngx-ui-sdk"

// How often the first panel's content rendered, for specs that check a drag
// renders nothing that doesn't read the size.
const counts = { renders: 0 }
Object.assign(window, { panelRenders: counts })

// Angular renders content for the signals it reads, so the first panel's is a
// component of its own, with the panel as a host directive.
@Component({
  selector: "div[app-files-panel]",
  hostDirectives: [
    {
      directive: UiResizablePanel,
      inputs: ["defaultSize", "minSize", "collapsible"],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (count()) {
      <span class="panel-state">{{
        collapsed() ? "Collapsed" : "Open"
      }}</span>
    }
  `,
})
class FilesPanel {
  readonly #panel = inject(UiResizablePanel)
  // The state changes with the size on every frame of a drag, so this reads only what it shows.
  protected readonly collapsed = computed(() => this.#panel.state().collapsed)

  protected count() {
    counts.renders++
    return true
  }
}

@Component({
  selector: "app-fixture",
  imports: [FilesPanel, UiResizable, UiResizableHandle, UiResizablePanel],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiResizable
        class="resizable"
        (layoutCommit)="action.set('layout:' + $event.layout.map(round))"
      >
        <div
          app-files-panel
          [defaultSize]="30"
          collapsible
          [minSize]="10"
          class="resizable-panel"
          role="group"
          aria-label="Files"
        ></div>
        <span
          uiResizableHandle
          #handle="uiResizableHandle"
          aria-label="Resize files"
          class="resizable-handle"
        >
          <span class="handle-state">{{ handle.state().dragging ? "dragging" : "idle" }}</span>
        </span>
        <div
          uiResizablePanel
          #editor="uiResizablePanel"
          class="resizable-panel"
          role="group"
          aria-label="Editor"
        >
          <span class="panel-size">{{ round(editor.state().size) }}</span>
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly action = signal("")
  protected readonly round = Math.round
}

export { Fixture }
