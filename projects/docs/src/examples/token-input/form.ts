import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  UiCheckbox,
  UiCheckboxIndicator,
  UiCheckboxInput,
} from "@ngx-ui-sdk/core/checkbox"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  type TokenInputValue,
  UiTokenInput,
  UiTokenInputEditor,
} from "@ngx-ui-sdk/core/token-input"
import { injectLog } from "../../shared/log"
import { uniqueId } from "../../shared/id"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    UiCheckbox,
    UiCheckboxIndicator,
    UiCheckboxInput,
    UiField,
    UiFieldLabel,
    UiTokenInput,
    UiTokenInputEditor,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <label data-slot="label">
          <button
            uiCheckbox
            #disabledBox="uiCheckbox"
            [checked]="disabled()"
            (checkedChange)="disabled.set($event === true)"
          >
            <span *uiCheckboxIndicator>
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
          </button>
          <input [uiCheckboxInput]="disabledBox" />
          Disabled
        </label>
        <label data-slot="label">
          <button
            uiCheckbox
            #readOnlyBox="uiCheckbox"
            [checked]="readOnly()"
            (checkedChange)="readOnly.set($event === true)"
          >
            <span *uiCheckboxIndicator>
              <svg lucideCheck aria-hidden="true"></svg>
            </span>
          </button>
          <input [uiCheckboxInput]="readOnlyBox" />
          Read-only
        </label>
      </div>
      <div data-slot="stack">
        <div uiField [disabled]="disabled()">
          <label uiFieldLabel>Prompt</label>
          <ng-container
            uiTokenInput
            [form]="formId"
            name="prompt"
            required
            [defaultValue]="draft"
            [readOnly]="readOnly()"
          >
            <div uiTokenInputEditor></div>
          </ng-container>
        </div>
        <form [id]="formId" data-slot="row" (submit)="onSubmit($event)">
          <button type="submit" data-variant="solid">Submit</button>
          <button type="reset">Reset</button>
        </form>
      </div>
    </div>
  `,
})
class Example {
  protected readonly draft: TokenInputValue = [
    "Explain ",
    { type: "file", value: "src/routes.ts", label: "routes.ts" },
    " in two sentences.",
  ]
  protected readonly log = injectLog()
  protected readonly disabled = signal(false)
  protected readonly readOnly = signal(false)
  protected readonly formId = uniqueId()

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.log(
      `Submitted ${new FormData(event.currentTarget as HTMLFormElement).get("prompt") ?? ""}`
    )
  }
}

export { Example }
