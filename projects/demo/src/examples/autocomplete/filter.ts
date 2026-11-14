import { Component } from "@angular/core"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteLabel,
  UiAutocompleteList,
} from "ngx-ui-sdk/autocomplete"

@Component({
  selector: "app-example",
  imports: [
    UiAutocomplete,
    UiAutocompleteContent,
    UiAutocompleteEmpty,
    UiAutocompleteInput,
    UiAutocompleteItem,
    UiAutocompleteLabel,
    UiAutocompleteList,
  ],
  template: `<ng-container uiAutocomplete filter="startsWith">
    <div data-slot="stack">
      <div uiAutocompleteLabel>Tag</div>
      <input uiAutocompleteInput placeholder="Try “bug”" />
    </div>
    <div *uiAutocompleteContent>
      <div uiAutocompleteEmpty>No tags found.</div>
      <div uiAutocompleteList>
        @for (tag of tags; track tag.value) {
          <div
            uiAutocompleteItem
            [value]="tag.value"
            [label]="tag.label"
            [keywords]="tag.keywords"
          >
            {{ tag.label }}
            <span data-slot="hint">{{ tag.keywords[0] }}</span>
          </div>
        }
      </div>
    </div>
  </ng-container>`,
})
class Example {
  protected readonly tags = [
    {
      value: "feature",
      label: "feature",
      keywords: ["enhancement", "request"],
    },
    { value: "fix", label: "fix", keywords: ["bug", "patch"] },
    { value: "docs", label: "docs", keywords: ["documentation", "readme"] },
    { value: "performance", label: "performance", keywords: ["speed", "slow"] },
    { value: "security", label: "security", keywords: ["vulnerability"] },
    { value: "refactor", label: "refactor", keywords: ["cleanup"] },
  ]
}

export { Example }
