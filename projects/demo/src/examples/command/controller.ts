import { Component } from "@angular/core"
import {
  createCommandController,
  UiCommand,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
  UiCommandPage,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiCommand,
    UiCommandInput,
    UiCommandItem,
    UiCommandList,
    UiCommandPage,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="palette.push('theme')">
          Open Themes
        </button>
        <button type="button" (click)="palette.pop()">Back</button>
        <button type="button" (click)="palette.setValue('dark')">
          Highlight Dark
        </button>
        <button type="button" (click)="palette.setQuery('li')">
          Search “li”
        </button>
        <button type="button" (click)="palette.run()">Run Highlighted</button>
        <button type="button" (click)="palette.focus()">Focus</button>
      </div>
      <div uiCommand [controller]="palette" [onAction]="ran">
        <input uiCommandInput aria-label="Search commands" />
        <div uiCommandList>
          <ng-container *uiCommandPage>
            <div uiCommandItem value="theme" page="theme">Change theme…</div>
          </ng-container>
          <ng-container *uiCommandPage="'theme'">
            @for (theme of themes; track theme.value) {
              <div uiCommandItem [value]="theme.value">{{ theme.label }}</div>
            }
          </ng-container>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]
  protected readonly palette = createCommandController()
  protected readonly log = injectLog()
  protected readonly ran = (value: string) => this.log(`Ran ${value}`)
}

export { Example }
