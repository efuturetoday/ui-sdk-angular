import { Component, inject, signal } from "@angular/core"
import {
  UiButton,
} from "@ngx-ui-sdk/core/button"
import {
  UiSeparator,
} from "@ngx-ui-sdk/core/separator"
import {
  UiToggle,
  UiToggleGroup,
} from "@ngx-ui-sdk/core/toggle"

// A class on the toggle's own element reads its state only from a host
// binding, which runs after the toggle's `ngOnInit`.
@Component({
  selector: "button[app-star]",
  hostDirectives: [{ directive: UiToggle, outputs: ["pressedChange"] }],
  host: {
    class: "toggle",
    "[class.is-pressed]": "toggle.state().pressed",
    "[class.is-unpressed]": "!toggle.state().pressed",
  },
  template: `<span aria-hidden="true">{{
    toggle.state().pressed ? "★" : "☆"
  }}</span> Star`,
})
class StarToggle {
  protected readonly toggle = inject(UiToggle)
}

@Component({
  selector: "app-fixture",
  imports: [StarToggle, UiButton, UiSeparator, UiToggle, UiToggleGroup],
  template: `
    <div class="fixture">
      <button>Before</button>
      <span uiButton class="button" (click)="action.set('span')">Span button</span>
      <a uiButton class="button" [disabled]="true" href="#old">Old docs</a>
      <button app-star (pressedChange)="action.set($event ? 'star' : 'unstar')"></button>
      <div
        uiToggleGroup
        class="toggle-group"
        aria-label="View"
        [defaultValue]="['grid']"
        (valueChange)="action.set($event.join(', '))"
      >
        <span uiToggle class="toggle" value="grid">Grid</span>
        <span uiToggle class="toggle" value="list">List</span>
      </div>
      <hr uiSeparator class="rule" />
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly action = signal("")
}

export { Fixture }
