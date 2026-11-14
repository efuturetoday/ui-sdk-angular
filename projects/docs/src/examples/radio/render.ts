import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import { UiRadio, UiRadioGroup, UiRadioInput } from "@ngx-ui-sdk/core/radio"
import { uniqueId } from "../../shared/id"

@Component({
  selector: "app-example",
  imports: [
    UiRadioInput,
    LucideCheck,
    UiField,
    UiFieldLabel,
    UiRadio,
    UiRadioGroup,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Notify me about</label>
      <div uiRadioGroup defaultValue="mentions">
        @for (option of options; track option.value) {
          <button
            uiRadio
            #radio="uiRadio"
            [value]="option.value"
            [attr.aria-labelledby]="id + '-' + option.value + '-label'"
            [attr.aria-describedby]="id + '-' + option.value + '-description'"
          >
            <span data-slot="stack">
              <span [id]="id + '-' + option.value + '-label'">
                {{ option.label }}
              </span>
              <span
                [id]="id + '-' + option.value + '-description'"
                data-slot="hint"
              >
                {{ option.description }}
              </span>
            </span>
            <svg
              lucideCheck
              aria-hidden="true"
              [attr.data-checked]="radio.state().checked ? '' : null"
            ></svg>
          </button>
          <input [uiRadioInput]="radio" />
        }
      </div>
    </div>
  `,
})
class Example {
  protected readonly options = [
    {
      value: "all",
      label: "Everything",
      description: "Every message and update.",
    },
    {
      value: "mentions",
      label: "Mentions",
      description: "Only when someone mentions you.",
    },
    { value: "none", label: "Nothing", description: "Turn notifications off." },
  ]
  protected readonly id = uniqueId()
}

export { Example }
