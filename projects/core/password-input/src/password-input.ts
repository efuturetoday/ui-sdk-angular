import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  type OnInit,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  passwordInput,
  type InputValueChangeReason,
  type PasswordInputController,
  type PasswordInputOptions,
  type PasswordInputPrimitive,
  type PasswordInputVisibleChangeReason,
} from "@ui-sdk/core/password-input"
import { fieldControlId } from "@ui-sdk/core/renderer"
import {
  injectFieldControl,
  optionalBoolean,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "@ngx-ui-sdk/core"

/**
 * A password field with a button that shows and hides it. Put its control and
 * toggle inside.
 * @experimental
 */
@Directive({
  selector: "[uiPasswordInput]",
  exportAs: "uiPasswordInput",
  providers: [provideRoot(passwordInput, () => UiPasswordInput)],
})
class UiPasswordInput implements OnInit {
  /** The password. Bind it, or `[(value)]`, to control it. */
  readonly value = input<string>()
  /** The password at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<string>()
  /** Whether the password shows as text. Bind it, or `[(visible)]`, to control it. */
  readonly visible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the password shows at first, when uncontrolled. */
  readonly defaultVisible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** What a password manager fills: `"current-password"`, `"new-password"` or `"off"`. */
  readonly autoComplete = input<PasswordInputOptions["autoComplete"]>()
  /** The name it submits under. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The id of the form it belongs to, when it isn't inside it. */
  readonly form = input<string>()
  /** Requires text for the form to submit. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Disables it. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps the text from changing, still focusable. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** `readOnly` as the native attribute spells it, which Signal Forms sets. */
  readonly readonly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Shows, hides and reads the password from anywhere. Create one with `createPasswordInputController()`. */
  readonly controller = input<PasswordInputController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new text once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string>()
  /** Emits before the text changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string
    details: ChangeDetails<InputValueChangeReason>
  }>()
  /** Emits the new visibility once a change isn't canceled, for `[(visible)]`. */
  readonly visibleChange = output<boolean>()
  /** Emits before the password shows or hides. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeVisibleChange = output<{
    visible: boolean
    details: ChangeDetails<PasswordInputVisibleChangeReason>
  }>()
  readonly #field = injectFieldControl()
  readonly handle: PrimitiveHandle<PasswordInputPrimitive> = injectPrimitive(
    passwordInput,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      visible: this.visible(),
      defaultVisible: this.defaultVisible(),
      autoComplete: this.autoComplete(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      required: this.required(),
      disabled: this.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly() ?? this.readonly(),
      controller: this.controller(),
      controlId: this.#field
        ? fieldControlId(this.#field.context.handle.api.id)
        : undefined,
      debug: this.debug(),
      onValueChange: (
        value: string,
        details: ChangeDetails<InputValueChangeReason>
      ) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
      onVisibleChange: (
        visible: boolean,
        details: ChangeDetails<PasswordInputVisibleChangeReason>
      ) => {
        this.beforeVisibleChange.emit({ visible, details })
        if (!details.canceled) {
          this.visibleChange.emit(visible)
        }
      },
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The password input's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The native `<input>` that holds the password, wired to the field it's in.
 * @experimental
 */
@Directive({
  selector: "input[uiPasswordInputControl]",
  exportAs: "uiPasswordInputControl",
  host: { "[attr.value]": "defaultAttr()" },
})
class UiPasswordInputControl implements OnInit {
  /** The input's id. Inside a field, the field's when left out. */
  readonly id = input<string>()
  readonly #root = inject(UiPasswordInput)
  readonly #el = inject(ElementRef).nativeElement as HTMLInputElement
  // A default is the `value` attribute, which a form reset returns to.
  protected readonly defaultAttr = computed(() =>
    this.#root.value() === undefined ? this.#root.defaultValue() : undefined
  )
  readonly #field = injectFieldControl()
  readonly #part = injectPart(
    injectHandle(passwordInput),
    "control",
    () => ({ id: this.id() }),
    this.#field?.join
  )
  /** The control's state. */
  readonly state = this.#part.state

  constructor() {
    effect(() => {
      const value = this.#root.value()
      if (value !== undefined && this.#el.value !== value) {
        this.#el.value = value
      }
    })
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The button that shows and hides the password. Name it with `aria-label`;
 * `aria-pressed` says whether the password shows.
 * @experimental
 */
@Directive({
  selector: "[uiPasswordInputToggle]",
  exportAs: "uiPasswordInputToggle",
})
class UiPasswordInputToggle implements OnInit {
  readonly #part = injectPart(injectHandle(passwordInput), "toggle")
  /** The toggle's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createPasswordInputController } from "@ui-sdk/core/password-input"
export type {
  InputValueChangeReason,
  PasswordInputController,
  PasswordInputOptions,
  PasswordInputPrimitive,
  PasswordInputState,
  PasswordInputVisibleChangeReason,
} from "@ui-sdk/core/password-input"

export { UiPasswordInput, UiPasswordInputControl, UiPasswordInputToggle }
