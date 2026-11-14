import { Component, computed, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  UiPopover,
  UiPopoverContent,
  UiPopoverDescription,
  UiPopoverTitle,
  UiPopoverTrigger,
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectItemIndicator,
  UiSelectLabel,
  UiSelectTrigger,
  UiSelectValue,
} from "ngx-ui-sdk"

type Name = "sideOffset" | "alignOffset" | "collisionPadding"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideChevronDown,
    UiPopover,
    UiPopoverContent,
    UiPopoverDescription,
    UiPopoverTitle,
    UiPopoverTrigger,
    UiSelect,
    UiSelectContent,
    UiSelectItem,
    UiSelectItemIndicator,
    UiSelectLabel,
    UiSelectTrigger,
    UiSelectValue,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        @for (choice of choices; track choice.name) {
          <ng-container
            uiSelect
            [items]="choice.values"
            [value]="offsets()[choice.name]"
            (valueChange)="setOffset(choice.name, $event)"
            ><div uiSelectLabel>{{ choice.label }}</div>
            <button uiSelectTrigger>
              <span uiSelectValue></span
              ><svg lucideChevronDown aria-hidden="true"></svg>
            </button>
            <div *uiSelectContent>
              @for (value of choice.values; track value) {
                <div uiSelectItem [value]="value">
                  {{ value }}px
                  <span *uiSelectItemIndicator
                    ><svg lucideCheck aria-hidden="true"></svg
                  ></span>
                </div>
              }</div
          ></ng-container>
        }
      </div>
      <ng-container uiPopover
        ><button uiPopoverTrigger>Delivery</button>
        <div
          *uiPopoverContent="
            let state;
            align: 'start';
            sideOffset: sideOffset();
            alignOffset: alignOffset();
            collisionPadding: collisionPadding()
          "
        >
          <h2 uiPopoverTitle>Delivery window</h2>
          <p uiPopoverDescription>Arrives Tuesday between 9 AM and noon.</p>
        </div></ng-container
      >
    </div>
  `,
})
class Example {
  protected readonly choices: {
    name: Name
    label: string
    values: string[]
  }[] = [
    {
      name: "sideOffset",
      label: "Side offset",
      values: ["4", "8", "16", "24"],
    },
    { name: "alignOffset", label: "Align offset", values: ["-16", "0", "16"] },
    {
      name: "collisionPadding",
      label: "Collision padding",
      values: ["8", "24", "48"],
    },
  ]
  protected readonly offsets = signal<Record<Name, string>>({
    sideOffset: "8",
    alignOffset: "0",
    collisionPadding: "8",
  })
  protected readonly sideOffset = computed(() =>
    Number(this.offsets().sideOffset)
  )
  protected readonly alignOffset = computed(() =>
    Number(this.offsets().alignOffset)
  )
  protected readonly collisionPadding = computed(() =>
    Number(this.offsets().collisionPadding)
  )

  protected setOffset(name: Name, next: unknown) {
    if (next) {
      this.offsets.update((offsets) => ({ ...offsets, [name]: next as string }))
    }
  }
}

export { Example }
