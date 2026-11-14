import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  createAccordionController,
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
    <div>
      <div data-slot="controls">
        <button type="button" (click)="syllabus.openAll()">Expand all</button>
        <button type="button" (click)="syllabus.closeAll()">
          Collapse all
        </button>
      </div>
      <div data-slot="scroll">
        <div uiAccordion multiple [controller]="syllabus">
          @for (week of weeks; track week.value) {
            <div
              uiAccordionItem
              #element
              [value]="week.value"
              (beforeOpenChange)="
                openChange(week.value, $event.open, $event.details)
              "
              (openChangeComplete)="
                openChangeComplete(week.value, $event, element)
              "
            >
              <h3 uiAccordionHeader>
                <button uiAccordionTrigger>
                  {{ week.label }}
                  <svg lucideChevronDown aria-hidden="true"></svg>
                </button>
              </h3>
              <div *uiAccordionPanel>
                {{ week.content }}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  protected readonly weeks = [
    {
      value: "week-1",
      label: "Week 1: Foundations",
      content:
        "Set up your editor, meet the command line and write your first script.",
    },
    {
      value: "week-2",
      label: "Week 2: Data and types",
      content:
        "Strings, numbers, lists and objects, and how to tell them apart when a program runs.",
    },
    {
      value: "week-3",
      label: "Week 3: Control flow",
      content:
        "Conditions, loops and functions. The project this week is a small text adventure.",
    },
    {
      value: "week-4",
      label: "Week 4: Working with files",
      content:
        "Read and write files, parse CSV and JSON, and handle the errors that come with them.",
    },
    {
      value: "week-5",
      label: "Week 5: Final project",
      content:
        "Build a tool you'll use yourself, then present it to the group in a five-minute demo.",
    },
  ]
  protected readonly syllabus = createAccordionController()
  #pressed: string | null = null

  protected openChange(value: string, open: boolean, details: ChangeDetails) {
    if (open && details.reason === "trigger-press") {
      this.#pressed = value
    } else if (this.#pressed === value) {
      this.#pressed = null
    }
  }

  protected openChangeComplete(
    value: string,
    open: boolean,
    element: HTMLElement
  ) {
    if (!open || this.#pressed !== value) {
      return
    }
    this.#pressed = null
    element.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }
}

export { Example }
