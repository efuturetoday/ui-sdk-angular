import { Component } from "@angular/core"
import {
  LucideArchive,
  LucideArrowRight,
  LucideMail,
  LucidePencil,
  LucideStar,
} from "@lucide/angular"
import { UiListbox, UiListboxItem, UiListboxItemIcon } from "ngx-ui-sdk/listbox"

@Component({
  selector: "app-example",
  imports: [
    LucideArchive,
    LucideArrowRight,
    LucideMail,
    LucidePencil,
    LucideStar,
    UiListbox,
    UiListboxItem,
    UiListboxItemIcon,
  ],
  template: `
    <div uiListbox defaultValue="inbox" aria-label="Mailbox">
      <div uiListboxItem value="inbox">
        <span uiListboxItemIcon><svg lucideMail></svg></span>
        Inbox
      </div>
      <div uiListboxItem value="starred">
        <span uiListboxItemIcon><svg lucideStar></svg></span>
        Starred
      </div>
      <div uiListboxItem value="drafts">
        <span uiListboxItemIcon><svg lucidePencil></svg></span>
        Drafts
      </div>
      <div uiListboxItem value="archive">
        <span uiListboxItemIcon><svg lucideArchive></svg></span>
        Archive
      </div>
      <div uiListboxItem value="next">
        <span uiListboxItemIcon mirror><svg lucideArrowRight></svg></span>
        Next page
      </div>
    </div>
  `,
})
class Example {}

export { Example }
