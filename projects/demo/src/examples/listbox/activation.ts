import { Component } from "@angular/core"
import { LucideFile } from "@lucide/angular"
import { UiListbox, UiListboxItem, UiListboxItemIcon } from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [LucideFile, UiListbox, UiListboxItem, UiListboxItemIcon],
  template: `
    <div
      uiListbox
      multiple
      activation="automatic"
      [defaultValue]="['readme']"
      aria-label="Files"
      (beforeValueChange)="
        log(
          $any($event.value).length +
            ' selected (' +
            $event.details.reason +
            ')'
        )
      "
    >
      @for (file of files; track file.value) {
        <div uiListboxItem [value]="file.value">
          <span uiListboxItemIcon
            ><svg lucideFile aria-hidden="true"></svg
          ></span>
          {{ file.label }}
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly files = [
    { value: "readme", label: "README.md" },
    { value: "package", label: "package.json" },
    { value: "tsconfig", label: "tsconfig.json" },
    { value: "index", label: "index.ts" },
    { value: "styles", label: "styles.css" },
    { value: "logo", label: "logo.svg" },
  ]
  protected readonly log = injectLog()
}

export { Example }
