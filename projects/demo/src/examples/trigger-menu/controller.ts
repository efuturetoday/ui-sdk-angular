import { Component } from "@angular/core"
import {
  createTriggerMenuController,
  type TriggerDefinition,
  type TriggerMenuDataItem,
  UiField,
  UiFieldControl,
  UiFieldLabel,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuInput,
  UiTriggerMenuItem,
  UiTriggerMenuList,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldControl,
    UiFieldLabel,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuInput,
    UiTriggerMenuItem,
    UiTriggerMenuList,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          type="button"
          (mousedown)="$event.preventDefault()"
          (click)="mention()"
        >
          Mention
        </button>
        <button
          type="button"
          (mousedown)="$event.preventDefault()"
          (click)="insertDate()"
        >
          Insert Date
        </button>
      </div>
      <ng-container uiTriggerMenu [controller]="menu" [triggers]="triggers">
        <div uiField>
          <label uiFieldLabel>Message</label>
          <input
            uiFieldControl
            uiTriggerMenuInput
            placeholder="Write a message…"
          />
        </div>
        <div *uiTriggerMenuContent="let state">
          <div uiTriggerMenuList #list="uiTriggerMenuList">
            @for (item of itemsOf(list.state().items); track item.value) {
              <div uiTriggerMenuItem [value]="item.value" [label]="item.label">
                {{ item.label }}
              </div>
            }
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly people = [
    { value: "hollis", label: "Hollis Grant" },
    { value: "ines", label: "Inès Moreau" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "wren", label: "Wren Takahashi" },
    { value: "tomasz", label: "Tomasz Wójcik" },
  ]
  protected readonly triggers: TriggerDefinition[] = [
    { char: "@", items: this.people },
  ]
  protected readonly log = injectLog()
  protected readonly menu = createTriggerMenuController()

  protected async mention() {
    const closed = await this.menu.open({ trigger: "@" })
    this.log(`Closed (${closed.reason})`)
  }

  protected insertDate() {
    this.menu.insert(
      new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })
    )
  }

  protected itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
