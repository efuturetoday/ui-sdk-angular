import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiField,
  UiFieldLabel,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectTrigger,
  UiSelectValue,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

type Member = { id: number; name: string; email: string }

@Component({
  selector: "app-example",
  imports: [
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
    <div uiField>
      <label uiFieldLabel>Assignee</label
      ><ng-container
        uiSelect
        [defaultValue]="initial"
        name="assignee"
        [itemToValue]="itemToValue"
        [itemToLabel]="itemToLabel"
        [isItemEqualToValue]="isEqual"
        placeholder="Unassigned"
        (valueChange)="onValueChange($event)"
        ><button uiSelectTrigger>
          <span uiSelectValue></span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          @for (member of members; track member.id) {
            <div uiSelectItem [value]="member">
              <span data-slot="stack"
                >{{ member.name
                }}<span data-slot="hint">{{ member.email }}</span></span
              ><span *uiSelectItemIndicator
                ><svg lucideCheck aria-hidden="true"></svg
              ></span>
            </div>
          }</div
      ></ng-container>
    </div>
  `,
})
class Example {
  protected readonly members: Member[] = [
    { id: 1, name: "Hollis Grant", email: "hollis@example.com" },
    { id: 2, name: "Inès Moreau", email: "ines@example.com" },
    { id: 3, name: "Kofi Mensah", email: "kofi@example.com" },
    { id: 4, name: "Wren Takahashi", email: "wren@example.com" },
  ]
  protected readonly initial = { ...this.members[1] }
  protected readonly log = injectLog()
  protected readonly itemToValue = (member: Member) => String(member.id)
  protected readonly itemToLabel = (member: Member) => member.name
  protected readonly isEqual = (item: Member, value: Member) =>
    item.id === value.id

  protected onValueChange(member: unknown) {
    this.log(`Submits assignee=${member ? (member as Member).id : ""}`)
  }
}

export { Example }
