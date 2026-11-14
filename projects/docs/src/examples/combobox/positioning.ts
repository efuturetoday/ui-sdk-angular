import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
} from "@ngx-ui-sdk/core/checkbox"
import {
  UiCombobox,
  UiComboboxContent,
  UiComboboxEmpty,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIndicator,
  UiComboboxList,
} from "@ngx-ui-sdk/core/combobox"
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
} from "@ngx-ui-sdk/core/select"

type Side = "top" | "right" | "bottom" | "left"
type Align = "start" | "center" | "end"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiCombobox,
    UiComboboxContent,
    UiComboboxEmpty,
    UiComboboxInput,
    UiComboboxItem,
    UiComboboxItemIndicator,
    UiComboboxList,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectLabel,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `<div data-slot="stack">
    <div data-slot="controls">
      <ng-container
        uiSelect
        [items]="sides"
        [value]="side()"
        (valueChange)="setSide($event)"
        ><div uiSelectLabel>Side</div>
        <button uiSelectTrigger>
          <span uiSelectValue></span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          @for (option of sides; track option.value) {
            <div uiSelectItem [value]="option.value">
              {{ option.label
              }}<span *uiSelectItemIndicator
                ><svg lucideCheck aria-hidden="true"></svg
              ></span>
            </div>
          }</div></ng-container
      ><ng-container
        uiSelect
        [items]="aligns"
        [value]="align()"
        (valueChange)="setAlign($event)"
        ><div uiSelectLabel>Align</div>
        <button uiSelectTrigger>
          <span uiSelectValue></span
          ><svg lucideChevronDown aria-hidden="true"></svg>
        </button>
        <div *uiSelectContent>
          @for (option of aligns; track option.value) {
            <div uiSelectItem [value]="option.value">
              {{ option.label
              }}<span *uiSelectItemIndicator
                ><svg lucideCheck aria-hidden="true"></svg
              ></span>
            </div>
          }</div></ng-container
      ><label data-slot="label"
        ><button
          uiCheckbox
          #box="uiCheckbox"
          [checked]="anchored()"
          (checkedChange)="anchored.set($event === true)"
        >
          <span *uiCheckboxIndicator
            ><svg lucideCheck aria-hidden="true"></svg
          ></span></button
        ><input [uiCheckboxInput]="box" />Anchor to the box</label
      >
    </div>
    <div #card data-slot="card">
      <ng-container uiCombobox
        ><input
          uiComboboxInput
          aria-label="Framework"
          placeholder="Framework" />
        <div
          *uiComboboxContent="
            let state;
            side: side();
            align: align();
            sideOffset: 10;
            alignOffset: 0;
            collisionPadding: 16;
            anchor: anchored() ? card : null
          "
        >
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
      ></ng-container>
    </div>
  </div>`,
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
  protected readonly sides = [
    { value: "top", label: "Top" },
    { value: "right", label: "Right" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
  ]
  protected readonly aligns = [
    { value: "start", label: "Start" },
    { value: "center", label: "Center" },
    { value: "end", label: "End" },
  ]
  protected readonly side = signal<Side>("bottom")
  protected readonly align = signal<Align>("start")
  protected readonly anchored = signal(false)

  protected setSide(next: unknown) {
    if (next) {
      this.side.set(next as Side)
    }
  }
  protected setAlign(next: unknown) {
    if (next) {
      this.align.set(next as Align)
    }
  }
}

export { Example }
