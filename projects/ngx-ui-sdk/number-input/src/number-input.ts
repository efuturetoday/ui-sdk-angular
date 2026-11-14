import { DOCUMENT } from "@angular/common"
import {
  Directive,
  inject,
  InjectionToken,
  input,
  output,
  type OnInit,
} from "@angular/core"
import type { ChangeDetails, CommitDetails, SlotName } from "@ui-sdk/core"
import { fieldControlId } from "@ui-sdk/core/renderer"
import {
  numberInput,
  type NumberInputController,
  type NumberInputPrimitive,
  type NumberInputState,
  type NumberInputValueChangeReason,
} from "@ui-sdk/core/number-input"
import {
  type ɵJoinedPart as JoinedPart,
  ɵFieldContextToken as FieldContextToken,
  injectFieldControl,
  ɵinjectInputInside as injectInputInside,
  optionalBoolean,
  ɵbindPart as bindPart,
  injectConnectedPart,
  injectPart,
  injectPopupPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵtokenOf as tokenOf,
} from "ngx-ui-sdk"

type Value = number | null

/**
 * Why the number changes.
 * @experimental
 */
type NumberInputValueChangeDetails = ChangeDetails<NumberInputValueChangeReason>

// The field the text field joins, found on the root.
const ControlField = new InjectionToken<JoinedPart | undefined>(
  "number-input-field"
)

/**
 * A number field, on the element it's written on, with the hidden input that
 * submits the number as is, which it makes at its end.
 * @experimental
 */
