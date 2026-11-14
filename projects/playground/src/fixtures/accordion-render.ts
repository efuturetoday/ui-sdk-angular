import { Component, signal } from "@angular/core"
import { describeValue } from "tests/fixtures/accordion"
import {
  UiAccordion,
  UiAccordionHeader,
  UiAccordionItem,
  UiAccordionPanel,
  UiAccordionTrigger,
} from "ui-sdk-angular"

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
    <div class="fixture">
      <button>Before</button>
      <div
        uiAccordion
        class="accordion"
        [defaultValue]="['overview']"
        (valueChange)="action.set(describeValue($event))"
      >
        <div uiAccordionItem #overview="uiAccordionItem" class="accordion-item" value="overview">
          <span [class]="overview.state().open ? 'is-open' : 'is-closed'" hidden></span>
          <h2 uiAccordionHeader class="accordion-header">
            <button uiAccordionTrigger #trigger="uiAccordionTrigger" class="accordion-trigger">
              Overview<span aria-hidden="true"> {{ trigger.state().open ? "−" : "+" }}</span>
              <span class="index" hidden>{{ trigger.state().index }}</span>
            </button>
          </h2>
          <section *uiAccordionPanel class="accordion-panel">The overview panel.</section>
        </div>
        <div uiAccordionItem class="accordion-item" value="details">
          <h3 uiAccordionHeader class="accordion-header">
            <div uiAccordionTrigger class="accordion-trigger">Details</div>
          </h3>
          <div *uiAccordionPanel class="accordion-panel">The details panel.</div>
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly describeValue = describeValue
  protected readonly action = signal("")
}

export { Fixture }
