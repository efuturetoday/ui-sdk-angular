import { Component } from "@angular/core"
import { perfSize } from "tests/fixtures/perf"
import {
  UiAccordion,
  UiAccordionHeader,
  UiAccordionItem,
  UiAccordionPanel,
  UiAccordionTrigger,
} from "ngx-ui-sdk"

// An accordion of N items, like a long FAQ.
// Every item starts closed. With ?found, closed panels stay in the page for
// find in page.
@Component({
  selector: "app-fixture",
  imports: [
    UiAccordion,
    UiAccordionHeader,
    UiAccordionItem,
    UiAccordionPanel,
    UiAccordionTrigger,
  ],
  template: `
    <div class="fixture" style="flex-direction: column; align-items: start">
      <button>Before</button>
      <div uiAccordion class="accordion" [hiddenUntilFound]="found">
        @for (index of items; track index) {
          <div uiAccordionItem class="accordion-item" [value]="'item-' + index">
            <h3 uiAccordionHeader class="accordion-header">
              <button uiAccordionTrigger class="accordion-trigger">Question {{ index + 1 }}</button>
            </h3>
            <div *uiAccordionPanel class="accordion-panel">Answer {{ index + 1 }}</div>
          </div>
        }
      </div>
      <button>After</button>
    </div>
  `,
})
class Fixture {
  protected readonly items = Array.from({ length: perfSize(200) }, (_, i) => i)
  protected readonly found = new URLSearchParams(location.search).has("found")
}

export { Fixture }
