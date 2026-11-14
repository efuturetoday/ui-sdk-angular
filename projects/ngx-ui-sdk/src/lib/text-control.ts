import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import type {
  InputController,
  InputValueChangeReason,
} from "@ui-sdk/core/input"
import { injectFieldControl } from "./field"
import { optionalBoolean } from "./inputs"

/**
 * What an input and a textarea share: their inputs and outputs, the native
 * attributes the field and their props decide, and a controlled value as the
 * DOM property. Each makes its own primitive from `textOptions()`.
 * @internal
 */
@Directive({
  host: {
    "[attr.name]": "nameAttr()",
    "[attr.disabled]": "flag(disabledNow())",
    "[attr.readonly]": "flag(readOnlyNow())",
    "[attr.required]": "flag(required())",
  },
})
abstract class UiTextControl {
  /** The text. Bind it, or `[(value)]`, to control it. */
  readonly value = input<string>()
  /** The text at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<string>()
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
  /** Requires text for the form to submit. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name it submits under. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** Reads and writes the text from anywhere. Create one with `createInputController()`. */
  readonly controller = input<InputController>()
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
  protected readonly el = inject(ElementRef).nativeElement as
    HTMLInputElement | HTMLTextAreaElement
  protected readonly field = injectFieldControl()
  protected readonly disabledNow = computed(
    () => this.disabled() || this.field?.disabled()
  )
  protected readonly readOnlyNow = computed(
    () => this.readOnly() ?? this.readonly()
  )
  protected readonly nameAttr = computed(
    () => this.name() ?? this.field?.name()
  )

  constructor() {
    effect(() => {
      const value = this.value()
      if (value !== undefined && this.el.value !== value) {
        this.el.value = value
      }
    })
  }

  // The options its primitive takes from the shared inputs. The change emits
  // first, so canceling it also keeps `[(value)]` as it was.
  protected textOptions() {
    return {
      value: this.value(),
      defaultValue: this.defaultValue(),
      controller: this.controller(),
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
    }
  }

  // The root part's props, which its state attributes follow.
  protected controlProps() {
    return {
      disabled: this.disabledNow(),
      readOnly: this.readOnlyNow(),
      required: this.required(),
    }
  }

  protected flag(on: boolean | undefined) {
    return on ? "" : null
  }
}

export { UiTextControl }
