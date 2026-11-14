import { Component } from "@angular/core"
import { LucideCheck, LucideSlidersHorizontal } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideSlidersHorizontal,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiPopover,
    UiPopoverClose,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverTitle,
    UiPopoverTrigger,
  ],
  template: `
    <div data-slot="row">
      <input
        #search
        type="search"
        placeholder="Search files…"
        aria-label="Search files"
      />
      <ng-container uiPopover>
        <button uiPopoverTrigger aria-label="Search filters">
          <svg lucideSlidersHorizontal aria-hidden="true"></svg>
        </button>
        <div
          *uiPopoverContent="
            let state;
            anchor: search;
            align: 'start';
            sideOffset: 8
          "
        >
          <h2 uiPopoverTitle>Filters</h2>
          <p uiPopoverDescription>Show only these kinds of files.</p>
          <div data-slot="stack">
            @for (type of types; track type.label) {
              <label data-slot="label">
                <button
                  uiCheckbox
                  #box="uiCheckbox"
                  [defaultChecked]="type.checked"
                >
                  <span *uiCheckboxIndicator>
                    <svg lucideCheck aria-hidden="true"></svg>
                  </span>
                </button>
                <input [uiCheckboxInput]="box" />
                {{ type.label }}
              </label>
            }
          </div>
          <div data-slot="row">
            <button uiPopoverClose>Cancel</button>
            <button uiPopoverClose data-variant="solid">Apply</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  protected readonly types = [
    { label: "Documents", checked: true },
    { label: "Images", checked: false },
    { label: "Shared with me", checked: true },
  ]
}

export { Example }
