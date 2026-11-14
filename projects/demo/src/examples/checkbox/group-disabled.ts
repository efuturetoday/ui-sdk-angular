import { Component } from "@angular/core"
import { LucideCheck, LucideMinus } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxInput,
  UiCheckboxGroup,
  UiCheckboxIndicator,
} from "@ngx-ui-sdk/core/checkbox"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideMinus,
    UiCheckbox,
    UiCheckboxInput,
    UiCheckboxGroup,
    UiCheckboxIndicator,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="stack">
        <h3 id="disabled-backups">Backups</h3>
        <p data-slot="hint">Managed by your organization.</p>
        <div
          uiCheckboxGroup
          aria-labelledby="disabled-backups"
          [defaultValue]="['photos', 'documents']"
          disabled
        >
          @for (item of backups; track item.value) {
            <label data-slot="label">
              <button uiCheckbox #box="uiCheckbox" [value]="item.value">
                <span *uiCheckboxIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </button>
              <input [uiCheckboxInput]="box" />
              {{ item.label }}
            </label>
          }
        </div>
      </div>
      <div data-slot="stack">
        <h3 id="disabled-folders">Sync folders</h3>
        <div
          uiCheckboxGroup
          aria-labelledby="disabled-folders"
          [defaultValue]="['desktop']"
          [allValues]="folderValues"
        >
          <label data-slot="label">
            <button uiCheckbox #box2="uiCheckbox" parent>
              <span *uiCheckboxIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
                <svg lucideMinus aria-hidden="true"></svg>
              </span>
            </button>
            <input [uiCheckboxInput]="box2" />
            Select all
          </label>
          <div data-slot="stack">
            @for (item of folders; track item.value) {
              <label data-slot="label">
                <button
                  uiCheckbox
                  #box3="uiCheckbox"
                  [value]="item.value"
                  [disabled]="item.disabled"
                >
                  <span *uiCheckboxIndicator>
                    <svg lucideCheck aria-hidden="true"></svg>
                  </span>
                </button>
                <input [uiCheckboxInput]="box3" />
                {{ item.label }}
              </label>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly backups = [
    { value: "photos", label: "Photos" },
    { value: "documents", label: "Documents" },
    { value: "messages", label: "Messages" },
  ]
  protected readonly folders = [
    { value: "desktop", label: "Desktop", disabled: true },
    { value: "projects", label: "Projects", disabled: false },
    { value: "downloads", label: "Downloads", disabled: false },
  ]
  protected readonly folderValues = this.folders.map((item) => item.value)
}

export { Example }
