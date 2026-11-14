import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
  UiListbox,
  UiListboxItem,
  UiListboxItemIndicator,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiListbox,
    UiListboxItem,
    UiListboxItemIndicator,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Email me about</label>
      <div
        uiListbox
        multiple
        activation="automatic"
        [defaultValue]="['mentions']"
      >
        @for (topic of topics; track topic.value) {
          <div uiListboxItem [value]="topic.value">
            {{ topic.label }}
            <span *uiListboxItemIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </div>
        }
      </div>
      <p uiFieldDescription>
        Hold Shift to select a range, or Ctrl or ⌘ to add one.
      </p>
    </div>
  `,
})
class Example {
  protected readonly topics = [
    { value: "comments", label: "Comments" },
    { value: "mentions", label: "Mentions" },
    { value: "reactions", label: "Reactions" },
    { value: "sign-ins", label: "New sign-ins" },
    { value: "billing", label: "Billing" },
  ]
}

export { Example }
