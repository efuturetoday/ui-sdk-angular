import { Component, computed, signal } from "@angular/core"
import { UiButton, UiField, UiFieldLabel, UiInput } from "ngx-ui-sdk"
import { uniqueId } from "../../shared/id"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [UiButton, UiField, UiFieldLabel, UiInput],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Title</label>
        <input uiInput [(value)]="title" />
      </div>
      <div data-slot="row">
        <button
          uiButton
          [disabled]="!ready()"
          focusableWhenDisabled
          [attr.aria-describedby]="hint"
          (click)="log('Published “' + title() + '”')"
        >
          Publish
        </button>
        <p [id]="hint" data-slot="hint">
          {{ ready() ? "Ready to publish." : "Add a title to publish." }}
        </p>
      </div>
    </div>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly title = signal("")
  protected readonly hint = uniqueId()
  protected readonly ready = computed(() => this.title().trim() !== "")
}

export { Example }
