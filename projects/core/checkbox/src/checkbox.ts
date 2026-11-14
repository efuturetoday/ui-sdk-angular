import {
  computed,
  Directive,
  inject,
  input,
  output,
  type OnInit,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  checkbox,
  checkboxGroup,
  type CheckboxCheckedChangeReason,
  type CheckboxController,
  type CheckboxGroupController,
  type CheckboxGroupPrimitive,
  type CheckboxGroupValueChangeReason,
  type CheckboxIndicatorProps,
  type CheckboxPrimitive,
  type CheckboxState,
  type CheckedState,
} from "@ui-sdk/core/checkbox"
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
  ɵtokenOf as tokenOf,
} from "@ngx-ui-sdk/core"

// `checked` written as an attribute checks it, and "indeterminate" stays.
const checkedState = (value: unknown) =>
  value === "indeterminate" ? value : optionalBoolean(value)

/**
 * A checkbox on the element it's written on, usually a `<button>`, with the
 * hidden native input after it that takes part in the form.
 * @experimental
 */
@Directive({
  selector: "[uiCheckbox]",
  exportAs: "uiCheckbox",
  host: { "(focusout)": "focusOut($event)" },
  providers: [provideRoot(checkbox, () => UiCheckbox)],
})
class UiCheckbox implements OnInit {
  /** Whether it's checked. Bind it, or `[(checked)]`, to control the checkbox. */
  readonly checked = input<CheckedState | undefined, unknown>(undefined, {
    transform: checkedState,
  })
  /** Whether it's checked at first, when uncontrolled, and after a form reset. */
  readonly defaultChecked = input<CheckedState | undefined, unknown>(
    undefined,
    { transform: checkedState }
  )
  /** Makes it the group's parent checkbox, which checks and unchecks every other. */
  readonly parent = input<boolean | undefined, unknown>(undefined, {
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
  /** Requires it checked for the form to submit. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name it submits under. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The value it submits while checked. */
  readonly value = input<string>()
  /** The id of the form it belongs to, when it isn't inside it. */
  readonly form = input<string>()
  /** Checks and unchecks it from anywhere. Create one with `createCheckboxController()`. */
  readonly controller = input<CheckboxController>()
  /** Emits the new value once a change isn't canceled, for `[(checked)]`. */
  readonly checkedChange = output<CheckedState>()
  /** Emits before it changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeCheckedChange = output<{
    checked: CheckedState
    details: ChangeDetails<CheckboxCheckedChangeReason>
  }>()
  /** Emits when focus leaves it, which marks it touched in Signal Forms. */
  readonly touch = output<void>()
  readonly #group = inject(tokenOf(checkboxGroup), { optional: true })
  // Inside a group, the group is the field's control.
  readonly #form = injectFormValue<CheckedState>()
  readonly #field = this.#group ? null : injectFieldControl()
  readonly handle: PrimitiveHandle<CheckboxPrimitive> = injectPrimitive(
    checkbox,
    () => ({
      parent: this.parent(),
      group: this.#group ? () => this.#group!.handle.api : undefined,
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
  readonly #part = injectPart(this.handle, "root", undefined, this.#field?.join)
  /** The checkbox's state. */
  readonly state = this.#part.state

  protected focusOut(event: FocusEvent) {
    if (leaves(event)) {
      this.touch.emit()
      this.#form?.touch()
    }
  }

  readonly #check = checkHiddenInput(this, "uiCheckbox")

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The check inside the checkbox, on the element it's written on:
 * `<span *uiCheckboxIndicator>`. It's there while the checkbox is checked or
 * indeterminate, or always with `*uiCheckboxIndicator="{ keepMounted: true }"`.
 * @experimental
 */
@Directive({ selector: "[uiCheckboxIndicator]" })
class UiCheckboxIndicator implements OnInit {
  /** Keeps it in the page while unchecked: `*uiCheckboxIndicator="let state; keepMounted: true"`. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiCheckboxIndicatorKeepMounted",
    transform: optionalBoolean,
  })
  readonly #part = injectPresentPart(
    injectHandle(checkbox),
    "indicator",
    computed(() => ({ keepMounted: this.keepMounted() }))
  )

  static ngTemplateContextGuard(
    _directive: UiCheckboxIndicator,
    _context: unknown
  ): _context is PresentPartContext<CheckboxState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Checkboxes that share a name and a list of checked values. The group, not
 * each checkbox, sits in a field.
 * @experimental
 */
@Directive({
  selector: "[uiCheckboxGroup]",
  exportAs: "uiCheckboxGroup",
  host: { "(focusout)": "focusOut($event)" },
  providers: [provideRoot(checkboxGroup, () => UiCheckboxGroup)],
})
class UiCheckboxGroup implements OnInit {
  /** The checked values. Bind it, or `[(value)]`, to control the group. */
  readonly value = input<string[]>()
  /** The checked values at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<string[]>()
  /** Every value a parent checkbox checks. */
  readonly allValues = input<string[]>()
  /** Keeps every checkbox from changing, still focusable. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** `readOnly` as the native attribute spells it, which Signal Forms sets. */
  readonly readonly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Disables every checkbox. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Requires at least one checked value for the form to submit. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name every checked value submits under. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The id of the form it belongs to, when it isn't inside it. */
  readonly form = input<string>()
  /** Changes the value from anywhere. Create one with `createCheckboxGroupController()`. */
  readonly controller = input<CheckboxGroupController>()
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string[]>()
  /** Emits before the value changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string[]
    details: ChangeDetails<CheckboxGroupValueChangeReason>
  }>()
  /** Emits when focus leaves it, which marks it touched in Signal Forms. */
  readonly touch = output<void>()
  readonly #form = injectFormValue<string[]>()
  readonly #field = injectFieldControl()
  readonly handle: PrimitiveHandle<CheckboxGroupPrimitive> = injectPrimitive(
    checkboxGroup,
    () => ({
      value: this.value() ?? this.#form?.value(),
      defaultValue: this.defaultValue(),
      allValues: this.allValues(),
      readOnly: this.readOnly() ?? this.readonly(),
      disabled:
        this.disabled() || this.#form?.disabled() || this.#field?.disabled(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
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
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * checkbox's `checked`. Signal Forms' `formField` needs nothing more.
 * @experimental
 */
@Directive({
  selector:
    "[uiCheckbox][ngModel], [uiCheckbox][formControl], [uiCheckbox][formControlName]",
  providers: [provideValueAccessor(() => UiCheckboxValueAccessor)],
})
class UiCheckboxValueAccessor extends UiValueAccessor<CheckedState> {
  protected fromForm(value: unknown) {
    return value === "indeterminate" ? value : !!value
  }
}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * checkbox group's `value`. Signal Forms' `formField` needs nothing more.
 * @experimental
 */
@Directive({
  selector:
    "[uiCheckboxGroup][ngModel], [uiCheckboxGroup][formControl], [uiCheckboxGroup][formControlName]",
  providers: [provideValueAccessor(() => UiCheckboxGroupValueAccessor)],
})
class UiCheckboxGroupValueAccessor extends UiValueAccessor<string[]> {
  protected fromForm(value: unknown) {
    return Array.isArray(value) ? (value as string[]) : []
  }
}

/**
 * The checkbox's hidden native input, which takes part in a native form. Write
 * it after its checkbox and name it: `<input [uiCheckboxInput]="box" />`, with
 * `#box="uiCheckbox"` on the checkbox. Leave it out when Angular's forms hold
 * the value.
 * @experimental
 */
@Directive({ selector: "input[uiCheckboxInput]" })
class UiCheckboxInput implements OnInit {
  /** The checkbox it's the input of. */
  readonly checkbox = input.required<UiCheckbox>({ alias: "uiCheckboxInput" })
  readonly #part = injectTargetPart(() => this.checkbox().handle, "input")

  ngOnInit() {
    linkHiddenInput(this.checkbox())
    this.#part.init()
  }
}

/**
 * The group's hidden native input, which takes part in a native form, inside
 * the group: `<input uiCheckboxGroupInput />`. Leave it out when Angular's
 * forms hold the value.
 * @experimental
 */
@Directive({ selector: "input[uiCheckboxGroupInput]" })
class UiCheckboxGroupInput implements OnInit {
  readonly #part = injectPart(injectHandle(checkboxGroup), "group-input")

  ngOnInit() {
    this.#part.init()
  }
}

export {
  createCheckboxController,
  createCheckboxGroupController,
} from "@ui-sdk/core/checkbox"
export type {
  CheckboxApi,
  CheckboxChangeOptions,
  CheckboxCheckedChangeReason,
  CheckboxController,
  CheckboxGroupApi,
  CheckboxGroupChangeOptions,
  CheckboxGroupController,
  CheckboxGroupOptions,
  CheckboxGroupPrimitive,
  CheckboxGroupState,
  CheckboxGroupValueChangeReason,
  CheckboxIndicatorProps,
  CheckboxIndicatorState,
  CheckboxOptions,
  CheckboxPrimitive,
  CheckboxState,
  CheckedState,
} from "@ui-sdk/core/checkbox"

export {
  UiCheckbox,
  UiCheckboxGroup,
  UiCheckboxGroupInput,
  UiCheckboxGroupValueAccessor,
  UiCheckboxIndicator,
  UiCheckboxInput,
  UiCheckboxValueAccessor,
}
