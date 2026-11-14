import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  UiAccordion,
  UiAccordionHeader,
  UiAccordionItem,
  UiAccordionPanel,
  UiAccordionTrigger,
} from "ui-sdk-angular"

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
    <div uiAccordion multiple [defaultValue]="['notifications']">
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
      value: "notifications",
      label: "Notification settings",
      content: "Choose what we email you about, and how often.",
    },
    {
      value: "privacy",
      label: "Privacy and security",
      content:
        "Turn on two-factor authentication and review signed-in devices.",
    },
    {
      value: "billing",
      label: "Billing and subscription",
      content: "Update your payment method and download past invoices.",
    },
  ]
}

export { Example }
