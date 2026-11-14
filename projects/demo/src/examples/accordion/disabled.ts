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
    <div uiAccordion>
      @for (item of items; track item.value) {
        <div uiAccordionItem [value]="item.value" [disabled]="item.disabled">
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
      value: "access",
      label: "Can I access my account history?",
      content:
        "Yes. Every order and payment from the last five years is in your account.",
    },
    {
      value: "premium",
      label: "Premium feature information",
      content:
        "Premium includes priority support and early access to new features.",
      disabled: true,
    },
    {
      value: "email",
      label: "How do I update my email address?",
      content:
        "Open Settings, then Account, and change it there. We'll send a confirmation link.",
    },
  ]
}

export { Example }
