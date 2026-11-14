import { Component, signal } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  otpInputAction,
  otpInputFixture,
  otpInputOptions,
} from "tests/fixtures/otp-input"
import {
  createOTPInputController,
  UiOtpInput,
  UiOtpInputGroup,
  UiOtpInputSeparator,
  UiOtpInputSlot,
} from "@ngx-ui-sdk/core/otp-input"

const { code, recovery, form } = otpInputFixture

@Component({
  selector: "app-fixture",
  imports: [UiOtpInput, UiOtpInputGroup, UiOtpInputSeparator, UiOtpInputSlot],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form [attr.aria-label]="form.label" (submit)="onSubmit($event)">
        <div
          uiOtpInput
          class="otp"
          [attr.aria-label]="code.label"
          [name]="code.name"
          [maxLength]="code.length"
          [controller]="controller"
          [defaultValue]="o.defaultValue"
          [disabled]="o.disabled"
          [required]="o.required"
          (beforeValueChange)="onValueChange($event.value, $event.details)"
          (valueCommit)="action.set(otpInputAction.complete($event.value))"
        >
          @for (size of code.groups; track $index; let group = $index) {
            @if (group > 0) {
              <div uiOtpInputSeparator class="otp-separator">-</div>
            }
            <div uiOtpInputGroup class="otp-group">
              @for (slot of slotsOf(size); track slot) {
                <div
                  uiOtpInputSlot
                  class="otp-slot"
                  [index]="starts[group]! + slot"
                ></div>
              }
            </div>
          }
        </div>
        <button type="submit">{{ form.submit }}</button>
        <button type="reset">{{ form.reset }}</button>
      </form>
      <div
        uiOtpInput
        class="otp"
        [attr.aria-label]="recovery.label"
        [maxLength]="recovery.length"
        pattern="alphanumeric"
      >
        <div uiOtpInputGroup class="otp-group">
          @for (slot of slotsOf(recovery.length); track slot) {
            <div uiOtpInputSlot class="otp-slot" [index]="slot"></div>
          }
        </div>
      </div>
      <button (click)="controller.setValue(otpInputFixture.filled)">
        Fill code
      </button>
      <button (click)="controller.clear()">Clear code</button>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly code = code
  protected readonly recovery = recovery
  protected readonly form = form
  protected readonly otpInputFixture = otpInputFixture
  protected readonly otpInputAction = otpInputAction
  protected readonly o = otpInputOptions()
  protected readonly controller = createOTPInputController()
  protected readonly action = signal("")
  protected readonly submitted = signal("")
  // The first index of each group.
  protected readonly starts = code.groups.map((_, group) =>
    code.groups.slice(0, group).reduce((sum, size) => sum + size, 0)
  )

  protected slotsOf(size: number) {
    return Array.from({ length: size }, (_, index) => index)
  }

  protected onValueChange(value: string, details: ChangeDetails) {
    if (this.o.cancel && value.includes(this.o.cancel)) {
      return details.cancel()
    }
    this.action.set(otpInputAction.change(value, details.reason))
  }

  protected onSubmit(event: Event) {
    event.preventDefault()
    this.submitted.set(
      String(new FormData(event.currentTarget as HTMLFormElement).get(code.name))
    )
  }
}

export { Fixture }
