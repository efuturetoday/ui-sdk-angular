import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core"
import {
  UiMenu,
  UiMenuCheckboxItem,
  UiMenuContent,
  UiMenuItem,
  UiMenuTrigger,
} from "ui-sdk-angular"

// Counts renders of each custom item, so specs can check what re-renders.
const renders = { watched: 0, plain: 0 }

// Angular renders a part its own way through a component with the part as a
// host directive: the component's view re-renders for the signals it reads.
@Component({
  selector: "div[app-watched-item]",
  hostDirectives: [{ directive: UiMenuItem, inputs: ["value"] }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ count() }}{{ item.state().highlighted ? "→ " : "" }}Watched`,
})
class WatchedItem {
  protected readonly item = inject(UiMenuItem)

  protected count() {
    renders.watched++
    return ""
  }
}

@Component({
  selector: "div[app-plain-item]",
  hostDirectives: [{ directive: UiMenuItem, inputs: ["value"] }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ count() }}Plain`,
})
class PlainItem {
  protected count() {
    renders.plain++
    return ""
  }
}

@Component({
  selector: "app-fixture",
  imports: [
    PlainItem,
    UiMenu,
    UiMenuCheckboxItem,
    UiMenuContent,
    UiMenuItem,
    UiMenuTrigger,
    WatchedItem,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiMenu [onAction]="onAction">
        <button uiMenuTrigger>File</button>
        <div *uiMenuContent class="popup">
          <a uiMenuItem class="item" value="docs" href="#docs">Docs</a>
          <div app-watched-item class="item" value="watched"></div>
          <div app-plain-item class="item" value="plain"></div>
          <div uiMenuCheckboxItem #pinned="uiMenuCheckboxItem" value="pinned" class="item">
            <span [class]="pinned.state().checked ? 'is-checked' : 'is-unchecked'">Pinned</span>
          </div>
        </div>
      </ng-container>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly action = signal("")
  protected readonly onAction = (value: string) => this.action.set(value)

  constructor() {
    Object.assign(window, { __renders: renders })
  }
}

export { Fixture }
