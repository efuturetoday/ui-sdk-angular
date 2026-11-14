import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxTrigger,
} from "@ngx-ui-sdk/core/combobox"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiCombobox,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxTrigger,
  ],
  template: `
    <ng-container uiCombobox>
      <div data-slot="stack">
        <div uiComboboxLabel>Owner</div>
        <div data-slot="row">
          <input uiComboboxInput placeholder="Search people…" />
          <button uiComboboxTrigger aria-label="Show people">
            <svg lucideChevronDown aria-hidden="true"></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty>No people found.</div>
        <div uiComboboxList>
          @for (user of users; track user.id) {
            <div
              uiComboboxItem
              [value]="user.username"
              [label]="user.name"
              [keywords]="[user.username]">
              <span data-slot="badge">{{ user.name.slice(0, 1) }}</span>
              <span data-slot="stack">
                <span>{{ user.name }}</span>
                <span data-slot="hint">&#64;{{ user.username }}</span>
              </span>
              <span data-slot="hint">{{ user.role }}</span>
              <span *uiComboboxItemIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
              </span>
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
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
