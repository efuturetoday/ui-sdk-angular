import { Component } from "@angular/core"
import {
  LucideArrowRight,
  LucideCheck,
  LucideChevronDown,
  LucideCircle,
  LucideCircleCheck,
  LucideCircleX,
} from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIcon,
  UiComboboxItemIndicator,
  UiComboboxItemText,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxTrigger,
  UiComboboxValueIcon,
} from "ngx-ui-sdk/combobox"

@Component({
  selector: "app-example",
  imports: [
    LucideArrowRight,
    LucideCheck,
    LucideChevronDown,
    LucideCircle,
    LucideCircleCheck,
    LucideCircleX,
    UiCombobox,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIcon,
    UiComboboxItemIndicator,
    UiComboboxItemText,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxTrigger,
    UiComboboxValueIcon,
  ],
  template: `<ng-container uiCombobox
    ><div data-slot="stack">
      <div uiComboboxLabel>Status</div>
      <div #field data-slot="row">
        <span uiComboboxValueIcon></span
        ><input uiComboboxInput placeholder="Select a status" /><button
          uiComboboxTrigger
          aria-label="Show statuses"
        >
          <svg lucideChevronDown aria-hidden="true"></svg>
        </button>
      </div>
    </div>
    <div *uiComboboxContent="let state; anchor: field">
      <div uiComboboxEmpty>No statuses found.</div>
      <div uiComboboxList>
        <div uiComboboxItem value="backlog" label="Backlog">
          <span uiComboboxItemIcon
            ><svg lucideCircle aria-hidden="true"></svg></span
          ><span uiComboboxItemText></span
          ><span *uiComboboxItemIndicator
            ><svg lucideCheck aria-hidden="true"></svg
          ></span>
        </div>
        <div uiComboboxItem value="in-progress" label="In progress">
          <span uiComboboxItemIcon mirror
            ><svg lucideArrowRight aria-hidden="true"></svg></span
          ><span uiComboboxItemText></span
          ><span *uiComboboxItemIndicator
            ><svg lucideCheck aria-hidden="true"></svg
          ></span>
        </div>
        <div uiComboboxItem value="done" label="Done">
          <span uiComboboxItemIcon
            ><svg lucideCircleCheck aria-hidden="true"></svg></span
          ><span uiComboboxItemText></span
          ><span *uiComboboxItemIndicator
            ><svg lucideCheck aria-hidden="true"></svg
          ></span>
        </div>
        <div uiComboboxItem value="canceled" label="Canceled">
          <span uiComboboxItemIcon
            ><svg lucideCircleX aria-hidden="true"></svg></span
          ><span uiComboboxItemText></span
          ><span *uiComboboxItemIndicator
            ><svg lucideCheck aria-hidden="true"></svg
          ></span>
        </div>
      </div></div
  ></ng-container>`,
})
class Example {}

export { Example }
