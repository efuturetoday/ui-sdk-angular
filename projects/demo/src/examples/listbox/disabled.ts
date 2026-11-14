import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiListbox,
  UiListboxItem,
  UiListboxItemIndicator,
} from "ngx-ui-sdk/listbox"

@Component({
  selector: "app-example",
  imports: [LucideCheck, UiListbox, UiListboxItem, UiListboxItemIndicator],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="disabled.set(!disabled())">
          {{ disabled() ? "Enable the List" : "Disable the List" }}
        </button>
      </div>
      <div
        uiListbox
        multiple
        [disabled]="disabled()"
        [defaultValue]="['basil']"
        aria-label="Toppings"
      >
        @for (topping of toppings; track topping.value) {
          <div
            uiListboxItem
            [value]="topping.value"
            [disabled]="topping.value === 'olive'"
          >
            {{ topping.label }}
            <span *uiListboxItemIndicator
              ><svg lucideCheck aria-hidden="true"></svg
            ></span>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly toppings = [
    { value: "basil", label: "Basil" },
    { value: "cheese", label: "Extra cheese" },
    { value: "mushroom", label: "Mushroom" },
    { value: "olive", label: "Olive" },
    { value: "onion", label: "Onion" },
    { value: "pepper", label: "Pepper" },
  ]
  protected readonly disabled = signal(false)
}

export { Example }
