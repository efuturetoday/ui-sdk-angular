import {
  computed,
  Directive,
  input,
  output,
  type Signal,
  type OnInit,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  segmentedControl,
  type SegmentedControlController,
  type SegmentedControlItemProps,
  type SegmentedControlOrientation,
  type SegmentedControlPrimitive,
  type SegmentedControlValueChangeReason,
} from "@ui-sdk/core/segmented-control"
import {
  injectFieldControl,
  injectFormValue,
  ɵleaves as leaves,
  provideValueAccessor,
  UiValueAccessor,
  ɵcheckHiddenInput as checkHiddenInput,
  ɵlinkHiddenInput as linkHiddenInput,
  optionalBoolean,
  injectPart,
  injectTargetPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "@ngx-ui-sdk/core"

/**
 * A row of buttons of which one is selected, like a switch between views.
 * Arrow keys move between them. Put its items and indicator inside.
 * @experimental
 */
@Directive({
  selector: "[uiSegmentedControl]",
  exportAs: "uiSegmentedControl",
  host: { "(focusout)": "focusOut($event)" },
  providers: [provideRoot(segmentedControl, () => UiSegmentedControl)],
})
class UiSegmentedControl implements OnInit {
  /** The selected item's value. Bind it, or `[(value)]`, to control it. */
  readonly value = input<string | null>()
  /** The selected item's value at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<string | null>()
  /** Disables every item. Inside a field, the field's `disabled` does too. */
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
  /** Requires a selection for the form to submit. */
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
  /** Which arrow keys move between items: left and right, or up and down. */
  readonly orientation = input<SegmentedControlOrientation>()
  /** Changes the value from anywhere. Create one with `createSegmentedControlController()`. */
  readonly controller = input<SegmentedControlController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string | null>()
  /** Emits before the value changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string | null
    details: ChangeDetails<SegmentedControlValueChangeReason>
  }>()
  /** Emits when focus leaves it, which marks it touched in Signal Forms. */
  readonly touch = output<void>()
  readonly #form = injectFormValue<string | null>()
  readonly #field = injectFieldControl()
  readonly handle: PrimitiveHandle<SegmentedControlPrimitive> = injectPrimitive(
    segmentedControl,
    () => ({
      value: this.value() !== undefined ? this.value() : this.#form?.value(),
      defaultValue: this.defaultValue(),
      disabled:
        this.disabled() || this.#form?.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly() ?? this.readonly(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      loop: this.loop(),
      orientation: this.orientation(),
      controller: this.controller(),
      debug: this.debug(),
      onValueChange: (value, details) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
          this.#form?.change(value)
        }
      },
    })
  )
  readonly #part = injectPart(this.handle, "root", undefined, {
    join: this.#field?.join,
  })
  /** The control's state. */
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
 * One option, a `<button>`, with the hidden native input after it that takes
 * part in the form.
 * @experimental
 */
@Directive({
  selector: "[uiSegmentedControlItem]",
  exportAs: "uiSegmentedControlItem",
})
class UiSegmentedControlItem implements OnInit {
  /** What the control's value becomes when this item is selected. */
  readonly value = input.required<string>()
  /** Skips the item: arrow keys pass it and it can't be selected. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The control the item is in. */
  readonly handle: PrimitiveHandle<SegmentedControlPrimitive> =
    injectHandle(segmentedControl)
  /** The item's props, which its hidden input takes too. */
  readonly props: Signal<SegmentedControlItemProps> = computed(() => ({
    value: this.value(),
    disabled: this.disabled(),
  }))
  readonly #part = injectPart(this.handle, "item", this.props)
  /** The item's state. */
  readonly state = this.#part.state

  readonly #check = checkHiddenInput(this, "uiSegmentedControlItem")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A mark that follows the selected item. It reads the item's box from CSS
 * variables.
 * @experimental
 */
@Directive({
  selector: "[uiSegmentedControlIndicator]",
  exportAs: "uiSegmentedControlIndicator",
})
class UiSegmentedControlIndicator implements OnInit {
  readonly #part = injectPart(injectHandle(segmentedControl), "indicator")
  /** The indicator's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * control's `value`. Signal Forms' `formField` needs nothing more.
 * @experimental
 */
@Directive({
  selector:
    "[uiSegmentedControl][ngModel], [uiSegmentedControl][formControl], [uiSegmentedControl][formControlName]",
  providers: [provideValueAccessor(() => UiSegmentedControlValueAccessor)],
})
class UiSegmentedControlValueAccessor extends UiValueAccessor<string | null> {
  protected fromForm(value: unknown) {
    return typeof value === "string" ? value : null
  }
}

/**
 * The item's hidden native input, which takes part in a native form. Write it
 * after its item: `<input [uiSegmentedControlInput]="item" />`, with
 * `#item="uiSegmentedControlItem"` on the item. Leave it out when Angular's
 * forms hold the value.
 * @experimental
 */
@Directive({ selector: "input[uiSegmentedControlInput]" })
class UiSegmentedControlInput implements OnInit {
  /** The item it's the input of. */
  readonly item = input.required<UiSegmentedControlItem>({
    alias: "uiSegmentedControlInput",
  })
  readonly #part = injectTargetPart(
    () => this.item().handle,
    "input",
    () => this.item().props()
  )

  constructor() {
    linkHiddenInput(() => this.item())
  }

  ngOnInit() {
    this.#part.init()
  }
}

export { createSegmentedControlController } from "@ui-sdk/core/segmented-control"
export type {
  SegmentedControlApi,
  SegmentedControlChangeOptions,
  SegmentedControlController,
  SegmentedControlDirection,
  SegmentedControlIndicatorState,
  SegmentedControlItemProps,
  SegmentedControlItemState,
  SegmentedControlOptions,
  SegmentedControlOrientation,
  SegmentedControlPrimitive,
  SegmentedControlState,
  SegmentedControlValueChangeReason,
} from "@ui-sdk/core/segmented-control"

export {
  UiSegmentedControl,
  UiSegmentedControlIndicator,
  UiSegmentedControlInput,
  UiSegmentedControlItem,
  UiSegmentedControlValueAccessor,
}
