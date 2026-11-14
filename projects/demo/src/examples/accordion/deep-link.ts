import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  UiAccordion,
  UiAccordionHeader,
  UiAccordionItem,
  UiAccordionPanel,
  UiAccordionTrigger,
} from "@ngx-ui-sdk/core/accordion"

@Component({
  selector: "app-example",
  imports: [
    LucideChevronDown,
    UiAccordion,
    UiAccordionHeader,
    UiAccordionItem,
    UiAccordionPanel,
    UiAccordionTrigger,
  ],
  template: `
    <div>
      <nav data-slot="controls" aria-label="Jump to">
        <a href="#refund-timeline">Jump to the refund timeline</a>
        <a href="#return-label">Print a return label</a>
      </nav>
      <div uiAccordion hiddenUntilFound>
        <div uiAccordionItem value="returns">
          <h3 uiAccordionHeader>
            <button uiAccordionTrigger>
              Returns
              <svg lucideChevronDown aria-hidden="true"></svg>
            </button>
          </h3>
          <div *uiAccordionPanel>
            <div data-slot="stack">
              <p>
                Return any unused item in its original packaging within 30 days.
              </p>
              <p id="return-label">
                To print a return label, open the order and choose Return. The
                label is free.
              </p>
            </div>
          </div>
        </div>
        <div uiAccordionItem value="refunds">
          <h3 uiAccordionHeader>
            <button uiAccordionTrigger>
              Refunds
              <svg lucideChevronDown aria-hidden="true"></svg>
            </button>
          </h3>
          <div *uiAccordionPanel>
            <div data-slot="stack">
              <p>Refunds go back to the card you paid with.</p>
              <p id="refund-timeline">
                Timeline: we inspect the item within 2 days of receiving it, and
                your bank shows the refund 5 to 7 business days later.
              </p>
            </div>
          </div>
        </div>
        <div uiAccordionItem value="exchanges">
          <h3 uiAccordionHeader>
            <button uiAccordionTrigger>
              Exchanges
              <svg lucideChevronDown aria-hidden="true"></svg>
            </button>
          </h3>
          <div *uiAccordionPanel>
            <div data-slot="stack">
              <p>
                Start a return, choose Exchange and pick the new size. Shipping
                both ways is free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
