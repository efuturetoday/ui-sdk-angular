import { Component, signal } from "@angular/core"
import {
  type PopoverDismissAttemptDetails,
  UiField,
  UiFieldControl,
  UiFieldLabel,
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiField,
    UiFieldControl,
    UiFieldLabel,
    UiPopover,
    UiPopoverClose,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <ng-container
      uiPopover
      [open]="open()"
      [dismissible]="note() === ''"
      (openChange)="$event ? open.set(true) : close()"
      (dismissAttempt)="onDismissAttempt($event)"
    >
      <button uiPopoverTrigger>Add Note</button>
      <div *uiPopoverContent>
        <h2 uiPopoverTitle>Add a note</h2>
        <p uiPopoverDescription>Only your team can see it.</p>
        <div uiField>
          <label uiFieldLabel>Note</label>
          <textarea
            #field
            uiFieldControl
            placeholder="Call the printer about the proofs."
            [value]="note()"
            (input)="note.set(field.value)"
          ></textarea>
          @if (asking()) {
            <div data-slot="row" role="alert">
              Discard your note?
              <div data-slot="row">
                <button
                  type="button"
                  data-size="sm"
                  (click)="asking.set(false); field.focus()"
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  data-size="sm"
                  data-variant="solid"
                  (click)="discard()"
                >
                  Discard
                </button>
              </div>
            </div>
          }
        </div>
        @if (!asking()) {
          <div data-slot="row">
            <button uiPopoverClose>Cancel</button>
            <button type="button" data-variant="solid" (click)="save()">
              Save
            </button>
          </div>
        }
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly open = signal(false)
  protected readonly note = signal("")
  protected readonly asking = signal(false)

  protected close() {
    this.open.set(false)
    this.note.set("")
    this.asking.set(false)
  }

  protected onDismissAttempt(details: PopoverDismissAttemptDetails) {
    this.log(`Kept open (${details.reason})`)
    this.asking.set(true)
  }

  protected discard() {
    this.log("Discarded the note")
    this.close()
  }

  protected save() {
    this.log(this.note() ? "Saved the note" : "Nothing to save")
    this.close()
  }
}

export { Example }
