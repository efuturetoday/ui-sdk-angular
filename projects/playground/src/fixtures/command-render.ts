import { Component, signal } from "@angular/core"
import { commandFixture as f } from "tests/fixtures/command"
import {
  UiCommand,
  UiCommandInput,
  UiCommandItem,
  UiCommandList,
} from "ngx-ui-sdk"

// Parts rendered as other elements, with class names of state.
@Component({
  selector: "app-fixture",
  imports: [UiCommand, UiCommandInput, UiCommandItem, UiCommandList],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiCommand
        #command="uiCommand"
        [class]="'command ' + (command.state().page ? 'is-paged' : 'is-first')"
        [onAction]="onAction"
      >
        <input uiCommandInput class="input" [attr.aria-label]="f.input" />
        <div uiCommandList class="command-list">
          <a uiCommandItem class="item" value="docs" href="#docs">Docs</a>
          @for (item of f.groups[0]!.items.slice(0, 2); track item.value) {
            <div
              uiCommandItem
              #current="uiCommandItem"
              [value]="item.value"
              [label]="item.label"
              [class]="'item ' + (current.state().highlighted ? 'is-highlighted' : '')"
            >
              {{ item.label }}{{ current.state().highlighted ? " ←" : "" }}
            </div>
          }
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly action = signal("")
  protected readonly onAction = (value: string) =>
    this.action.set(`action:${value}`)
}

export { Fixture }
