import { Component } from "@angular/core"
import { LucideCheck, LucideX } from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxChip,
  UiComboboxChipRemove,
  UiComboboxChips,
  UiComboboxChipsOverflow,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxValue,
} from "@ngx-ui-sdk/core/combobox"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideX,
    UiCombobox,
    UiComboboxChip,
    UiComboboxChipRemove,
    UiComboboxChips,
    UiComboboxChipsOverflow,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxValue,
  ],
  template: `<ng-container
    uiCombobox
    multiple
    [defaultValue]="['fr', 'jp', 'se', 'de', 'ch']"
    [itemToLabel]="countryLabel"
    ><div data-slot="stack">
      <div uiComboboxLabel>Countries</div>
      <div uiComboboxChips>
        <ng-container uiComboboxValue #value="uiComboboxValue">
          @for (
            item of valuesOf(value.state().value);
            track item;
            let index = $index
          ) {
            <div uiComboboxChip [value]="item">
              {{ value.state().labels[index]
              }}<button
                uiComboboxChipRemove
                [attr.aria-label]="'Remove ' + value.state().labels[index]"
              >
                <svg lucideX aria-hidden="true"></svg>
              </button>
            </div>
          }</ng-container
        ><span
          uiComboboxChipsOverflow
          #overflow="uiComboboxChipsOverflow"
          [title]="overflow.state().labels.join(', ')"
          data-slot="hint"
          >+{{ overflow.state().count }}</span
        ><input uiComboboxInput placeholder="Add…" />
      </div>
      <p data-slot="hint">
        <ng-container
          uiComboboxValue
          #summary="uiComboboxValue"
          [maxLabels]="2"
          [getMoreLabel]="moreLabel"
          >{{ summary.state().label }}</ng-container
        >
      </p>
    </div>
    <div *uiComboboxContent>
      <div uiComboboxEmpty>No countries found.</div>
      <div uiComboboxList>
        @for (country of countries; track country.value) {
          <div uiComboboxItem [value]="country.value" [label]="country.label">
            {{ country.label
            }}<span *uiComboboxItemIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </div>
        }
      </div></div
  ></ng-container>`,
})
class Example {
  protected readonly countries = [
    { value: "ar", label: "Argentina", keywords: ["república argentina"] },
    { value: "au", label: "Australia", keywords: ["oz"] },
    { value: "at", label: "Austria", keywords: ["österreich"] },
    { value: "be", label: "Belgium", keywords: ["belgië", "belgique"] },
    { value: "br", label: "Brazil", keywords: ["brasil"] },
    { value: "ca", label: "Canada" },
    { value: "cl", label: "Chile" },
    { value: "dk", label: "Denmark", keywords: ["danmark"] },
    { value: "fi", label: "Finland", keywords: ["suomi"] },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany", keywords: ["deutschland"] },
    { value: "gr", label: "Greece", keywords: ["hellas", "ελλάδα"] },
    { value: "jp", label: "Japan", keywords: ["nippon", "日本"] },
    { value: "nl", label: "Netherlands", keywords: ["holland", "nederland"] },
    { value: "es", label: "Spain", keywords: ["españa"] },
    { value: "se", label: "Sweden", keywords: ["sverige"] },
    {
      value: "ch",
      label: "Switzerland",
      keywords: ["schweiz", "suisse", "svizzera"],
    },
  ]
  protected readonly countryLabel = (value: string) =>
    this.countries.find((country) => country.value === value)?.label ?? value
  protected readonly moreLabel = (count: number) => `${count} more`
  protected valuesOf(value: unknown) {
    return value as string[]
  }
}

export { Example }
