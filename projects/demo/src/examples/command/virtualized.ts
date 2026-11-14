import { Component } from "@angular/core"
import {
  UiCommand,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
  UiVirtualFor,
} from "ngx-ui-sdk"

type Row = { value: string; label: string }

@Component({
  selector: "app-example",
  imports: [
    UiCommand,
    UiCommandInput,
    UiCommandItem,
    UiCommandList,
    UiVirtualFor,
  ],
  template: `
    <div uiCommand [items]="commands">
      <input
        uiCommandInput
        aria-label="Search 10,000 commands"
        placeholder="Search 10,000 commands…"
      />
      <div uiCommandList #list="uiCommandList">
        <div
          *uiVirtualFor="let item of rows(list.state().items); rowHeight: 32"
          uiCommandItem
          [value]="item.value"
          [label]="item.label"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly commands: Row[] = Array.from(
    { length: 10_000 },
    (_, index) => ({
      value: `command-${index + 1}`,
      label: `Command ${index + 1}`,
    })
  )

  protected rows(items: unknown) {
    return (items ?? []) as Row[]
  }
}

export { Example }
