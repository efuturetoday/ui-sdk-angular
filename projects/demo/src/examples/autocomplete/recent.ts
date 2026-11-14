import { Component } from "@angular/core"
import {
  type ListAnnouncement,
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteGroup,
  UiAutocompleteGroupLabel,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteItemText,
  UiAutocompleteList,
} from "ngx-ui-sdk"

type Recent = { type: "group"; label: string; items: string[] }

@Component({
  selector: "app-example",
  imports: [
    UiAutocomplete,
    UiAutocompleteContent,
    UiAutocompleteEmpty,
    UiAutocompleteGroup,
    UiAutocompleteGroupLabel,
    UiAutocompleteInput,
    UiAutocompleteItem,
    UiAutocompleteItemText,
    UiAutocompleteList,
  ],
  template: `<ng-container
    uiAutocomplete
    [items]="topics"
    [emptyItems]="recentSearches"
    openOnFocus
    [announcement]="announcement"
  >
    <input
      uiAutocompleteInput
      type="search"
      aria-label="Search docs"
      placeholder="Search docs…"
    />
    <div *uiAutocompleteContent>
      <div uiAutocompleteEmpty>No topics found.</div>
      <div uiAutocompleteList #list="uiAutocompleteList">
        @for (entry of entriesOf(list.state().items); track key(entry)) {
          @if (typeof entry === "string") {
            <div uiAutocompleteItem [value]="entry" [label]="entry">
              <span uiAutocompleteItemText></span>
            </div>
          } @else {
            <div uiAutocompleteGroup>
              <div uiAutocompleteGroupLabel>{{ asGroup(entry).label }}</div>
              @for (topic of asGroup(entry).items; track topic) {
                <div uiAutocompleteItem [value]="topic" [label]="topic">
                  <span uiAutocompleteItemText></span>
                </div>
              }
            </div>
          }
        }
      </div>
    </div>
  </ng-container>`,
})
class Example {
  protected readonly recent = [
    "react hooks",
    "tailwind grid",
    "web components",
    "vue v-model",
  ]
  protected readonly topics = [
    ...this.recent,
    "react server components",
    "tailwind colors",
    "vue router",
  ]
  protected readonly recentSearches: Recent[] = [
    { type: "group", label: "Recent searches", items: this.recent },
  ]
  protected readonly announcement = (change: ListAnnouncement) =>
    change.type === "results"
      ? `${change.count} ${change.count === 1 ? "topic" : "topics"}`
      : null

  protected entriesOf(items: unknown) {
    return items as (string | Recent)[]
  }
  protected asGroup(entry: string | Recent) {
    return entry as Recent
  }
  protected key(entry: string | Recent) {
    return typeof entry === "string" ? entry : entry.label
  }
}

export { Example }
