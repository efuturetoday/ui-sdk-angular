import { Component } from "@angular/core"
import { LucideUsers } from "@lucide/angular"
import { UiField, UiFieldControl, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  type TriggerDefinition,
  type TriggerMenuSelectDetails,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuGroup,
  UiTriggerMenuGroupLabel,
  UiTriggerMenuInput,
  UiTriggerMenuItem,
  UiTriggerMenuItemIcon,
  UiTriggerMenuList,
  UiTriggerMenuSeparator,
} from "@ngx-ui-sdk/core/trigger-menu"

@Component({
  selector: "app-example",
  imports: [
    LucideUsers,
    UiField,
    UiFieldControl,
    UiFieldLabel,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuGroup,
    UiTriggerMenuGroupLabel,
    UiTriggerMenuInput,
    UiTriggerMenuItem,
    UiTriggerMenuItemIcon,
    UiTriggerMenuList,
    UiTriggerMenuSeparator,
  ],
  template: `
    <ng-container uiTriggerMenu [triggers]="triggers">
      <div uiField>
        <label uiFieldLabel>Message</label>
        <input
          uiFieldControl
          uiTriggerMenuInput
          placeholder="Type @ and a first name…" />
      </div>
      <div *uiTriggerMenuContent="let state">
        <div uiTriggerMenuList>
          <div uiTriggerMenuGroup>
            <div uiTriggerMenuGroupLabel>People</div>
            @for (person of people; track person.value) {
              <div
                uiTriggerMenuItem
                [value]="person.value"
                [label]="person.label"
                [disabled]="person.disabled">
                {{ person.label }}
                <span data-slot="hint">
                  {{ person.disabled ? "Deactivated" : "@" + person.value }}
                </span>
              </div>
            }
          </div>
          <div uiTriggerMenuSeparator></div>
          <div
            uiTriggerMenuItem
            value="here"
            label="here"
            [keywords]="['everyone', 'channel']"
            [onSelect]="notifyHere">
            <span uiTriggerMenuItemIcon><svg lucideUsers></svg></span>
            Notify everyone here
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly people = [
    { value: "hollis", label: "Hollis Grant" },
    { value: "ines", label: "Inès Moreau" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "wren", label: "Wren Takahashi" },
    { value: "tomasz", label: "Tomasz Wójcik", disabled: true },
  ]
  protected readonly triggers: TriggerDefinition[] = [
    {
      char: "@",
      spaces: 2,
      maxLength: 30,
      pattern: /[\p{L}.'-]/u,
      filter: "startsWith",
      insert: (item) => `@${item.label.split(" ")[0]} `,
    },
  ]
  protected readonly notifyHere = (
    _value: unknown,
    details: TriggerMenuSelectDetails<unknown>
  ) => details.insert("@here ")
}

export { Example }
