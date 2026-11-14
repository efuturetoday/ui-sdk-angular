import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  type PopoverOpenChangeDetails,
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
  UiField,
  UiFieldLabel,
  UiInput,
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
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
    <div data-slot="stack">
      <div #controls data-slot="controls">
        <label data-slot="label">
          <button
            uiCheckbox
            #box="uiCheckbox"
            [checked]="open()"
            (checkedChange)="open.set($event === true)"
          >
            <span *uiCheckboxIndicator>
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
          </button>
          <input [uiCheckboxInput]="box" />
          Open
        </label>
      </div>
      <ng-container
        uiPopover
        [(open)]="open"
        (beforeOpenChange)="onOpenChange($event.open, $event.details, controls)"
      >
        <button uiPopoverTrigger>Set Status</button>
        <div *uiPopoverContent>
          <h2 uiPopoverTitle>Set a status</h2>
          <p uiPopoverDescription>Your team sees it next to your name.</p>
          <div uiField>
            <label uiFieldLabel>Status</label>
            <input uiInput defaultValue="In a meeting" />
          </div>
          <div data-slot="row">
            <button uiPopoverClose>Cancel</button>
            <button uiPopoverClose data-variant="solid">Save</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly open = signal(false)

  protected onOpenChange(
    next: boolean,
    details: PopoverOpenChangeDetails,
    controls: HTMLElement
  ) {
    const target = details.event?.target
    const inControls = target instanceof Node && controls.contains(target)
    if (inControls && details.reason !== "escape-key") {
      return details.cancel()
    }
    this.log(`${next ? "Opened" : "Closed"} (${details.reason})`)
  }
}

export { Example }
