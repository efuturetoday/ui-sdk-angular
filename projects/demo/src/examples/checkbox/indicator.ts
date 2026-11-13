import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
} from "ui-sdk-angular"

@Component({
  selector: "app-example",
  imports: [UiCheckboxInput, LucideCheck, UiCheckbox, UiCheckboxIndicator],
  template: `
    <div data-slot="stack">
      @for (task of tasks; track task.label) {
        <label data-slot="label">
          <button uiCheckbox #box="uiCheckbox" [defaultChecked]="task.done">
            <span *uiCheckboxIndicator>
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
          </button>
          <input [uiCheckboxInput]="box" />
          {{ task.label }}
        </label>
      }
    </div>
  `,
})
class Example {
  protected readonly tasks = [
    { label: "Write the release notes", done: false },
    { label: "Update the changelog", done: true },
    { label: "Tag the release", done: false },
  ]
}

export { Example }
