import { Component, signal } from "@angular/core"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import { UiInput } from "@ngx-ui-sdk/core/input"
import {
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "@ngx-ui-sdk/core/popover"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldLabel,
    UiInput,
    UiPopover,
    UiPopoverClose,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <ng-container uiPopover [(open)]="open">
      <button uiPopoverTrigger>Edit Profile</button>
      <div *uiPopoverContent>
        <h2 uiPopoverTitle>Edit profile</h2>
        <p uiPopoverDescription>Your name shows on your posts.</p>
        <form data-slot="stack" (submit)="onSubmit($event)">
          <div uiField>
            <label uiFieldLabel>Name</label>
            <input uiInput name="name" required defaultValue="Hollis Grant" />
          </div>
          <div data-slot="row">
            <button uiPopoverClose>Cancel</button>
            <button type="submit" data-variant="solid">Save</button>
          </div>
        </form>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly open = signal(false)

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.log(
      `Saved ${new FormData(event.currentTarget as HTMLFormElement).get("name")}`
    )
    this.open.set(false)
  }
}

export { Example }
