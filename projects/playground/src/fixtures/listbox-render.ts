import { Component, signal } from "@angular/core"
import { listboxAction, listboxFixture as f } from "tests/fixtures/listbox"
import { UiListbox, UiListboxItem } from "ngx-ui-sdk"

// Parts rendered as other elements, with class names of state.
@Component({
  selector: "app-fixture",
  imports: [UiListbox, UiListboxItem],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ul
        uiListbox
        class="listbox"
        [attr.aria-label]="f.label"
        activation="manual"
        (beforeValueChange)="action.set(listboxAction($event.value))"
      >
        <a uiListboxItem class="item" value="docs" href="#docs">Docs</a>
        <li
          uiListboxItem
          #star="uiListboxItem"
          value="star"
          [class]="'item ' + (star.state().selected ? 'is-selected' : 'is-unselected')"
        >
          {{ star.state().selected ? "★" : "☆" }} Star
        </li>
        @for (item of f.items.slice(0, 3); track item.value) {
          <li uiListboxItem class="item" [value]="item.value">
            {{ item.label }}
          </li>
        }
      </ul>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly listboxAction = listboxAction
  protected readonly action = signal("")
}

export { Fixture }
