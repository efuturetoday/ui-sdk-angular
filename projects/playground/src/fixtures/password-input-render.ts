import { Component, signal } from "@angular/core"
import {
  UiPasswordInput,
  UiPasswordInputControl,
  UiPasswordInputToggle,
} from "ngx-ui-sdk/password-input"

@Component({
  selector: "app-fixture",
  imports: [UiPasswordInput, UiPasswordInputControl, UiPasswordInputToggle],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiPasswordInput class="password-input" (visibleChange)="action.set('visible: ' + $event)">
        <input uiPasswordInputControl class="input" aria-label="Password" />
        <span
          uiPasswordInputToggle
          #toggle="uiPasswordInputToggle"
          aria-label="Show password"
          [class]="'password-toggle ' + (toggle.state().visible ? 'is-visible' : 'is-hidden')"
        >
          <span aria-hidden="true">{{ toggle.state().visible ? "Hide" : "Show" }}</span>
        </span>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly action = signal("")
}

export { Fixture }
