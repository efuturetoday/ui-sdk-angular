import { Component } from "@angular/core"
import { LucideCheck, LucideMinus, LucideX } from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxChip,
  UiComboboxChipRemove,
  UiComboboxChips,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxGroup,
  UiComboboxGroupLabel,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxSelectAll,
  UiComboboxValue,
} from "@ngx-ui-sdk/core/combobox"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideMinus,
    LucideX,
    UiCombobox,
    UiComboboxChip,
    UiComboboxChipRemove,
    UiComboboxChips,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxGroup,
    UiComboboxGroupLabel,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxSelectAll,
    UiComboboxValue,
  ],
  template: `
    <ng-container uiCombobox multiple [defaultValue]="['Europe/Paris']">
      <div data-slot="stack">
        <div uiComboboxLabel>Timezones</div>
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
          <input uiComboboxInput placeholder="Add timezones…" />
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty>No timezones found.</div>
        <div uiComboboxList>
          <div uiComboboxSelectAll>
            <span>
              <svg lucideCheck aria-hidden="true"></svg
              ><svg lucideMinus aria-hidden="true"></svg>
            </span>
            Select all
          </div>
          @for (group of timezones; track group.label) {
            <div uiComboboxGroup>
              <div uiComboboxGroupLabel>{{ group.label }}</div>
              <div uiComboboxSelectAll #all="uiComboboxSelectAll">
                {{
                  all.state().checked
                    ? "Clear " + group.label
                    : "Select all in " + group.label
                }}
              </div>
              @for (zone of group.items; track zone.value) {
                <div uiComboboxItem [value]="zone.value" [label]="zone.label">
                  <span>
                    <span *uiComboboxItemIndicator>
                      <svg lucideCheck aria-hidden="true"></svg>
                    </span>
                  </span>
                  {{ zone.label }}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  protected readonly timezones = [
    {
      label: "Americas",
      items: [
        { value: "America/New_York", label: "New York" },
        { value: "America/Chicago", label: "Chicago" },
        { value: "America/Denver", label: "Denver" },
        { value: "America/Los_Angeles", label: "Los Angeles" },
        { value: "America/Sao_Paulo", label: "São Paulo" },
      ],
    },
    {
      label: "Europe",
      items: [
        { value: "Europe/London", label: "London" },
        { value: "Europe/Paris", label: "Paris" },
        { value: "Europe/Berlin", label: "Berlin" },
        { value: "Europe/Madrid", label: "Madrid" },
      ],
    },
    {
      label: "Asia & Pacific",
      items: [
        { value: "Asia/Tokyo", label: "Tokyo" },
        { value: "Asia/Singapore", label: "Singapore" },
        { value: "Asia/Kolkata", label: "Kolkata" },
        { value: "Australia/Sydney", label: "Sydney" },
      ],
    },
  ]
  protected valuesOf(value: unknown) {
    return value as string[]
  }
}

export { Example }