@Directive({
  selector: "[uiNumberInput]",
  exportAs: "uiNumberInput",
  providers: [
    provideRoot(numberInput, () => UiNumberInput),
    {
      provide: ControlField,
      useFactory: () => inject(UiNumberInput).field?.join,
    },
  ],
})
class UiNumberInput implements OnInit {
  /** The number, or null for an empty field. Bind it, or `[(value)]`, to control it. */
  readonly value = input<Value>()
  /** The number at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<Value>()
  /** The lowest number. */
  readonly min = input<number>()
  /** The highest number. */
  readonly max = input<number>()
  /** How far the arrow keys and buttons step. */
  readonly step = input<number>()
  /** How far Shift with a step goes. */
  readonly largeStep = input<number>()
  /** How far Alt with a step goes. */
  readonly smallStep = input<number>()
  /** How the number reads, as `Intl.NumberFormat` options. */
  readonly format = input<Intl.NumberFormatOptions>()
  /** The locale the number is formatted and parsed in. */
  readonly locale = input<string>()
  /** Whether the mouse wheel steps it while it has focus. */
  readonly wheel = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Stops it from changing. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Shows the number without letting it change. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** `readOnly` under its HTML name, which Signal Forms sets. */
  readonly readonly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a form needs a number. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name its number submits under in a native form. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The id of the form it belongs to, if it isn't inside it. */
  readonly form = input<string>()
  /** Sets its number from anywhere, and connects a scrub area outside it. Create one with `createNumberInputController()`. */
  readonly controller = input<NumberInputController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new number once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<Value>()
  /** Emits before the number changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: Value
    details: NumberInputValueChangeDetails
  }>()
  /** Emits once a change settles: on blur, Enter, or the end of a step or scrub. */
  readonly valueCommit = output<{
    value: Value
    details: CommitDetails<NumberInputValueChangeReason>
  }>()
  /** @internal The field around it, which its text field joins. */
  readonly field = injectFieldControl()
  readonly #context = inject(FieldContextToken, { optional: true })
  readonly handle: PrimitiveHandle<NumberInputPrimitive> = injectPrimitive(
    numberInput,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      min: this.min(),
      max: this.max(),
      step: this.step(),
      largeStep: this.largeStep(),
      smallStep: this.smallStep(),
      format: this.format(),
      locale: this.locale(),
      wheel: this.wheel(),
      disabled: this.disabled() || this.field?.disabled(),
      readOnly: this.readOnly() ?? this.readonly(),
      required: this.required(),
      name: this.name() ?? this.field?.name(),
      form: this.form(),
      controller: this.controller(),
      controlId: this.#context
        ? fieldControlId(this.#context.handle.api.id)
        : undefined,
      debug: this.debug(),
      onValueChange: (value: Value, details: NumberInputValueChangeDetails) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
      onValueCommit: (
        value: Value,
        details: CommitDetails<NumberInputValueChangeReason>
      ) => this.valueCommit.emit({ value, details }),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The number input's state. */
  readonly state = this.#part.state
  readonly #hidden = bindPart(
    () => this.handle,
    "hidden-input" as SlotName<NumberInputPrimitive>,
    () => ({}) as never,
    injectInputInside()
  )

  ngOnInit() {
    this.handle.init()
    this.#part.init()
    this.#hidden.init()
  }
}

/**
 * Holds the text field and its buttons.
 * @experimental
 */
@Directive({ selector: "[uiNumberInputGroup]", exportAs: "uiNumberInputGroup" })
class UiNumberInputGroup implements OnInit {
  readonly #part = injectPart(injectHandle(numberInput), "group")
  /** The group's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The text field, on an `<input>`: it shows the formatted number and takes
 * typing. Inside a field, the field's label names it.
 * @experimental
 */
@Directive({
  selector: "input[uiNumberInputControl]",
  exportAs: "uiNumberInputControl",
})
class UiNumberInputControl implements OnInit {
  readonly #part = injectPart(
    injectHandle(numberInput),
    "control",
    undefined,
    inject(ControlField)
  )
  /** The field's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Steps up once, then repeats while held. Shift steps by `largeStep`.
 * @experimental
 */
@Directive({
  selector: "[uiNumberInputIncrement]",
  exportAs: "uiNumberInputIncrement",
})
class UiNumberInputIncrement implements OnInit {
  /** Stops it from stepping, as at the bound it steps toward. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #part = injectPart(injectHandle(numberInput), "increment", () => ({
    disabled: this.disabled(),
  }))
  /** The button's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Steps down once, then repeats while held. Shift steps by `largeStep`.
 * @experimental
 */
@Directive({
  selector: "[uiNumberInputDecrement]",
  exportAs: "uiNumberInputDecrement",
})
class UiNumberInputDecrement implements OnInit {
  /** Stops it from stepping, as at the bound it steps toward. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #part = injectPart(injectHandle(numberInput), "decrement", () => ({
    disabled: this.disabled(),
  }))
  /** The button's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

const unconnected: NumberInputState = {
  value: null,
  disabled: false,
  readOnly: false,
  required: false,
  scrubbing: false,
}

/**
 * Drag across it to change the number. It works anywhere inside the number
 * input, and outside it through `controller`, like an icon in a toolbar.
 * @experimental
 */
@Directive({
  selector: "[uiNumberInputScrubArea]",
  exportAs: "uiNumberInputScrubArea",
})
class UiNumberInputScrubArea implements OnInit {
  /** Which way a drag changes the number. */
  readonly orientation = input<"horizontal" | "vertical">()
  /** How many pixels of dragging make one step. */
  readonly pixelsPerStep = input<number>()
  /** Connects a scrub area outside the number input to the one with this controller. */
  readonly controller = input<NumberInputController>()
  readonly #part = injectConnectedPart(
    numberInput,
    this.controller,
    "scrub-area",
    () => ({
      orientation: this.orientation(),
      pixelsPerStep: this.pixelsPerStep(),
    }),
    { attrs: () => ({}), state: () => unconnected }
  )
  /** The number input it scrubs, once it's on the page. */
  readonly target = this.#part.target
  /** The scrub area's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Stands in for the mouse cursor while a scrub locks the pointer, on the
 * element it's written on: `<span *uiNumberInputScrubAreaCursor>`, inside the
 * scrub area. Rendered in the body, so transformed ancestors can't move it.
 * @experimental
 */
@Directive({ selector: "[uiNumberInputScrubAreaCursor]" })
class UiNumberInputScrubAreaCursor implements OnInit {
  readonly #document = inject(DOCUMENT)
  // Its scrub area's number input. One outside it, through a controller,
  // renders before that's on the page, with no cursor yet, as in Vue.
  readonly #handle =
    inject(UiNumberInputScrubArea, { optional: true })?.target() ??
    inject(tokenOf(numberInput), { optional: true })?.handle
  readonly #part =
    this.#handle &&
    injectPopupPart(this.#handle, "scrub-area-cursor", undefined, {
      container: () => this.#document.body,
    })

  ngOnInit() {
    this.#part?.init()
  }
}

export { createNumberInputController } from "@ui-sdk/core/number-input"
export type {
  NumberInputApi,
  NumberInputButtonProps,
  NumberInputButtonState,
  NumberInputChangeOptions,
  NumberInputController,
  NumberInputOptions,
  NumberInputPrimitive,
  NumberInputScrubAreaProps,
  NumberInputState,
  NumberInputValueChangeReason,
} from "@ui-sdk/core/number-input"

export {
  type NumberInputValueChangeDetails,
  UiNumberInput,
  UiNumberInputControl,
  UiNumberInputDecrement,
  UiNumberInputGroup,
  UiNumberInputIncrement,
  UiNumberInputScrubArea,
  UiNumberInputScrubAreaCursor,
}
