import { Component } from "@angular/core"
import { wrappedContentFixture as f } from "tests/fixtures/wrapped-content"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteInput,
  UiAutocompleteLabel,
} from "@ngx-ui-sdk/core/autocomplete"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxInput,
  UiComboboxLabel,
} from "@ngx-ui-sdk/core/combobox"
import {
  UiSelect,
  UiSelectContent,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"
import {
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuInput,
  UiTriggerMenuList,
  type TriggerDefinition,
} from "@ngx-ui-sdk/core/trigger-menu"

// Data roots whose content sits inside a wrapping element. Each should render
// that content, and no second list of its own.
@Component({
  selector: "app-fixture",
  imports: [
    UiAutocomplete,
    UiAutocompleteContent,
    UiAutocompleteInput,
    UiAutocompleteLabel,
    UiCombobox,
    UiComboboxContent,
    UiComboboxInput,
    UiComboboxLabel,
    UiSelect,
    UiSelectContent,
    UiSelectLabel,
    UiSelectTrigger,
    UiSelectValue,
    UiTriggerMenu,
    UiTriggerMenuContent,
    UiTriggerMenuInput,
    UiTriggerMenuList,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiSelect [items]="f.items">
        <div uiSelectLabel>{{ f.select }}</div>
        <button uiSelectTrigger><span uiSelectValue></span></button>
        <ng-container>
          <div *uiSelectContent class="popup"></div>
        </ng-container>
      </ng-container>
      <ng-container uiCombobox [items]="f.items">
        <div uiComboboxLabel>{{ f.combobox }}</div>
        <input uiComboboxInput />
        <div>
          <div *uiComboboxContent class="popup"></div>
        </div>
      </ng-container>
      <ng-container uiAutocomplete [items]="f.items">
        <div uiAutocompleteLabel>{{ f.autocomplete }}</div>
        <input uiAutocompleteInput />
        <div>
          <div *uiAutocompleteContent class="popup"></div>
        </div>
      </ng-container>
      <ng-container uiTriggerMenu [triggers]="triggers">
        <input uiTriggerMenuInput [attr.aria-label]="f.triggerMenu" />
        <ng-container>
          <div *uiTriggerMenuContent class="popup">
            <div uiTriggerMenuList></div>
          </div>
        </ng-container>
      </ng-container>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly triggers: TriggerDefinition[] = [
    { char: "@", items: f.items },
  ]
}

export { Fixture }
