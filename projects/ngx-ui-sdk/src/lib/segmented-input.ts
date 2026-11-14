import {
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  input,
  output,
  type OnInit,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import type {
  dateInput,
  DateInputController,
  DateInputSegmentData,
  DateInputValueChangeReason,
  HourCycle,
} from "@ui-sdk/core/date-input"
import { injectDefaultText } from "./content"
import { injectFieldControl } from "./field"
import { injectInputInside } from "./form-inputs"
import { injectFormValue } from "./forms"
import { optionalBoolean } from "./inputs"
import { bindPart, injectPart } from "./part"
import {
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
} from "./primitive"

// Time Input's primitive has the same slots and state.
type Segmented = typeof dateInput

// Which primitive the root makes, which its segments find in it.
const SegmentedPrimitive = new InjectionToken<Segmented>("segmented-primitive")

type SegmentedValueChangeDetails = ChangeDetails<DateInputValueChangeReason>

// What Date Input and Time Input share: the root, with the hidden input a
// form submits, which it makes at its end, and a segment, which is an input
// you type in or the text between inputs.
@Directive()
abstract class SegmentedInput implements OnInit {
  /** The date or time, as an ISO string, or null while empty or partly filled. Bind it, or `[(value)]`, to control it. */
  readonly value = input<string | null>()
  /** The value at first, when uncontrolled. */
  readonly defaultValue = input<string | null>()
  /** The earliest value that's allowed. */
  readonly min = input<string>()
  /** The latest value that's allowed. */
  readonly max = input<string>()
  /** The language and region its segments follow, like `"de-DE"`. */
  readonly locale = input<string>()
  /** Whether it uses a 12 or 24 hour clock. */
  readonly hourCycle = input<HourCycle>()
  /** Stops it from changing. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Shows the value without letting it change. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** `readOnly` under its HTML name, which Signal Forms sets. */
  readonly readonly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a form needs a value. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name its value submits under in a native form. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The id of the form it belongs to, if it isn't inside it. */
  readonly form = input<string>()
  /** Sets its value from anywhere. Create one with `createDateInputController()`. */
  readonly controller = input<DateInputController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string | null>()
  /** Emits before the value changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string | null
    details: SegmentedValueChangeDetails
  }>()
  readonly #form = injectFormValue<string | null>()
  readonly #field = injectFieldControl()
  readonly handle: PrimitiveHandle<Segmented>
  readonly #part
  readonly #hidden

  /** The options only this input has, like Date Input's `unavailable`. */
  protected abstract extraOptions(): Record<string, unknown>

  constructor() {
    const primitive = inject(SegmentedPrimitive)
    this.handle = injectPrimitive(primitive, () => ({
      value: this.value() ?? this.#form?.value(),
      defaultValue: this.defaultValue(),
      min: this.min(),
      max: this.max(),
      locale: this.locale(),
      hourCycle: this.hourCycle(),
      disabled:
        this.disabled() || this.#form?.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly() ?? this.readonly(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      controller: this.controller(),
      debug: this.debug(),
      ...this.extraOptions(),
      onValueChange: (
        value: string | null,
        details: SegmentedValueChangeDetails
      ) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
          this.#form?.change(value)
        }
      },
    }))
    this.#part = injectPart(this.handle, "root", undefined, this.#field?.join)
    this.#hidden = bindPart(
      () => this.handle,
      "hidden-input",
      () => ({}),
      injectInputInside()
    )
  }

  /** The input's state, with its `segments`. */
  get state() {
    return this.#part.state
  }

  ngOnInit() {
    this.handle.init()
    this.#part.init()
    this.#hidden.init()
  }
}

// A segment's key, and so whether it's typed in, never changes.
@Directive()
abstract class SegmentedInputSegment implements OnInit {
  /** One of the root's `state().segments`. */
  readonly segment = input.required<DateInputSegmentData>()
  readonly #editable =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement instanceof
    HTMLInputElement
  readonly #part
  readonly #content

  constructor() {
    const primitive = inject(SegmentedPrimitive)
    this.#part = injectPart(injectHandle(primitive), "segment", () => ({
      segment: this.segment(),
      id: this.segment().key,
    }))
    this.#content = injectDefaultText(() => this.#part.state().text)
  }

  /** The segment's state, with its `text`. */
  get state() {
    return this.#part.state
  }

  ngOnInit() {
    if (!this.#editable) {
      this.#content.decide()
    }
    this.#part.init()
  }
}

export {
  SegmentedInput,
  SegmentedInputSegment,
  SegmentedPrimitive,
  type Segmented,
}
