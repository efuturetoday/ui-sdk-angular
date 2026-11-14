import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiListbox,
  UiListboxGroup,
  UiListboxGroupLabel,
  UiListboxItem,
  UiListboxItemIndicator,
  UiListboxSeparator,
} from "@ngx-ui-sdk/core/listbox"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiListbox,
    UiListboxGroup,
    UiListboxGroupLabel,
    UiListboxItem,
    UiListboxItemIndicator,
    UiListboxSeparator,
  ],
  template: `
    <div uiListbox multiple [defaultValue]="['banana']" aria-label="Produce">
      @for (group of produce; track group.label; let index = $index) {
        @if (index > 0) {
          <div uiListboxSeparator></div>
        }
        <div uiListboxGroup>
          <div uiListboxGroupLabel>{{ group.label }}</div>
          @for (item of group.items; track item.value) {
            <div uiListboxItem [value]="item.value">
              {{ item.label }}
              <span *uiListboxItemIndicator>
                <svg lucideCheck aria-hidden="true"></svg>
              </span>
            </div>
          }
        </div>
      }
    </div>
  `,
})
class Example {
  protected readonly produce = [
    {
      label: "Fruits",
      items: [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "orange", label: "Orange" },
      ],
    },
    {
      label: "Vegetables",
      items: [
        { value: "carrot", label: "Carrot" },
        { value: "broccoli", label: "Broccoli" },
        { value: "spinach", label: "Spinach" },
      ],
    },
  ]
}

export { Example }
