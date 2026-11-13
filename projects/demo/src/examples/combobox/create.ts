import { Component, signal } from "@angular/core"
import {
  LucideCheck,
  LucideLoaderCircle,
  LucidePlus,
  LucideX,
} from "@lucide/angular"
import {
  UiCombobox,
  UiComboboxChip,
  UiComboboxChipRemove,
  UiComboboxChips,
  UiComboboxContent,
  UiComboboxCreate,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxValue,
} from "ui-sdk-angular"

const initialLabels = [
  "Bug",
  "Feature",
  "Documentation",
  "Design",
  "Performance",
  "Security",
  "Testing",
]

function saveLabel(name: string) {
  return new Promise<void>((resolve, reject) =>
    setTimeout(
      () =>
        name.length > 20
          ? reject(new Error("Labels are 20 characters at most."))
          : resolve(),
      800
    )
  )
}

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideLoaderCircle,
    LucidePlus,
    LucideX,
    UiCombobox,
    UiComboboxChip,
    UiComboboxChipRemove,
    UiComboboxChips,
    UiComboboxContent,
    UiComboboxCreate,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxLabel,
    UiComboboxList,
    UiComboboxValue,
  ],
  template: `<ng-container uiCombobox [(value)]="value" multiple
    ><div data-slot="stack">
      <div uiComboboxLabel>Labels</div>
      <div uiComboboxChips>
        <ng-container uiComboboxValue #selected="uiComboboxValue">
          @for (label of valuesOf(selected.state().value); track label) {
            <div uiComboboxChip [value]="label">
              {{ label
              }}<button
                uiComboboxChipRemove
                [attr.aria-label]="'Remove ' + label"
              >
                <svg lucideX aria-hidden="true"></svg>
              </button>
            </div>
          }</ng-container
        ><input uiComboboxInput placeholder="Add or create a label…" />
      </div>
    </div>
    <div *uiComboboxContent>
      <div uiComboboxList>
        @for (label of labels(); track label) {
          <div uiComboboxItem [value]="label">
            {{ label
            }}<span *uiComboboxItemIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </div>
        }
        <div *uiComboboxCreate="let state; minLength: 2; onCreate: create">
          @if (state().pending) {
            <svg lucideLoaderCircle aria-hidden="true" data-slot="spinner"></svg
            >Creating “{{ state().query }}”…
          } @else {
            <svg lucidePlus aria-hidden="true"></svg
            ><span data-slot="stack"
              >Create “{{ state().query }}”
              @if (state().error) {
                <span data-slot="hint">{{ messageOf(state().error) }}</span>
              }
            </span>
          }
        </div>
      </div>
    </div></ng-container
  >`,
})
class Example {
  protected readonly labels = signal(initialLabels)
  protected readonly value = signal<unknown>(["Bug"])

  protected readonly create = async (query: string) => {
    await saveLabel(query)
    this.labels.update((labels) => [...labels, query])
    this.value.update((value) => [...(value as string[]), query])
  }
  protected valuesOf(value: unknown) {
    return value as string[]
  }
  protected messageOf(error: unknown) {
    return (error as Error).message
  }
}

export { Example }
