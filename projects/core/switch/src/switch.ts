import {
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  switchPrimitive,
  type SwitchCheckedChangeReason,
  type SwitchController,
  type SwitchPrimitive,
} from "@ui-sdk/core/switch"
import {
  injectFieldControl,
  ɵcheckHiddenInput as checkHiddenInput,
  ɵlinkHiddenInput as linkHiddenInput,
  injectFormValue,
  ɵleaves as leaves,
  provideValueAccessor,
  UiValueAccessor,
  optionalBoolean,
  injectPart,
  injectTargetPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "@ngx-ui-sdk/core"

/**
 * A control that turns a setting on or off, on the element it's written on,
 * usually a `<button>`, with the hidden native input after it that takes part
 * in the form.
 * @experimental
 */
@Directive({
  selector: "[uiSwitch]",
  exportAs: "uiSwitch",
  host: { "(focusout)": "focusOut($event)" },
  providers: [provideRoot(switchPrimitive, () => UiSwitch)],
})
class UiSwitch {
  /** Whether it's on. Bind it, or `[(checked)]`, to control the switch. */
  readonly checked = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether it's on at first, when uncontrolled, and after a form reset. */
  readonly defaultChecked = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Disables it. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps it from changing, still focusable. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** `readOnly` as the native attribute spells it, which Signal Forms sets. */
  readonly readonly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Requires it on for the form to submit. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name it submits under. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The value it submits while on. */
  readonly value = input<string>()
  /** The id of the form it belongs to, when it isn't inside it. */
  readonly form = input<string>()
  /** Turns it on and off from anywhere. Create one with `createSwitchController()`. */
  readonly controller: InputSignal<SwitchController | undefined> =
    input<SwitchController>()
  /** Emits the new value once a change isn't canceled, for `[(checked)]`. */
  readonly checkedChange = output<boolean>()
  /** Emits before it changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeCheckedChange = output<{
    checked: boolean
    details: ChangeDetails<SwitchCheckedChangeReason>
  }>()
  /** Emits when focus leaves it, which marks it touched in Signal Forms. */
  readonly touch = output<void>()
  readonly #form = injectFormValue<boolean>()
  readonly #field = injectFieldControl()
  readonly handle: PrimitiveHandle<SwitchPrimitive> = injectPrimitive(
    switchPrimitive,
    () => ({
      checked: this.checked() ?? this.#form?.value(),
      defaultChecked: this.defaultChecked(),
      disabled:
        this.disabled() || this.#form?.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly() ?? this.readonly(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      value: this.value(),
      form: this.form(),
      controller: this.controller(),
      onCheckedChange: (checked, details) => {
        this.beforeCheckedChange.emit({ checked, details })
        if (!details.canceled) {
          this.checkedChange.emit(checked)
          this.#form?.change(checked)
        }
      },
    })
  )
  readonly #part = injectPart(this.handle, "root", undefined, {
    join: this.#field?.join,
  })
  /** The switch's state. */
  readonly state = this.#part.state

  protected focusOut(event: FocusEvent) {
    if (leaves(event)) {
      this.touch.emit()
      this.#form?.touch()
    }
  }

  readonly #check = checkHiddenInput(this, "uiSwitch")
}

/**
 * The thumb that slides along the switch as it turns on or off.
 * @experimental
 */
@Directive({ selector: "[uiSwitchThumb]", exportAs: "uiSwitchThumb" })
class UiSwitchThumb {
  readonly #part = injectPart(injectHandle(switchPrimitive), "thumb")
  /** The thumb's state. */
  readonly state = this.#part.state
}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * switch's `checked`. Signal Forms' `formField` needs nothing more.
 * @experimental
 */
@Directive({
  selector:
    "[uiSwitch][ngModel], [uiSwitch][formControl], [uiSwitch][formControlName]",
  providers: [provideValueAccessor(() => UiSwitchValueAccessor)],
})
class UiSwitchValueAccessor extends UiValueAccessor<boolean> {
  protected fromForm(value: unknown) {
    return !!value
  }
}

/**
 * The switch's hidden native input, which takes part in a native form. Write
 * it after its switch and name it: `<input [uiSwitchInput]="box" />`, with
 * `#box="uiSwitch"` on the switch. Leave it out when Angular's forms hold
 * the value.
 * @experimental
 */
@Directive({ selector: "input[uiSwitchInput]" })
class UiSwitchInput {
  /** The switch it's the input of. */
  readonly switch = input.required<UiSwitch>({ alias: "uiSwitchInput" })
  readonly #part = injectTargetPart(() => this.switch().handle, "input")

  constructor() {
    linkHiddenInput(() => this.switch())
  }
}

export { createSwitchController } from "@ui-sdk/core/switch"
export type {
  SwitchApi,
  SwitchCheckedChangeReason,
  SwitchController,
  SwitchOptions,
  SwitchPrimitive,
  SwitchState,
  SwitchThumbState,
} from "@ui-sdk/core/switch"

export { UiSwitch, UiSwitchInput, UiSwitchThumb, UiSwitchValueAccessor }
