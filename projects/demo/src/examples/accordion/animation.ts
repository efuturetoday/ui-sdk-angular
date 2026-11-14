import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  UiAccordion,
  UiAccordionHeader,
  UiAccordionItem,
  UiAccordionPanel,
  UiAccordionTrigger,
} from "ngx-ui-sdk/accordion"

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
    <div uiAccordion [defaultValue]="['one']">
      @for (item of items; track item.value) {
        <div uiAccordionItem [value]="item.value">
          <h3 uiAccordionHeader>
            <button uiAccordionTrigger>
              {{ item.label }}
              <svg lucideChevronDown aria-hidden="true"></svg>
            </button>
          </h3>
          <div *uiAccordionPanel>
            {{ item.content }}
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly items = [
    {
      value: "one",
      label: "Why animate the height?",
      content: "So the content below slides instead of jumping.",
    },
    {
      value: "two",
      label: "Where does the height come from?",
      content:
        "The panel measures itself and writes the result to a CSS variable while it animates.",
    },
    {
      value: "three",
      label: "Does it animate on first paint?",
      content: "No. Panels open on the server or on mount show at once.",
    },
  ]
}

export { Example }
