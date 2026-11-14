import { Directive, inject, input, output } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  toggle,
  toggleGroup,
  type ToggleController,
  type ToggleGroupController,
  type ToggleGroupOrientation,
  type ToggleGroupPrimitive,
  type ToggleGroupValueChangeReason,
  type TogglePressedChangeReason,
  type TogglePrimitive,
} from "@ui-sdk/core/toggle"
import {
  injectFormValue,
  ɵleaves as leaves,
  provideValueAccessor,
  UiValueAccessor,
  optionalBoolean,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵtokenOf as tokenOf,
  ɵinjectToolbarScope as injectToolbarScope,
} from "@ngx-ui-sdk/core"

/**
 * Toggles that share one value, with one tab stop and arrow keys between them.
 * @experimental
 */
@Directive({
  selector: "[uiToggleGroup]",
  exportAs: "uiToggleGroup",
  host: { "(focusout)": "focusOut($event)" },
  providers: [provideRoot(toggleGroup, () => UiToggleGroup)],
})
class UiToggleGroup {
  /** The pressed toggles' values. Bind it, or `[(value)]`, to control the group. */
  readonly value = input<string[]>()
  /** The toggles pressed at first, when uncontrolled. */
  readonly defaultValue = input<string[]>()
  /** Whether several toggles can be pressed at once. */
  readonly multiple = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the pressed toggle can be unpressed when only one may be pressed. */
  readonly deselectable = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Stops every toggle from being pressed. They stay focusable with `aria-disabled`. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Which arrow keys move between toggles: left and right, or up and down. */
  readonly orientation = input<ToggleGroupOrientation>()
  /** Whether arrow keys wrap from the last toggle to the first. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Presses toggles from anywhere. Create one with `createToggleGroupController()`. */
  readonly controller = input<ToggleGroupController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string[]>()
  /** Emits before the value changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string[]
    details: ChangeDetails<ToggleGroupValueChangeReason>
  }>()
  /** Emits when focus leaves it, which marks it touched in Angular's forms. */
  readonly touch = output<void>()
  readonly #form = injectFormValue<string[]>()
  readonly #toolbar = injectToolbarScope()
  readonly handle: PrimitiveHandle<ToggleGroupPrimitive> = injectPrimitive(
    toggleGroup,
    () => ({
      toolbar: this.#toolbar(),
      value: this.value() ?? this.#form?.value(),
      defaultValue: this.defaultValue(),
      multiple: this.multiple(),
      deselectable: this.deselectable(),
      disabled: this.disabled() || this.#form?.disabled(),
      orientation: this.orientation(),
      loop: this.loop(),
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
  readonly #part = injectPart(this.handle, "group")
  /** The group's state. */
  readonly state = this.#part.state

  protected focusOut(event: FocusEvent) {
    if (leaves(event)) {
      this.touch.emit()
      this.#form?.touch()
    }
  }
}

/**
 * A button that stays pressed, on the element it's written on. Inside a
 * `uiToggleGroup`, the group decides whether it's pressed.
 * @experimental
 */
@Directive({
  selector: "[uiToggle]",
  exportAs: "uiToggle",
  host: { "(focusout)": "focusOut($event)" },
  providers: [provideRoot(toggle, () => UiToggle)],
})
class UiToggle {
  /** Whether it's pressed. Bind it, or `[(pressed)]`, to control the toggle. */
  readonly pressed = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether it's pressed at first, when uncontrolled. */
  readonly defaultPressed = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Identifies the toggle inside a group, whose value lists the pressed toggles' values. */
  readonly value = input<string>()
  /** Stops presses. Inside a group, it stays focusable with `aria-disabled`. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps a disabled toggle in the tab order with `aria-disabled`. */
  readonly focusableWhenDisabled = input<boolean | undefined, unknown>(
    undefined,
    { transform: optionalBoolean }
  )
  /** Presses it from anywhere. Create one with `createToggleController()`. */
  readonly controller = input<ToggleController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new value once a change isn't canceled, for `[(pressed)]`. */
  readonly pressedChange = output<boolean>()
  /** Emits before it changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforePressedChange = output<{
    pressed: boolean
    details: ChangeDetails<TogglePressedChangeReason>
  }>()
  /** Emits when focus leaves it, which marks it touched in Angular's forms. */
  readonly touch = output<void>()
  readonly #group = inject(tokenOf(toggleGroup), { optional: true })
  readonly #form = injectFormValue<boolean>()
  readonly #toolbar = injectToolbarScope()
  readonly handle: PrimitiveHandle<TogglePrimitive> = injectPrimitive(
    toggle,
    () => ({
      toolbar: this.#toolbar(),
      pressed: this.pressed() ?? this.#form?.value(),
      defaultPressed: this.defaultPressed(),
      value: this.value(),
      disabled: this.disabled() || this.#form?.disabled(),
      focusableWhenDisabled: this.focusableWhenDisabled(),
      group: this.#group ? () => this.#group!.handle.api : undefined,
      controller: this.controller(),
      debug: this.debug(),
      onPressedChange: (pressed, details) => {
        this.beforePressedChange.emit({ pressed, details })
        if (!details.canceled) {
          this.pressedChange.emit(pressed)
          this.#form?.change(pressed)
        }
      },
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The toggle's state. */
  readonly state = this.#part.state

  protected focusOut(event: FocusEvent) {
    if (leaves(event)) {
      this.touch.emit()
      this.#form?.touch()
    }
  }
}

/**
 * An icon inside a toggle. A toggle with only an icon needs an `aria-label`.
 * Screen readers skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiToggleIcon]", exportAs: "uiToggleIcon" })
class UiToggleIcon {
  /** Flips the icon horizontally in right-to-left text, for icons that point a way. */
  readonly mirror = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #toggle = inject(UiToggle, { optional: true })
  readonly #part = injectPart(injectHandle(toggle), "icon", () => ({
    mirror: this.mirror(),
    item: this.#toggle?.value(),
  }))
  /** The icon's state. */
  readonly state = this.#part.state
}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * toggle's `pressed`.
 * @experimental
 */
@Directive({
  selector:
    "[uiToggle][ngModel], [uiToggle][formControl], [uiToggle][formControlName]",
  providers: [provideValueAccessor(() => UiToggleValueAccessor)],
})
class UiToggleValueAccessor extends UiValueAccessor<boolean> {
  protected fromForm(value: unknown) {
    return !!value
  }
}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * toggle group's `value`.
 * @experimental
 */
@Directive({
  selector:
    "[uiToggleGroup][ngModel], [uiToggleGroup][formControl], [uiToggleGroup][formControlName]",
  providers: [provideValueAccessor(() => UiToggleGroupValueAccessor)],
})
class UiToggleGroupValueAccessor extends UiValueAccessor<string[]> {
  protected fromForm(value: unknown) {
    return Array.isArray(value) ? (value as string[]) : []
  }
}

export {
  createToggleController,
  createToggleGroupController,
} from "@ui-sdk/core/toggle"
export type {
  ToggleApi,
  ToggleChangeOptions,
  ToggleController,
  ToggleGroupApi,
  ToggleGroupChangeOptions,
  ToggleGroupController,
  ToggleGroupOptions,
  ToggleGroupOrientation,
  ToggleGroupPrimitive,
  ToggleGroupState,
  ToggleGroupValueChangeReason,
  ToggleIconProps,
  ToggleIconState,
  ToggleOptions,
  TogglePressedChangeReason,
  TogglePrimitive,
  ToggleState,
} from "@ui-sdk/core/toggle"

export {
  UiToggle,
  UiToggleGroup,
  UiToggleGroupValueAccessor,
  UiToggleIcon,
  UiToggleValueAccessor,
}
