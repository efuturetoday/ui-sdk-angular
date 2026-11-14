import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxTrigger,
} from "@ngx-ui-sdk/core/combobox"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiCombobox,
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
    (openChangeComplete)="log($event ? 'Finished opening' : 'Finished closing')"
    ><div data-slot="stack">
      <div uiComboboxLabel>Framework</div>
      <div data-slot="row">
        <input uiComboboxInput placeholder="Select a framework" /><button
          uiComboboxTrigger
          aria-label="Show frameworks"
        >
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
            }}<span *uiComboboxItemIndicator="let state; keepMounted: true"
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
  protected readonly log = injectLog()
}

export { Example }
