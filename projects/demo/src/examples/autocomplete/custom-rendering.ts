import { Component } from "@angular/core"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteLabel,
  UiAutocompleteList,
} from "ui-sdk-angular"

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
  template: `<ng-container uiAutocomplete>
    <div data-slot="stack">
      <div uiAutocompleteLabel>Jump to</div>
      <input uiAutocompleteInput placeholder="e.g. Styling" />
    </div>
    <div *uiAutocompleteContent>
      <div uiAutocompleteEmpty>No sections found.</div>
      <div uiAutocompleteList>
        @for (page of pages; track page.href) {
          <a
            uiAutocompleteItem
            [value]="page.title"
            [label]="page.title"
            [href]="page.href"
          >
            {{ page.title }}
            <span data-slot="hint">{{ page.section }}</span>
          </a>
        }
      </div>
    </div>
  </ng-container>`,
})
class Example {
  protected readonly pages = [
    { title: "Installation", section: "Get Started", href: "#installation" },
    { title: "Composition", section: "Concepts", href: "#composition" },
    { title: "Build Your Own", section: "Concepts", href: "#build-your-own" },
    { title: "Styling", section: "Guides", href: "#styling" },
    { title: "API Reference", section: "Reference", href: "#api-reference" },
    { title: "Accessibility", section: "Reference", href: "#accessibility" },
  ]
}

export { Example }
