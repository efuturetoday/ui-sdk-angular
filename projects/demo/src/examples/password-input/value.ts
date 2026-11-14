import { Component, computed, signal } from "@angular/core"
import { LucideEye, LucideEyeOff } from "@lucide/angular"
import { UiField, UiFieldLabel } from "@ngx-ui-sdk/core/field"
import {
  UiPasswordInput,
  UiPasswordInputControl,
  UiPasswordInputToggle,
} from "@ngx-ui-sdk/core/password-input"

@Component({
  selector: "app-example",
  imports: [
    LucideEye,
    LucideEyeOff,
    UiField,
    UiFieldLabel,
    UiPasswordInput,
    UiPasswordInputControl,
    UiPasswordInputToggle,
  ],
  template: `
    <div uiField name="new-password">
      <label uiFieldLabel>New password</label>
      <div uiPasswordInput [(value)]="value" autoComplete="new-password">
        <input uiPasswordInputControl />
        <button
          uiPasswordInputToggle
          #toggle="uiPasswordInputToggle"
          aria-label="Show password"
        >
          @if (toggle.state().visible) {
            <svg lucideEyeOff aria-hidden="true"></svg>
          } @else {
            <svg lucideEye aria-hidden="true"></svg>
          }
        </button>
      </div>
      <div data-slot="strength" aria-hidden="true">
        @for (level of [1, 2, 3, 4]; track level) {
          <div [attr.data-on]="score() >= level ? '' : null"></div>
        }
      </div>
      <output data-slot="output">
        {{ summary() }}
      </output>
    </div>
  `,
})
class Example {
  protected readonly value = signal("")
  protected readonly score = computed(
    () =>
      [
        this.value().length >= 8,
        this.value().length >= 12,
        /[a-z]/.test(this.value()) && /[A-Z]/.test(this.value()),
        /\d/.test(this.value()) && /[^a-zA-Z\d]/.test(this.value()),
      ].filter(Boolean).length
  )
  protected readonly summary = computed(() =>
    this.value()
      ? `Strength: ${["Weak", "Weak", "Fair", "Good", "Strong"][this.score()]} (${this.value().length} characters)`
      : "Type a password to rate it."
  )
}

export { Example }
