import { Component } from "@angular/core"
import { longItems } from "tests/fixtures/select"
import {
  UiVirtualFor,
} from "ngx-ui-sdk"
import {
  UiCommand,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
} from "ngx-ui-sdk/command"

type Item = { value: string; label: string }

// 10,000 commands, rendering only the rows in view. The command ranks and
// moves through every one.
@Component({
  selector: "app-fixture",
  imports: [UiCommand, UiCommandInput, UiCommandItem, UiCommandList, UiVirtualFor],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiCommand class="command" [items]="items">
        <input uiCommandInput class="input" aria-label="Search items" />
        <div class="long-list" style="height: 240px">
          <div
            uiCommandList
            #list="uiCommandList"
            class="command-list"
            style="position: relative; max-height: none; overflow: visible"
          >
            <div
              *uiVirtualFor="let item of rows(list.state().items); rowHeight: 32"
              uiCommandItem
              class="item"
              [value]="item.value"
              [label]="item.label"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <button>After</button>
    </div>
  `,
})
class Fixture {
  protected readonly items: Item[] = longItems()

  protected rows(items: unknown) {
    return (items ?? []) as Item[]
  }
}

export { Fixture }
