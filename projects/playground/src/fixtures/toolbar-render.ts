import { Component, signal } from "@angular/core"
import {
  UiToolbar,
  UiToolbarButton,
  UiToolbarSeparator,
} from "ngx-ui-sdk"

// Upstream's fixture. Its render counts are React's alone, whose spec the
// other frameworks skip, so the items are plain.
@Component({
  selector: "app-fixture",
  imports: [UiToolbar, UiToolbarButton, UiToolbarSeparator],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiToolbar class="toolbar" aria-label="Tools">
        <span uiToolbarButton (click)="action.set('span')">Span tool</span>
        <button uiToolbarButton (click)="action.set('cut')">Cut</button>
        <button uiToolbarButton (click)="action.set('copy')">Copy</button>
        <hr uiToolbarSeparator class="rule" />
        <a
          uiToolbarButton
          #old="uiToolbarButton"
          disabled
          href="#old"
          [class]="old.state().disabled ? 'is-disabled' : 'is-enabled'"
          >Old docs</a
        >
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly action = signal("")
}

export { Fixture }
