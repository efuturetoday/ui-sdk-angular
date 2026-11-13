import { Component } from "@angular/core"
import { selectFixture } from "tests/fixtures/select"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
} from "ui-sdk-angular"

// Parts rendered as other elements, with class names of state.
@Component({
  selector: "app-fixture",
  imports: [
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectLabel,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiSelect [name]="f.name" [placeholder]="f.placeholder">
        <div uiSelectLabel class="label">{{ f.label }}</div>
        <button
          uiSelectTrigger
          #trigger="uiSelectTrigger"
          [class]="['trigger', trigger.state().open ? 'is-open' : 'is-closed']"
        >
          <span uiSelectValue></span>
          <span aria-hidden="true">{{ trigger.state().open ? "▲" : "▼" }}</span>
        </button>
        <div *uiSelectContent class="popup list-popup">
          <a uiSelectItem class="item" value="docs" href="#docs">Docs</a>
          @for (item of f.items.slice(0, 3); track item.value) {
            <div uiSelectItem class="item" [value]="item.value">{{ item.label }}</div>
          }
        </div>
      </ng-container>
      <button>After</button>
    </div>
  `,
})
class Fixture {
  protected readonly f = selectFixture
}

export { Fixture }
