import { Component } from "@angular/core"
import { LucideCheck, LucidePlus } from "@lucide/angular"
import { UiCheckbox, UiCheckboxInput } from "ngx-ui-sdk/checkbox"

@Component({
  selector: "app-example",
  imports: [LucideCheck, LucidePlus, UiCheckbox, UiCheckboxInput],
  template: `
    <fieldset>
      <legend>Topics you follow</legend>
      <div data-slot="row">
        @for (topic of topics; track topic.value) {
          <button
            uiCheckbox
            #box="uiCheckbox"
            name="topics"
            [value]="topic.value"
            [defaultChecked]="topic.checked"
          >
            @if (box.state().checked) {
              <svg lucideCheck></svg>
            } @else {
              <svg lucidePlus></svg>
            }
            {{ topic.label }}
          </button>
          <input [uiCheckboxInput]="box" />
        }
      </div>
    </fieldset>
  `,
})
class Example {
  protected readonly topics = [
    { value: "design", label: "Design", checked: true },
    { value: "engineering", label: "Engineering", checked: false },
    { value: "marketing", label: "Marketing", checked: false },
    { value: "sales", label: "Sales", checked: false },
  ]
}

export { Example }
