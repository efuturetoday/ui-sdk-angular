import { Component, computed, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
} from "ngx-ui-sdk/checkbox"
import {
  UiDialog,
  UiDialogBackdrop,
  UiDialogClose,
  UiDialogContent,
  UiDialogDescription,
  UiDialogTitle,
  UiDialogTrigger,
} from "ngx-ui-sdk/dialog"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
} from "ngx-ui-sdk/select"

type Mode = "true" | "trap-focus" | "false"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiDialog,
    UiDialogBackdrop,
    UiDialogClose,
    UiDialogContent,
    UiDialogDescription,
    UiDialogTitle,
    UiDialogTrigger,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectLabel,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <ng-container
          uiSelect
          [items]="modes"
          [value]="mode()"
          (valueChange)="setMode($event)"
          ><div uiSelectLabel>Modal</div>
          <button uiSelectTrigger>
            <span uiSelectValue></span
            ><svg lucideChevronDown aria-hidden="true"></svg>
          </button>
          <div *uiSelectContent>
            @for (option of modes; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator
                  ><svg lucideCheck aria-hidden="true"></svg
                ></span>
              </div>
            }</div></ng-container
        ><label data-slot="label"
          ><button
            uiCheckbox
            #box="uiCheckbox"
            [checked]="outside()"
            (checkedChange)="outside.set($event === true)"
          >
            <span *uiCheckboxIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span></button
          ><input [uiCheckboxInput]="box" />Close on outside press</label
        >
      </div>
      <ng-container uiDialog [modal]="modal()" [closeOnOutsidePress]="outside()"
        ><button uiDialogTrigger>Open Notes</button>
        @if (modal() === true) {
          <div *uiDialogBackdrop></div>
        }
        <div *uiDialogContent>
          <div data-slot="stack">
            <h2 uiDialogTitle>Notes</h2>
            <p uiDialogDescription>{{ notes[mode()] }}</p>
          </div>
          <textarea aria-label="Notes">
Call the printer about the proofs.</textarea>
          <div data-slot="row">
            <button uiDialogClose data-variant="solid">Done</button>
          </div>
        </div></ng-container
      >
    </div>
  `,
})
class Example {
  protected readonly modes = [
    { value: "true", label: "Modal" },
    { value: "trap-focus", label: "Trap focus" },
    { value: "false", label: "Non-modal" },
  ]
  protected readonly notes = {
    true: "The rest of the page is inert and doesn't scroll.",
    "trap-focus":
      "Tab stays inside, and the page still scrolls and takes clicks.",
    false:
      "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside.",
  }
  protected readonly mode = signal<Mode>("false")
  protected readonly outside = signal(false)
  protected readonly modal = computed(() =>
    this.mode() === "true"
      ? true
      : this.mode() === "false"
        ? false
        : "trap-focus"
  )

  protected setMode(next: unknown) {
    if (next) {
      this.mode.set(next as Mode)
    }
  }
}

export { Example }
