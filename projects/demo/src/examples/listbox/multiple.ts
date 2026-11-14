import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiListbox,
  UiListboxItem,
  UiListboxItemIndicator,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [LucideCheck, UiListbox, UiListboxItem, UiListboxItemIndicator],
  template: `
    <div
      uiListbox
      multiple
      [defaultValue]="['cheese', 'onion']"
      aria-label="Toppings"
      (beforeValueChange)="
        log(
          ($any($event.value).join(', ') || 'Nothing') +
            ' (' +
            $event.details.reason +
            ')'
        )
      "
    >
      @for (topping of toppings; track topping.value) {
        <div uiListboxItem [value]="topping.value">
          {{ topping.label }}
          <span *uiListboxItemIndicator
            ><svg lucideCheck aria-hidden="true"></svg
          ></span>
        </div>
      }
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
}

export { Example }
