import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiListbox,
  UiListboxItem,
  UiListboxItemIndicator,
} from "@ngx-ui-sdk/core/listbox"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [LucideCheck, UiListbox, UiListboxItem, UiListboxItemIndicator],
  template: `
    <div data-slot="stack">
      <div
        uiListbox
        multiple
        name="toppings"
        form="pizza-order"
        required
        [defaultValue]="['cheese']"
        aria-label="Toppings">
        @for (topping of toppings; track topping.value) {
          <div uiListboxItem [value]="topping.value">
            {{ topping.label }}
            <span *uiListboxItemIndicator>
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
          </div>
        }
      </div>
      <form id="pizza-order" data-slot="row" (submit)="onSubmit($event)">
        <button type="reset">Reset</button>
        <button data-variant="solid">Order</button>
      </form>
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
  protected readonly log = injectLog()

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.log(
      `Ordered ${new FormData(event.currentTarget as HTMLFormElement).getAll("toppings").join(", ")}`
    )
  }
}

export { Example }
