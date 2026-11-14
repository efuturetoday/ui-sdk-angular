import {
  computed,
  Directive,
  inject,
  input,
  output,
  type OnInit,
  type Signal,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  radioGroup,
  type RadioGroupController,
  type RadioGroupPrimitive,
  type RadioGroupValueChangeReason,
  type RadioIndicatorProps,
  type RadioIndicatorState,
  type RadioProps,
} from "@ui-sdk/core/radio"
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
  injectPresentPart,
  type PresentPartContext,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "@ngx-ui-sdk/core"

/**
 * Radios that share one value, with one tab stop and arrow keys between them.
 * @experimental
 */
@Directive({
  selector: "[uiRadioGroup]",
  exportAs: "uiRadioGroup",
  host: { "(focusout)": "focusOut($event)" },
  providers: [provideRoot(radioGroup, () => UiRadioGroup)],
})
class UiRadioGroup implements OnInit {
  /** The checked radio's value. Bind it, or `[(value)]`, to control the group. */
  readonly value = input<string | null>()
  /** The checked radio's value at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<string | null>()
  /** Disables every radio. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps the value from changing, still focusable. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** `readOnly` as the native attribute spells it, which Signal Forms sets. */
  readonly readonly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Requires a checked radio for the form to submit. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name the value submits under. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The id of the form it belongs to, when it isn't inside it. */
  readonly form = input<string>()
  /** Whether arrow keys wrap around at the ends. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Changes the value from anywhere. Create one with `createRadioGroupController()`. */
  readonly controller = input<RadioGroupController>()
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string | null>()
  /** Emits before the value changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string | null
    details: ChangeDetails<RadioGroupValueChangeReason>
  }>()
  /** Emits when focus leaves it, which marks it touched in Signal Forms. */
  readonly touch = output<void>()
  readonly #form = injectFormValue<string | null>()
  readonly #field = injectFieldControl()
  /** The field the group is the control of, which its radios don't join. */
  readonly field = this.#field?.context
  readonly handle: PrimitiveHandle<RadioGroupPrimitive> = injectPrimitive(
    radioGroup,
    () => ({
      value: this.value() ?? this.#form?.value(),
      defaultValue: this.defaultValue(),
      disabled:
        this.disabled() || this.#form?.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly() ?? this.readonly(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      loop: this.loop(),
      controller: this.controller(),
      onValueChange: (value, details) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
          this.#form?.change(value)
        }
      },
    })
  )
  readonly #part = injectPart(
    this.handle,
    "group",
    undefined,
    this.#field?.join
  )
  /** The group's state. */
  readonly state = this.#part.state

  protected focusOut(event: FocusEvent) {
    if (leaves(event)) {
      this.touch.emit()
      this.#form?.touch()
    }
  }

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * A radio on the element it's written on, usually a `<button>`, with the
 * hidden native radio after it that takes part in the form.
 * @experimental
 */
@Directive({ selector: "[uiRadio]", exportAs: "uiRadio" })
class UiRadio implements OnInit {
  /** What the group's value becomes when this radio is checked. */
  readonly value = input.required<string>()
  /** Skips the radio: arrow keys pass it and it can't be focused or checked. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #group = inject(UiRadioGroup, { optional: true })
  // A radio in a field of its own is that field's control. In the group's field, the group is.
  readonly #nearest = injectFieldControl()
  readonly #field =
    this.#nearest?.context === this.#group?.field ? null : this.#nearest
  /** The group the radio is in. */
  readonly handle: PrimitiveHandle<RadioGroupPrimitive> =
    injectHandle(radioGroup)
  /** The radio's props, which its hidden input takes too. */
  readonly props: Signal<RadioProps> = computed(() => ({
    value: this.value(),
    disabled: this.disabled() || this.#field?.disabled(),
  }))
  readonly #part = injectPart(
    this.handle,
    "root",
    this.props,
    this.#field?.join
  )
  /** The radio's state. */
  readonly state = this.#part.state

  readonly #check = checkHiddenInput(this, "uiRadio")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The dot inside the radio, on the element it's written on:
 * `<span *uiRadioIndicator>`. It's there while its radio is checked, or always
 * with `*uiRadioIndicator="{ keepMounted: true }"`.
 * @experimental
 */
@Directive({ selector: "[uiRadioIndicator]" })
class UiRadioIndicator implements OnInit {
  /** Keeps it in the page while unchecked: `*uiRadioIndicator="let state; keepMounted: true"`. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiRadioIndicatorKeepMounted",
    transform: optionalBoolean,
  })
  readonly #radio = inject(UiRadio, { optional: true })
  readonly #part = injectPresentPart(
    injectHandle(radioGroup),
    "indicator",
    computed(() => {
      if (!this.#radio) {
        throw new Error("uiRadioIndicator must be used inside a uiRadio.")
      }
      return { keepMounted: this.keepMounted(), value: this.#radio.value() }
    })
  )

  static ngTemplateContextGuard(
    _directive: UiRadioIndicator,
    _context: unknown
  ): _context is PresentPartContext<RadioIndicatorState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * radio group's `value`. Signal Forms' `formField` needs nothing more.
 * @experimental
 */
@Directive({
  selector:
    "[uiRadioGroup][ngModel], [uiRadioGroup][formControl], [uiRadioGroup][formControlName]",
  providers: [provideValueAccessor(() => UiRadioGroupValueAccessor)],
})
class UiRadioGroupValueAccessor extends UiValueAccessor<string | null> {
  protected fromForm(value: unknown) {
    return typeof value === "string" ? value : null
  }
}

/**
 * The radio's hidden native input, which takes part in a native form. Write
 * it after its radio and name it: `<input [uiRadioInput]="box" />`, with
 * `#box="uiRadio"` on the radio. Leave it out when Angular's forms hold
 * the value.
 * @experimental
 */
@Directive({ selector: "input[uiRadioInput]" })
class UiRadioInput implements OnInit {
  /** The radio it's the input of. */
  readonly radio = input.required<UiRadio>({ alias: "uiRadioInput" })
  readonly #part = injectTargetPart(
    () => this.radio().handle,
    "input",
    () => this.radio().props()
  )

  ngOnInit() {
    linkHiddenInput(this.radio())
    this.#part.init()
  }
}

export { createRadioGroupController } from "@ui-sdk/core/radio"
export type {
  RadioGroupApi,
  RadioGroupChangeOptions,
  RadioGroupController,
  RadioGroupOptions,
  RadioGroupPrimitive,
  RadioGroupState,
  RadioGroupValueChangeReason,
  RadioIndicatorProps,
  RadioIndicatorState,
  RadioProps,
  RadioState,
} from "@ui-sdk/core/radio"

export {
  UiRadio,
  UiRadioGroup,
  UiRadioGroupValueAccessor,
  UiRadioIndicator,
  UiRadioInput,
}
