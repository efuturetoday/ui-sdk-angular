import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideX } from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxChip,
  UiComboboxChipRemove,
  UiComboboxChips,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxTrigger,
  UiComboboxValue,
} from "@ngx-ui-sdk/core/combobox"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    LucideX,
    UiCombobox,
    UiComboboxChip,
    UiComboboxChipRemove,
    UiComboboxChips,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxTrigger,
    UiComboboxValue,
  ],
  template: `
    <ng-container
      uiCombobox
      multiple
      [defaultValue]="['next', 'astro']"
      [itemToLabel]="frameworkLabel">
      <div data-slot="stack">
        <div uiComboboxLabel>Frameworks</div>
        <div data-slot="row">
          <div uiComboboxChips>
            <ng-container uiComboboxValue #value="uiComboboxValue">
              @for (
                item of valuesOf(value.state().value);
                track item;
                let index = $index
              ) {
                <div uiComboboxChip [value]="item">
                  {{ value.state().labels[index] }}
                  <button
                    uiComboboxChipRemove
                    [attr.aria-label]="'Remove ' + value.state().labels[index]">
                    <svg lucideX aria-hidden="true"></svg>
                  </button>
                </div>
              }
            </ng-container>
            <input uiComboboxInput placeholder="Add a framework…" />
          </div>
          <button uiComboboxTrigger aria-label="Show frameworks">
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
              [label]="framework.label">
              {{ framework.label }}
              <span *uiComboboxItemIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
              </span>
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
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
  protected valuesOf(value: unknown) {
    return value as string[]
  }
}

export { Example }
