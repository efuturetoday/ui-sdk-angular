import { UiText } from "@ngx-ui-sdk/core"
import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  type SelectOpenChangeDetails,
  type SelectValueChangeDetails,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiText,
    LucideCheck,
    LucideChevronDown,
    UiField,
    UiFieldLabel,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="value.set('editor')">Make Editor</button>
        <button type="button" (click)="open.set(true)">Open</button>
      </div>
      <div uiField>
        <label uiFieldLabel>Role</label>
        <ng-container
          uiSelect
          [(value)]="value"
          [(open)]="open"
          (beforeValueChange)="changeValue($event.value, $event.details)"
          (beforeOpenChange)="
            log('open: ' + $event.open + ' (' + $event.details.reason + ')')
          "
        >
          <button uiSelectTrigger>
            <span uiSelectValue uiText></span>
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent>
            @for (role of roles; track role.value) {
              <div uiSelectItem [value]="role.value">
                {{ role.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck aria-hidden="true"></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {
  protected readonly roles = [
    { value: "viewer", label: "Viewer" },
    { value: "commenter", label: "Commenter" },
    { value: "editor", label: "Editor" },
    { value: "admin", label: "Admin" },
    { value: "owner", label: "Owner" },
  ]
  protected readonly value = signal<unknown>("viewer")
  protected readonly open = signal<boolean | undefined>(false)
  protected readonly log = injectLog()

  protected changeValue(next: unknown, details: SelectValueChangeDetails) {
    if (next === "owner") {
      details.cancel()
      this.log("Only the owner can transfer ownership")
      return
    }
    this.log(`value: ${next} (${details.reason})`)
  }
}

export { Example }
