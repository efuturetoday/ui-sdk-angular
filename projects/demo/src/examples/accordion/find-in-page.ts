import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  UiAccordion,
  UiAccordionHeader,
  UiAccordionItem,
  UiAccordionPanel,
  UiAccordionTrigger,
} from "ngx-ui-sdk"

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
    <div uiAccordion hiddenUntilFound>
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
      value: "fruit",
      label: "Which fruit do you stock?",
      content: "Apples, pears, mangoes and, in summer, pineapple.",
    },
    {
      value: "organic",
      label: "Is it organic?",
      content: "Everything we stock is certified organic.",
    },
    {
      value: "delivery",
      label: "When do you deliver?",
      content: "Every weekday morning before 10.",
    },
  ]
}

export { Example }
