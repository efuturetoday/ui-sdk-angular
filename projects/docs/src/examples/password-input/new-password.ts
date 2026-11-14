import { Component, signal } from "@angular/core"
import { LucideCheck, LucideEye, LucideEyeOff, LucideX } from "@lucide/angular"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiPasswordInput,
  UiPasswordInputControl,
  UiPasswordInputToggle,
} from "@ngx-ui-sdk/core/password-input"

@Component({
  selector: "app-example",
  imports: [
    LucideCheck,
    LucideEye,
    LucideEyeOff,
    LucideX,
    UiField,
    UiFieldLabel,
    UiPasswordInput,
    UiPasswordInputControl,
    UiPasswordInputToggle,
  ],
  template: `
    <div uiField name="new-password">
      <label uiFieldLabel>Create a password</label>
      <div
        uiPasswordInput
        [value]="password()"
        autoComplete="new-password"
        (valueChange)="password.set($event)">
        <input uiPasswordInputControl />
        <button
          uiPasswordInputToggle
          #toggle="uiPasswordInputToggle"
          aria-label="Show password">
          @if (toggle.state().visible) {
            <svg lucideEyeOff aria-hidden="true"></svg>
          } @else {
            <svg lucideEye aria-hidden="true"></svg>
          }
        </button>
      </div>
      <ul data-slot="stack" aria-label="Password requirements">
        @for (rule of rules; track rule.label) {
          @if (rule.test(password())) {
            <li data-slot="row">
              <svg lucideCheck aria-hidden="true"></svg>
              <span data-slot="visually-hidden">Done:</span>
              {{ rule.label }}
            </li>
          } @else {
            <li data-slot="row">
              <svg lucideX aria-hidden="true"></svg>
              <span data-slot="visually-hidden">To do:</span>
              {{ rule.label }}
            </li>
          }
        }
      </ul>
    </div>
  `,
})
class Example {
  protected readonly rules = [
    {
      label: "At least 8 characters",
      test: (password: string) => password.length >= 8,
    },
    { label: "A number", test: (password: string) => /\d/.test(password) },
    {
      label: "An uppercase and a lowercase letter",
      test: (password: string) =>
        /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
  ]
  protected readonly password = signal("")
}

export { Example }
