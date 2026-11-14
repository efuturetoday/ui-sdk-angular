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
    <div uiAccordion [collapsible]="false" [defaultValue]="['overview']">
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
      value: "overview",
      label: "Overview",
      content: "A summary of the project, its goals and its owners.",
    },
    {
      value: "timeline",
      label: "Timeline",
      content: "Kickoff in March, beta in June and launch in September.",
    },
    {
      value: "budget",
      label: "Budget",
      content: "Approved for two engineers and one designer for six months.",
    },
  ]
}

export { Example }
