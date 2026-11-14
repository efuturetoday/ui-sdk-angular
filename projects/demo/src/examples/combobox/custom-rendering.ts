import { Component } from "@angular/core"
import {
  LucideCheck,
  LucideChevronDown,
  LucideChevronUp,
  LucideSearch,
} from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxTrigger,
} from "ngx-ui-sdk/combobox"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    LucideChevronUp,
    LucideSearch,
    UiCombobox,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxTrigger,
  ],
  template: `<ng-container uiCombobox
    ><div data-slot="stack">
      <div uiComboboxLabel>Assignee</div>
      <div data-slot="row">
        <div data-slot="row">
          <svg lucideSearch aria-hidden="true"></svg
          ><input uiComboboxInput placeholder="Search people…" />
        </div>
        <button
          uiComboboxTrigger
          #trigger="uiComboboxTrigger"
          aria-label="Show people"
        >
          @if (trigger.state().open) {
            <svg lucideChevronUp aria-hidden="true"></svg>
          } @else {
            <svg lucideChevronDown aria-hidden="true"></svg>
          }
        </button>
      </div>
    </div>
    <div *uiComboboxContent>
      <div uiComboboxEmpty>No one by that name.</div>
      <div uiComboboxList>
        @for (user of users; track user.id) {
          <div
            uiComboboxItem
            #entry="uiComboboxItem"
            [value]="user.username"
            [label]="user.name"
            [keywords]="[user.username]"
          >
            <span data-slot="badge">{{ user.name.slice(0, 1) }}</span><span
              data-slot="stack"
              >{{ user.name
              }}<span data-slot="hint">&#64;{{ user.username }}</span></span
            >
            @if (entry.state().selected) {
              <svg lucideCheck aria-hidden="true"></svg>
            } @else if (entry.state().highlighted) {
              <kbd data-slot="kbd">Enter</kbd>
            }
          </div>
        }
      </div>
    </div></ng-container
  >`,
})
class Example {
  protected readonly users = [
    { id: 1, name: "Hollis Grant", username: "hollis", role: "Owner" },
    { id: 2, name: "Inès Moreau", username: "ines", role: "Admin" },
    { id: 3, name: "Kofi Mensah", username: "kofi", role: "Member" },
    { id: 4, name: "Wren Takahashi", username: "wren", role: "Member" },
    { id: 5, name: "Tomasz Wójcik", username: "tomasz", role: "Guest" },
  ]
}

export { Example }
