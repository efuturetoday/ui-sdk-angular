import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  type ComboboxValueChangeDetails,
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCombobox,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxLabel,
    UiComboboxList,
  ],
  template: `<ng-container
    uiCombobox
    [(value)]="value"
    allowCustomValue
    (beforeValueChange)="changeValue($event.value, $event.details)"
    ><div data-slot="stack">
      <div uiComboboxLabel>Job title</div>
      <input uiComboboxInput placeholder="Type any title…" />
    </div>
    <div *uiComboboxContent>
      <div uiComboboxEmpty #empty="uiComboboxEmpty">
        @if (empty.state().empty) {
          Press Enter to use “{{ empty.state().query }}”.
        }
      </div>
      <div uiComboboxList>
        @for (title of titles; track title) {
          <div uiComboboxItem [value]="title">
            {{ title
            }}<span *uiComboboxItemIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </div>
        }
      </div></div
  ></ng-container>`,
})
class Example {
  protected readonly titles = [
    "Designer",
    "Engineer",
    "Engineering manager",
    "Product manager",
    "Researcher",
  ]
  protected readonly log = injectLog()
  protected readonly value = signal<unknown>(null)

  protected changeValue(next: unknown, details: ComboboxValueChangeDetails) {
    this.log(`${next ? `“${next}”` : "No title"} (${details.reason})`)
  }
}

export { Example }
