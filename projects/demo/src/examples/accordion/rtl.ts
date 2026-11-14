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
    <div dir="rtl">
      <div uiAccordion [defaultValue]="['shipping']">
        @for (item of items; track item.value) {
          <div uiAccordionItem [value]="item.value">
            <h3 uiAccordionHeader>
              <button uiAccordionTrigger>
                {{ item.label }}
                <svg lucideChevronDown></svg>
              </button>
            </h3>
            <div *uiAccordionPanel>
              {{ item.content }}
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly items = [
    {
      value: "shipping",
      label: "ما هي خيارات الشحن؟",
      content: "نقدم الشحن العادي والسريع والشحن في اليوم التالي.",
    },
    {
      value: "returns",
      label: "ما هي سياسة الإرجاع؟",
      content: "يمكنك إرجاع أي منتج غير مستخدم خلال ٣٠ يومًا.",
    },
    {
      value: "support",
      label: "كيف أتواصل مع الدعم؟",
      content: "راسلنا عبر البريد أو الدردشة، ونرد خلال ٢٤ ساعة.",
    },
  ]
}

export { Example }
