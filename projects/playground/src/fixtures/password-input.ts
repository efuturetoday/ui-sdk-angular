import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  passwordInputAction,
  passwordInputFixture,
  passwordInputOptions,
} from "tests/fixtures/password-input"
import {
  UiField,
  UiFieldDescription,
  UiFieldLabel,
} from "@ngx-ui-sdk/core/field"
import {
  createPasswordInputController,
  UiPasswordInput,
  UiPasswordInputControl,
  UiPasswordInputToggle,
} from "@ngx-ui-sdk/core/password-input"

@Component({
  selector: "app-fixture",
  imports: [
    UiField,
    UiFieldDescription,
    UiFieldLabel,
    UiPasswordInput,
    UiPasswordInputControl,
    UiPasswordInputToggle,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form [attr.aria-label]="form.label" class="password-form" (submit)="onSubmit($event)">
        <fieldset>
          <legend>{{ form.account }}</legend>
          <label>
            {{ email.label }}
            <input class="input" [name]="email.name" [value]="email.defaultValue" />
          </label>
          <div uiField>
            <label uiFieldLabel>{{ password.label }}</label>
            <div
              uiPasswordInput
              class="password-input"
              [name]="password.name"
              [controller]="reveal"
              [disabled]="options.disabled"
              [readOnly]="options.readOnly"
              [autoComplete]="options.autoComplete"
              [visible]="options.controlled ? visible() : undefined"
              [defaultVisible]="options.controlled ? undefined : options.defaultVisible"
              (beforeVisibleChange)="onVisibleChange($event.visible, $event.details)"
            >
              <input uiPasswordInputControl class="input" />
              <button uiPasswordInputToggle class="password-toggle" [attr.aria-label]="password.toggle">
                <span aria-hidden="true">👁</span>
              </button>
            </div>
            <p uiFieldDescription>{{ password.description }}</p>
          </div>
          <p class="caps-lock">{{ password.capsLock }}</p>
        </fieldset>
        <button type="submit">{{ form.submit }}</button>
        <button type="reset">{{ form.reset }}</button>
      </form>
      <button (click)="reveal.toggleVisible()">{{ controllerLabel }}</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly options = (() => {
    const { controlled, cancel, ...options } = passwordInputOptions()
    return { ...options, controlled, cancel }
  })()
  protected readonly form = passwordInputFixture.form
  protected readonly email = passwordInputFixture.email
  protected readonly password = passwordInputFixture.password
  protected readonly controllerLabel = passwordInputFixture.controller
  protected readonly reveal = createPasswordInputController()
  protected readonly action = signal("")
  protected readonly visible = signal(!!this.options.defaultVisible)

  protected onVisibleChange(next: boolean, details: ChangeDetails) {
    if (this.options.cancel) {
      return details.cancel()
    }
    this.visible.set(next)
    this.action.set(passwordInputAction.visible(next, details.reason))
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    const field = (event.currentTarget as HTMLFormElement).elements.namedItem(
      this.password.name
    ) as HTMLInputElement
    this.action.set(passwordInputAction.submit(field.type))
  }
}

export { Fixture }
