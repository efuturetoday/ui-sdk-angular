import { Component } from "@angular/core"
import {
  LucideArchive,
  LucideClock,
  LucideFile,
  LucidePencil,
  LucideReply,
  LucideStar,
} from "@lucide/angular"
import {
  UiAutocomplete,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteItemIcon,
  UiAutocompleteList,
} from "ngx-ui-sdk/autocomplete"

@Component({
  selector: "app-example",
  imports: [
    LucideArchive,
    LucideClock,
    LucideFile,
    LucidePencil,
    LucideReply,
    LucideStar,
    UiAutocomplete,
    UiAutocompleteContent,
    UiAutocompleteEmpty,
    UiAutocompleteInput,
    UiAutocompleteItem,
    UiAutocompleteItemIcon,
    UiAutocompleteList,
  ],
  template: `<ng-container uiAutocomplete>
    <input
      uiAutocompleteInput
      type="search"
      aria-label="Search mail"
      placeholder="Search mail…"
    />
    <div *uiAutocompleteContent>
      <div uiAutocompleteEmpty>No searches found.</div>
      <div uiAutocompleteList>
        <div uiAutocompleteItem value="Starred">
          <span uiAutocompleteItemIcon
            ><svg lucideStar aria-hidden="true"></svg></span
          >Starred
        </div>
        <div uiAutocompleteItem value="Drafts">
          <span uiAutocompleteItemIcon
            ><svg lucidePencil aria-hidden="true"></svg></span
          >Drafts
        </div>
        <div uiAutocompleteItem value="Replies">
          <span uiAutocompleteItemIcon mirror
            ><svg lucideReply aria-hidden="true"></svg></span
          >Replies
        </div>
        <div uiAutocompleteItem value="Attachments">
          <span uiAutocompleteItemIcon
            ><svg lucideFile aria-hidden="true"></svg></span
          >Attachments
        </div>
        <div uiAutocompleteItem value="Archived">
          <span uiAutocompleteItemIcon
            ><svg lucideArchive aria-hidden="true"></svg></span
          >Archived
        </div>
        <div uiAutocompleteItem value="Scheduled">
          <span uiAutocompleteItemIcon
            ><svg lucideClock aria-hidden="true"></svg></span
          >Scheduled
        </div>
      </div>
    </div>
  </ng-container>`,
})
class Example {}

export { Example }
