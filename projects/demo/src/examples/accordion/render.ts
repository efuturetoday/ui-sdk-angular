import { Component } from "@angular/core"
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
    UiAccordion,
    UiAccordionHeader,
    UiAccordionItem,
    UiAccordionPanel,
    UiAccordionTrigger,
  ],
  template: `
    <div uiAccordion multiple [defaultValue]="['install']">
      @for (step of steps; track step.value) {
        <div uiAccordionItem [value]="step.value">
          <h4 uiAccordionHeader>
            <button uiAccordionTrigger #trigger="uiAccordionTrigger">
              @if (trigger.state().index >= 0) {
                <span data-slot="hint" aria-hidden="true">
                  {{ pad(trigger.state().index + 1) }}
                </span>
              }
              <span>{{ step.label }}</span>
              <span data-slot="hint" aria-hidden="true">
                {{ trigger.state().open ? "Hide" : "Show" }}
              </span>
            </button>
          </h4>
          <div *uiAccordionPanel>
            {{ step.content }}
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly steps = [
    {
      value: "install",
      label: "Install the package",
      content: "Add it with your package manager. It has no dependencies.",
    },
    {
      value: "import",
      label: "Import the parts",
      content: "Import the accordion parts you need from the package.",
    },
    {
      value: "style",
      label: "Style it",
      content: "Every part renders its state as data attributes you can style.",
    },
  ]

  protected pad(number: number) {
    return String(number).padStart(2, "0")
  }
}

export { Example }
