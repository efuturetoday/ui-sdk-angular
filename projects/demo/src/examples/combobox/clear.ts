import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideX } from "@lucide/angular"
import {
  type ComboboxValueChangeDetails,
  UiCombobox,
  UiComboboxClear,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxTrigger,
} from "ngx-ui-sdk/combobox"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    LucideX,
    UiCombobox,
    UiComboboxClear,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxTrigger,
  ],
  template: `<ng-container
    uiCombobox
    [(value)]="value"
    [itemToLabel]="frameworkLabel"
    (beforeValueChange)="changeValue($event.value, $event.details)"
    ><div data-slot="stack">
      <div uiComboboxLabel>Framework</div>
      <div data-slot="row">
        <input uiComboboxInput placeholder="Select a framework" /><button
          *uiComboboxClear
          aria-label="Clear framework"
        >
          <svg lucideX aria-hidden="true"></svg></button
        ><button uiComboboxTrigger aria-label="Show frameworks">
          <svg lucideChevronDown aria-hidden="true"></svg>
        </button>
      </div>
    </div>
    <div *uiComboboxContent>
      <div uiComboboxEmpty>No frameworks found.</div>
      <div uiComboboxList>
        @for (framework of frameworks; track framework.value) {
          <div
            uiComboboxItem
            [value]="framework.value"
            [label]="framework.label"
          >
            {{ framework.label
            }}<span *uiComboboxItemIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </div>
        }
      </div></div
  ></ng-container>`,
})
class Example {
  protected readonly frameworks = [
    { value: "next", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt", label: "Nuxt" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
    { value: "solidstart", label: "SolidStart" },
    { value: "qwik", label: "Qwik City" },
  ]
  protected readonly frameworkLabel = (value: string) =>
    this.frameworks.find((framework) => framework.value === value)?.label ??
    value
  protected readonly log = injectLog()
  protected readonly value = signal<unknown>("sveltekit")

  protected changeValue(next: unknown, details: ComboboxValueChangeDetails) {
    this.log(
      `${next ? this.frameworkLabel(next as string) : "Cleared"} (${details.reason})`
    )
  }
}

export { Example }
