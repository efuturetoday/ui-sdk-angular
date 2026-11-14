import { Component, signal } from "@angular/core"
import {
  formFixture as f,
  formOptions,
  invalidOf,
  messageOf,
  save,
  serializeData,
  without,
  type FormErrors,
} from "tests/fixtures/form"
import {
  UiField,
  UiFieldDescription,
  UiFieldError,
  UiFieldLabel,
  UiFieldLegend,
  UiFieldSet,
  UiInput,
  UiInputClear,
  UiInputGroup,
  UiTextarea,
  type InputValueChangeReason,
} from "ngx-ui-sdk"
import type { ChangeDetails } from "@ui-sdk/core"

type Change = {
  value: string
  details: ChangeDetails<InputValueChangeReason>
}

@Component({
  selector: "app-fixture",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldError,
    UiFieldLabel,
    UiFieldLegend,
    UiFieldSet,
    UiInput,
    UiInputClear,
    UiInputGroup,
    UiTextarea,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
        (reset)="errors.set(undefined)"
      >
        <fieldset
          uiFieldSet
          class="form"
          [disabled]="options.disabled || undefined"
        >
          <legend uiFieldLegend>{{ f.profile.legend }}</legend>
          <p uiFieldDescription>{{ f.profile.description }}</p>
          <div
            uiField
            [name]="f.username.name"
            [invalid]="invalidOf(errors(), f.username.name)"
          >
            <label uiFieldLabel class="label">{{ f.username.label }}</label>
            <input
              uiInput
              class="input"
              required
              minlength="3"
              [value]="options.controlled ? username() : undefined"
              (beforeValueChange)="onUsername($event)"
            />
            <p uiFieldDescription>{{ f.username.description }}</p>
            <div *uiFieldError="let state" class="field-error">
              {{ messageOf(errors(), f.username.name) || state().message }}
            </div>
          </div>
          <div
            uiField
            [name]="f.bio.name"
            [invalid]="invalidOf(errors(), f.bio.name)"
          >
            <label uiFieldLabel class="label">{{ f.bio.label }}</label>
            <textarea
              uiTextarea
              class="textarea"
              autoResize
              [submitShortcut]="options.submitShortcut"
            ></textarea>
            <p uiFieldDescription>{{ f.bio.description }}</p>
            <div *uiFieldError="let state" class="field-error">
              {{ messageOf(errors(), f.bio.name) || state().message }}
            </div>
          </div>
        </fieldset>
        <fieldset
          uiFieldSet
          class="form"
          [disabled]="contactDisabled() || undefined"
        >
          <legend uiFieldLegend>{{ f.contact.legend }}</legend>
          <div
            uiField
            [name]="f.email.name"
            [invalid]="invalidOf(errors(), f.email.name)"
          >
            <label uiFieldLabel class="label">{{ f.email.label }}</label>
            <input
              uiInput
              class="input"
              type="email"
              [defaultValue]="f.email.defaultValue"
              (beforeValueChange)="errors.set(without(errors(), f.email.name))"
            />
            <div *uiFieldError="let state" class="field-error">
              {{ messageOf(errors(), f.email.name) || state().message }}
            </div>
          </div>
          <div uiField [name]="f.website.name">
            <label uiFieldLabel class="label">{{ f.website.label }}</label>
            <div uiInputGroup class="input-group">
              <span>{{ f.website.prefix }}</span>
              <input
                uiInput
                class="input"
                (beforeValueChange)="onWebsite($event)"
              />
              <button *uiInputClear [attr.aria-label]="f.website.clear">
                ×
              </button>
            </div>
          </div>
        </fieldset>
        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <button type="button" (click)="contactDisabled.set(!contactDisabled())">
        Toggle contact
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = f
  protected readonly options = formOptions()
  protected readonly errors = signal<FormErrors | undefined>(
    this.options.errors
  )
  protected readonly action = signal("")
  protected readonly submitted = signal("")
  protected readonly username = signal("")
  protected readonly contactDisabled = signal(false)
  protected readonly invalidOf = invalidOf
  protected readonly messageOf = messageOf
  protected readonly without = without
  #pending = false

  protected async onSubmit(event: Event) {
    event.preventDefault()
    if (this.#pending) {
      return
    }
    const data = new FormData(event.currentTarget as HTMLFormElement)
    this.#pending = true
    try {
      const result = await save(data, this.options.action)
      this.errors.set(result)
      if (!result) {
        this.submitted.set(serializeData(data))
      }
    } catch {
      // The fake server failed. The page keeps what it showed.
    } finally {
      this.#pending = false
    }
  }

  protected onUsername({ value, details }: Change) {
    if (this.options.noDigits && /\d/.test(value)) {
      return details.cancel()
    }
    this.action.set(`${f.username.name}:${value}:${details.reason}`)
    this.username.set(value)
    this.errors.set(without(this.errors(), f.username.name))
  }

  protected onWebsite({ value, details }: Change) {
    this.action.set(`${f.website.name}:${value}:${details.reason}`)
  }
}

export { Fixture }
