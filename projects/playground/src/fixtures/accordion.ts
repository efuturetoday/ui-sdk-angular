import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import { accordionFixture, describeValue } from "tests/fixtures/accordion"
import { accordionOptions } from "tests/fixtures/page"
import {
  createAccordionController,
  UiAccordion,
  UiAccordionHeader,
  UiAccordionItem,
  UiAccordionPanel,
  UiAccordionTrigger,
  type AccordionValueChangeReason,
} from "ngx-ui-sdk/accordion"

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
        [defaultValue]="options.defaultValue"
        [multiple]="options.multiple"
        [disabled]="options.disabled"
        [keepMounted]="options.keepMounted"
        [hiddenUntilFound]="options.hiddenUntilFound"
        [collapsible]="options.collapsible"
        [controller]="controller"
        (beforeValueChange)="onValueChange($event)"
      >
        @for (item of fixture.items; track item.value) {
          <div
            uiAccordionItem
            class="accordion-item"
            [value]="item.value"
            [disabled]="item.disabled && !warrantyEnabled()"
            (openChangeComplete)="complete.set(item.value + ' ' + ($event ? 'open' : 'closed'))"
          >
            <h3 uiAccordionHeader class="accordion-header">
              <button uiAccordionTrigger class="accordion-trigger">{{ item.label }}</button>
            </h3>
            <div *uiAccordionPanel class="accordion-panel">
              {{ item.content }}
              @if (item.field) {
                <label> {{ item.field }} <input /></label>
              }
              @if (item.close) {
                <button (click)="controller.close(item.value)">{{ item.close }}</button>
              }
            </div>
          </div>
        }
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Last completed">{{ complete() }}</output>
      <button (click)="controller.open('support')">Show support</button>
      <button (click)="warrantyEnabled.set(!warrantyEnabled())">Toggle warranty</button>
    </div>
  `,
})
class Fixture {
  protected readonly fixture = accordionFixture
  protected readonly controller = createAccordionController()
  protected readonly options = (() => {
    const { cancel, ...options } = accordionOptions()
    return { ...options, cancel }
  })()
  protected readonly action = signal("")
  protected readonly complete = signal("")
  protected readonly warrantyEnabled = signal(false)

  protected onValueChange({
    value,
    details,
  }: {
    value: string[]
    details: ChangeDetails<AccordionValueChangeReason>
  }) {
    const cancel = this.options.cancel
    if (
      cancel &&
      value.includes(cancel) &&
      !this.controller.getValue().includes(cancel)
    ) {
      return details.cancel()
    }
    this.action.set(describeValue(value))
  }
}

export { Fixture }
