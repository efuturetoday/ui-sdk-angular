import { Component } from "@angular/core"
import { LucideBold, LucideItalic, LucideLink } from "@lucide/angular"
import {
  createToolbarController,
  injectShortcut,
  UiToolbar,
  UiToolbarButton,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [LucideBold, LucideItalic, LucideLink, UiToolbar, UiToolbarButton],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="toolbar.focus()">Focus Toolbar</button>
      </div>
      <div uiToolbar [controller]="toolbar" aria-label="Notes formatting">
        @for (action of actions; track action.label) {
          <button
            uiToolbarButton
            [attr.aria-label]="action.label"
            (click)="log(action.label)"
          >
            @switch (action.icon) {
              @case ("bold") {
                <svg lucideBold aria-hidden="true"></svg>
              }
              @case ("italic") {
                <svg lucideItalic aria-hidden="true"></svg>
              }
              @case ("link") {
                <svg lucideLink aria-hidden="true"></svg>
              }
            }
          </button>
        }
      </div>
      <textarea
        aria-label="Notes"
        placeholder="Type, then press Alt+F10"
      ></textarea>
    </div>
  `,
})
class Example {
  protected readonly actions = [
    { label: "Bold", icon: "bold" },
    { label: "Italic", icon: "italic" },
    { label: "Insert link", icon: "link" },
  ]
  protected readonly log = injectLog()
  protected readonly toolbar = createToolbarController()

  constructor() {
    injectShortcut(
      () => "alt+f10",
      () => this.toolbar.focus(),
      () => ({
        allowInInput: true,
      })
    )
  }
}

export { Example }
