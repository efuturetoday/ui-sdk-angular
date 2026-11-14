import { Directive, input, output } from "@angular/core"
import type { ChangeDetails, CommitDetails } from "@ui-sdk/core"
import {
  otpInput,
  type OTPInputController,
  type OTPInputOptions,
  type OTPInputPattern,
  type OTPInputValueChangeReason,
  type OtpInputPrimitive,
} from "@ui-sdk/core/otp-input"
import {
  injectFieldControl,
  ɵinjectInputInside as injectInputInside,
  optionalBoolean,
  ɵbindPart as bindPart,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  TextSource,
  showText,
} from "@ngx-ui-sdk/core"

/**
 * Why the code changes.
 * @experimental
 */
type OTPInputValueChangeDetails = ChangeDetails<OTPInputValueChangeReason>

// The root's attributes that belong to its one real input.
const inputAttributes = [
  "id",
  "autofocus",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-invalid",
]

/**
 * A one-time code field, on the element it's written on: its slots, and the
 * one real input over them, which it makes at its end. `id`, `autofocus` and
 * the `aria-*` naming attributes written on it move to that input.
 * @experimental
 */
@Directive({
  selector: "[uiOtpInput]",
  exportAs: "uiOtpInput",
  providers: [provideRoot(otpInput, () => UiOtpInput)],
})
class UiOtpInput {
  /** The code. Bind it, or `[(value)]`, to control it. */
  readonly value = input<string>()
  /** The code at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<string>()
  /** How many characters the code has. */
  readonly maxLength = input<number>()
  /** Which characters it takes: `"digits"`, `"alphanumeric"`, or a pattern. */
  readonly pattern = input<OTPInputPattern>()
  /** The keyboard a phone shows. */
  readonly inputMode = input<OTPInputOptions["inputMode"]>()
  /** Where the caret sits in the input over the slots. */
  readonly textAlign = input<OTPInputOptions["textAlign"]>()
  /** The browser's autofill hint, `"one-time-code"` by default. */
  readonly autoComplete = input<string>()
  /** Stops it from changing. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Shows the code without letting it change. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a form needs the code. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name the code submits under in a native form. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The id of the form it belongs to, if it isn't inside it. */
  readonly form = input<string>()
  /** Sets the code from anywhere. Create one with `createOTPInputController()`. */
  readonly controller = input<OTPInputController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new code once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string>()
  /** Emits before the code changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string
    details: OTPInputValueChangeDetails
  }>()
  /** Emits once the code is complete. */
  readonly valueCommit = output<{
    value: string
    details: CommitDetails<OTPInputValueChangeReason>
  }>()
  readonly #field = injectFieldControl()
  readonly handle: PrimitiveHandle<OtpInputPrimitive> = injectPrimitive(
    otpInput,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      maxLength: this.maxLength(),
      pattern: this.pattern(),
      inputMode: this.inputMode(),
      textAlign: this.textAlign(),
      autoComplete: this.autoComplete(),
      disabled: this.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      controller: this.controller(),
      debug: this.debug(),
      onValueChange: (value: string, details: OTPInputValueChangeDetails) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
      onValueCommit: (
        value: string,
        details: CommitDetails<OTPInputValueChangeReason>
      ) => this.valueCommit.emit({ value, details }),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The field's state. */
  readonly state = this.#part.state
  readonly #control = bindPart(
    () => this.handle,
    "control",
    () => ({}),
    injectInputInside(inputAttributes),
    undefined,
    this.#field?.join
  )
}

/**
 * Lays out a run of slots.
 * @experimental
 */
@Directive({ selector: "[uiOtpInputGroup]", exportAs: "uiOtpInputGroup" })
class UiOtpInputGroup {
  readonly #part = injectPart(injectHandle(otpInput), "group")
  /** The group's state. */
  readonly state = this.#part.state
}

/**
 * Drawn between groups, like a dash.
 * @experimental
 */
@Directive({
  selector: "[uiOtpInputSeparator]",
  exportAs: "uiOtpInputSeparator",
})
class UiOtpInputSeparator {
  readonly #part = injectPart(injectHandle(otpInput), "separator")
}

/**
 * One character of the code. With `uiText`, it shows the character; with
 * content of its own, the content.
 * @experimental
 */
@Directive({
  providers: [{ provide: TextSource, useExisting: UiOtpInputSlot }],
  selector: "[uiOtpInputSlot]",
  exportAs: "uiOtpInputSlot",
})
class UiOtpInputSlot implements TextSource {
  /** Which character it shows, from 0. */
  readonly index = input.required<number>()
  readonly #part = injectPart(injectHandle(otpInput), "slot", () => ({
    index: this.index(),
    id: String(this.index()),
  }))
  /** The slot's state, with its `char`. */
  readonly state = this.#part.state
  /** Shows the part's text where `uiText` is. */
  readonly attach = showText(() => this.state().char ?? "")
}

export { createOTPInputController } from "@ui-sdk/core/otp-input"
export type {
  OTPInputApi,
  OTPInputChangeOptions,
  OTPInputController,
  OTPInputOptions,
  OTPInputPattern,
  OTPInputSlotData,
  OTPInputSlotProps,
  OTPInputSlotState,
  OTPInputState,
  OTPInputValueChangeReason,
  OtpInputPrimitive,
} from "@ui-sdk/core/otp-input"

export {
  type OTPInputValueChangeDetails,
  UiOtpInput,
  UiOtpInputGroup,
  UiOtpInputSeparator,
  UiOtpInputSlot,
}
