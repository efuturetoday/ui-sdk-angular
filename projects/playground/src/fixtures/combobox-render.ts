import { Component } from "@angular/core"
import { comboboxFixture } from "tests/fixtures/combobox"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxTrigger,
} from "ngx-ui-sdk"

// Parts rendered as other elements, with class names of state.
@Component({
  selector: "app-fixture",
  imports: [
    UiCombobox,
    UiComboboxContent,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiCombobox [name]="f.name">
        <div uiComboboxLabel class="label">{{ f.label }}</div>
        <input
          uiComboboxInput
          #input="uiComboboxInput"
          [class]="['input', input.state().open ? 'is-open' : 'is-closed']"
        />
        <button uiComboboxTrigger [attr.aria-label]="f.trigger">▾</button>
        <div *uiComboboxContent class="popup list-popup">
          <div uiComboboxList>
            <a uiComboboxItem class="item" value="docs" label="Docs" href="#docs">Docs</a>
            @for (item of f.items.slice(0, 3); track item.value) {
              <div uiComboboxItem #entry="uiComboboxItem" class="item" [value]="item.value" [label]="item.label">
                {{ item.label }}{{ entry.state().highlighted ? " ←" : "" }}
              </div>
            }
          </div>
        </div>
      </ng-container>
      <button>After</button>
    </div>
  `,
})
class Fixture {
  protected readonly f = comboboxFixture
}

export { Fixture }
