import { Component } from "@angular/core"
import { perfItems, perfModal, perfSize } from "tests/fixtures/perf"
import {
  UiPopover,
  UiPopoverClose,
  UiPopoverContent,
  UiPopoverTrigger,
} from "ui-sdk-angular"

// Many popovers on one page, like a row action in every row of a table, for
// the counts specs. Only the first one is opened. ?modal opens them modal.
@Component({
  selector: "app-fixture",
  imports: [UiPopover, UiPopoverClose, UiPopoverContent, UiPopoverTrigger],
  template: `
    <div class="fixture" style="flex-wrap: wrap">
      <button>Before</button>
      @for (item of items; track item.value) {
        <ng-container uiPopover [modal]="modal">
          <button uiPopoverTrigger>{{ item.label }}</button>
          <div *uiPopoverContent class="popup" [attr.aria-label]="item.label">
            {{ item.label }} details.
            <button uiPopoverClose>Close</button>
          </div>
        </ng-container>
      }
      <button>After</button>
    </div>
  `,
})
class Fixture {
  protected readonly items = perfItems(perfSize())
  protected readonly modal = perfModal()
}

export { Fixture }
