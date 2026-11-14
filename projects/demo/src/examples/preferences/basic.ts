import { Component } from "@angular/core"
import { createLocalStorage, createPreference } from "@ui-sdk/core"
import { injectPreference, UiButton, UiPreferences } from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

const view = createPreference({
  values: ["list", "grid"],
  defaultValue: "list",
  attribute: "data-view",
  storage: createLocalStorage("ui-sdk-preferences-view"),
})

@Component({
  selector: "app-example",
  imports: [UiButton, UiPreferences],
  template: `
    <div [uiPreferences]="preferences">
      <div data-slot="stack">
        <div data-slot="controls" role="group" aria-label="View">
          <button
            uiButton
            [attr.aria-pressed]="state().value === 'list'"
            (click)="choose('list', $event)"
          >
            List
          </button>
          <button
            uiButton
            [attr.aria-pressed]="state().value === 'grid'"
            (click)="choose('grid', $event)"
          >
            Grid
          </button>
        </div>
        <ul data-slot="files" aria-label="Files">
          @for (file of files; track file.name) {
            <li>
              <span>{{ file.name }}</span>
              <span data-slot="hint">{{ file.detail }}</span>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
})
class Example {
  protected readonly preferences = [view]
  protected readonly files = [
    { name: "Q3 roadmap.pdf", detail: "2.4 MB" },
    { name: "Launch checklist.md", detail: "12 KB" },
    { name: "Offsite photos", detail: "24 items" },
    { name: "Brand assets.zip", detail: "18 MB" },
  ]
  protected readonly log = injectLog()
  protected readonly state = injectPreference(view)

  protected choose(next: "list" | "grid", event: MouseEvent) {
    view.set(next, { reason: "press", event })
    this.log(`Saved the ${next} view`)
  }
}

export { Example }
