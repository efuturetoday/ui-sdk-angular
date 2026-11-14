import { Component } from "@angular/core"
import { autocompleteFixture } from "tests/fixtures/autocomplete"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteLabel,
  UiAutocompleteList,
  UiAutocompleteTrigger,
} from "ngx-ui-sdk/autocomplete"

// Parts rendered as other elements, with class names of state.
@Component({
  selector: "app-fixture",
  imports: [
    UiAutocomplete,
    UiAutocompleteContent,
    UiAutocompleteInput,
    UiAutocompleteItem,
    UiAutocompleteLabel,
    UiAutocompleteList,
    UiAutocompleteTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiAutocomplete [name]="f.name">
        <div uiAutocompleteLabel class="label">{{ f.label }}</div>
        <input
          uiAutocompleteInput
          #input="uiAutocompleteInput"
          [class]="['input', input.state().open ? 'is-open' : 'is-closed']"
        />
        <button uiAutocompleteTrigger [attr.aria-label]="f.trigger">▾</button>
        <div *uiAutocompleteContent class="popup list-popup">
          <div uiAutocompleteList>
            <a uiAutocompleteItem class="item" value="docs" label="Docs" href="#docs">Docs</a>
            @for (item of f.items.slice(0, 3); track item.value) {
              <div uiAutocompleteItem #entry="uiAutocompleteItem" class="item" [value]="item.value" [label]="item.label">
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
  protected readonly f = autocompleteFixture
}

export { Fixture }
