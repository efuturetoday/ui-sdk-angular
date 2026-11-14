import {
  Directive,
  forwardRef,
  inject,
  InjectionToken,
  signal,
  type Provider,
  type Signal,
  type Type,
} from "@angular/core"
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from "@angular/forms"

/**
 * What `ngModel`, `formControl` and `formControlName` set on a control
 * through its value accessor: its value, and whether they disable it.
 * @experimental
 */
type FormValue<T> = {
  value: Signal<T | undefined>
  disabled: Signal<boolean | undefined>
  change: (value: T) => void
  touch: () => void
}

const FormValueToken = new InjectionToken<FormValue<unknown>>("form-value")

/**
 * The form value Angular's forms set on this element, or null without them.
 * Call it in a field initializer of the control's root directive.
 * @experimental
 */
function injectFormValue<T>() {
  return inject(FormValueToken, {
    self: true,
    optional: true,
  }) as FormValue<T> | null
}

/**
 * A control's value accessor for `ngModel`, `formControl` and
 * `formControlName`. Extend it with the control's selector and
 * `provideValueAccessor`, and say what an empty value is.
 * @experimental
 */
@Directive()
abstract class UiValueAccessor<T>
  implements ControlValueAccessor, FormValue<T>
{
  readonly #value = signal<T | undefined>(undefined)
  readonly #disabled = signal<boolean | undefined>(undefined)
  #onChange: (value: T) => void = () => {}
  #onTouched: () => void = () => {}
  /** The value the form set, or the one the control changed to since. */
  readonly value = this.#value.asReadonly()
  /** Whether the form disables the control. */
  readonly disabled = this.#disabled.asReadonly()

  /** The control's value for what the form gives, like `false` for a checkbox's `null`. */
  protected abstract fromForm(value: unknown): T

  writeValue(value: unknown) {
    this.#value.set(this.fromForm(value))
  }

  registerOnChange(fn: (value: T) => void) {
    this.#onChange = fn
  }

  registerOnTouched(fn: () => void) {
    this.#onTouched = fn
  }

  setDisabledState(disabled: boolean) {
    this.#disabled.set(disabled || undefined)
  }

  change(value: T) {
    this.#value.set(value)
    this.#onChange(value)
  }

  touch() {
    this.#onTouched()
  }
}

/**
 * Provides a value accessor to Angular's forms and to the control it sits on.
 * Put it in the accessor's `providers`.
 * @experimental
 */
function provideValueAccessor(accessor: () => Type<UiValueAccessor<any>>) {
  return [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(accessor),
      multi: true,
    },
    { provide: FormValueToken, useExisting: forwardRef(accessor) },
  ] satisfies Provider[]
}

// Whether focus left an element, not moved inside it, like between a group's
// checkboxes, which is when a control counts as touched.
const leaves = (event: FocusEvent) =>
  !(event.currentTarget as Element).contains(event.relatedTarget as Node | null)

export {
  type FormValue,
  injectFormValue,
  leaves,
  provideValueAccessor,
  UiValueAccessor,
}
