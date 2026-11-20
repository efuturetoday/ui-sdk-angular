import {
  computed,
  Directive,
  forwardRef,
  inject,
  input,
  output,
  signal,
  type OnInit,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  listbox,
  type ListData,
  type ListHighlightDetails,
  type ListboxController,
  type ListboxItemIndicatorState,
  type ListboxPrimitive,
  type ListboxValueChangeReason,
} from "@ui-sdk/core/listbox"
import {
  injectFieldControl,
  ɵinjectFormInputs as injectFormInputs,
  injectFormValue,
  provideValueAccessor,
  UiValueAccessor,
  optionalBoolean,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
  injectPresentPart,
  type PresentPartContext,
  ListHighlight,
  VirtualIndex,
} from "@ngx-ui-sdk/core"

/**
 * Why the listbox's value changes.
 * @experimental
 */
type ListboxValueChangeDetails = ChangeDetails<ListboxValueChangeReason>

/**
 * An always-visible list to choose one option from, or several with
 * `multiple`, on the element it's written on. With `name`, a native form gets
 * its value.
 * @experimental
 */
@Directive({
  selector: "[uiListbox]",
  exportAs: "uiListbox",
  providers: [
    provideRoot(listbox, () => UiListbox),
    {
      provide: ListHighlight,
      useFactory: () => inject(forwardRef(() => UiListbox)).highlighted,
    },
  ],
})
class UiListbox implements OnInit {
  /** The selected value, or values with `multiple`. Bind it, or `[(value)]`, to control it. */
  readonly value = input<unknown>(undefined)
  /** The value at first, when uncontrolled. */
  readonly defaultValue = input<unknown>(undefined)
  /** Whether several values can be selected. */
  readonly multiple = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether moving through the items selects them, `"automatic"`, or only pressing does, `"manual"`. */
  readonly activation = input<"automatic" | "manual">()
  /** Whether pressing the selected item selects nothing. */
  readonly deselectable = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Which arrow keys move through the items. */
  readonly orientation = input<"horizontal" | "vertical">()
  /** Whether the arrow keys wrap around. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps focus on the list itself: arrow keys, Home, End and typing move a highlight the list points at with `aria-activedescendant`. */
  readonly virtualFocus = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Scrolls the selected item into view as the value changes. */
  readonly keepInView = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The items as data. Render them yourself, from its `state().items`. */
  readonly items = input<ListData<any>>()
  /** A data item's value, for items that aren't strings. */
  readonly itemToValue = input<(item: any) => string>()
  /** Whether an item's value is the selected one, for values that are objects. */
  readonly isItemEqualToValue = input<(itemValue: any, value: any) => boolean>()
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
  /** Sets its value from anywhere. Create one with `createListboxController()`. */
  readonly controller = input<ListboxController<any, any>>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<unknown>()
  /** Emits before the value changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: unknown
    details: ListboxValueChangeDetails
  }>()
  /** Emits as an item is highlighted. */
  readonly highlight = output<{
    value: unknown
    details: ListHighlightDetails
  }>()
  readonly #highlighted = signal(-1)
  /** @internal The highlighted item's index, which `*uiVirtualFor` scrolls into view. */
  readonly highlighted = this.#highlighted.asReadonly()
  readonly #form = injectFormValue<unknown>()
  readonly #field = injectFieldControl()
  readonly handle: PrimitiveHandle<ListboxPrimitive> = injectPrimitive(
    listbox,
    () => ({
      value: this.value() !== undefined ? this.value() : this.#form?.value(),
      defaultValue: this.defaultValue(),
      multiple: this.multiple(),
      activation: this.activation(),
      deselectable: this.deselectable(),
      orientation: this.orientation(),
      loop: this.loop(),
      virtualFocus: this.virtualFocus(),
      keepInView: this.keepInView(),
      items: this.items(),
      itemToValue: this.itemToValue(),
      isItemEqualToValue: this.isItemEqualToValue(),
      disabled:
        this.disabled() || this.#form?.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly() ?? this.readonly(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      controller: this.controller(),
      debug: this.debug(),
      onValueChange: (value: unknown, details: ListboxValueChangeDetails) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
          this.#form?.change(value)
        }
      },
      onHighlight: (value: unknown, details: ListHighlightDetails) => {
        this.#highlighted.set(details.index)
        this.highlight.emit({ value, details })
      },
    })
  )
  readonly #part = injectPart(this.handle, "root", undefined, {
    join: this.#field?.join,
  })
  /** The listbox's state. */
  readonly state = this.#part.state
  readonly #inputs = injectFormInputs(this.handle, () =>
    this.handle.state().multiple
      ? (this.handle.api.internal.serialized() as string[])
      : []
  )

  ngOnInit() {
    this.handle.init()
    this.#part.init()
    this.#inputs.init()
  }
}

/**
 * A group of items, named by its `uiListboxGroupLabel`.
 * @experimental
 */
@Directive({ selector: "[uiListboxGroup]", exportAs: "uiListboxGroup" })
class UiListboxGroup implements OnInit {
  /** @internal The group's id, which its items and label name. */
  readonly id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(listbox), "group", () => ({
    id: this.id,
  }))
  /** The group's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The group's heading, which names the group.
 * @experimental
 */
@Directive({
  selector: "[uiListboxGroupLabel]",
  exportAs: "uiListboxGroupLabel",
})
class UiListboxGroupLabel implements OnInit {
  readonly #group = inject(UiListboxGroup)
  readonly #part = injectPart(injectHandle(listbox), "group-label", () => ({
    id: this.#group.id,
    group: this.#group.id,
  }))
  /** The label's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An option. Pressing it selects it, or toggles it with `multiple`.
 * @experimental
 */
@Directive({ selector: "[uiListboxItem]", exportAs: "uiListboxItem" })
class UiListboxItem implements OnInit {
  /** The value it selects. */
  readonly value = input.required<unknown>()
  /** Its label, if its text isn't, for typeahead and screen readers. */
  readonly label = input<string>()
  /** Stops it from being selected. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Its position among the data items, for screen readers while some aren't rendered. */
  readonly index = input<number>()
  readonly #virtualIndex = inject(VirtualIndex, { optional: true })
  readonly #group = inject(UiListboxGroup, { optional: true })
  readonly #part = injectPart(injectHandle(listbox), "item", () => ({
    value: this.value() as string,
    label: this.label(),
    disabled: this.disabled(),
    index: this.index() ?? this.#virtualIndex ?? undefined,
    group: this.#group?.id,
  }))
  /** The item's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The check inside a selected item, on the element it's written on:
 * `<span *uiListboxItemIndicator>`. Rendered while its item is selected, or
 * always with `keepMounted`.
 * @experimental
 */
@Directive({ selector: "[uiListboxItemIndicator]" })
class UiListboxItemIndicator implements OnInit {
  /** Keeps it in the page while unselected: `*uiListboxItemIndicator="let state; keepMounted: true"`. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiListboxItemIndicatorKeepMounted",
    transform: optionalBoolean,
  })
  readonly #item = inject(UiListboxItem)
  readonly #id = inject(UiIds).next()
  readonly #part = injectPresentPart(
    injectHandle(listbox),
    "item-indicator",
    computed(() => ({
      item: this.#item.value() as string,
      keepMounted: this.keepMounted(),
      id: this.#id,
    }))
  )

  static ngTemplateContextGuard(
    _directive: UiListboxItemIndicator,
    _context: unknown
  ): _context is PresentPartContext<ListboxItemIndicatorState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An icon inside an item. Screen readers and typeahead skip it, and `mirror`
 * flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiListboxItemIcon]", exportAs: "uiListboxItemIcon" })
class UiListboxItemIcon implements OnInit {
  /** Flips it in right-to-left text, for icons that point a way. */
  readonly mirror = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #item = inject(UiListboxItem)
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(listbox), "item-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
    item: this.#item.value() as string,
  }))
  /** The icon's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A line between items or groups, hidden from screen readers.
 * @experimental
 */
@Directive({ selector: "[uiListboxSeparator]", exportAs: "uiListboxSeparator" })
class UiListboxSeparator implements OnInit {
  readonly #part = injectPart(injectHandle(listbox), "separator")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * listbox's `value`. Signal Forms' `formField` needs nothing more.
 * @experimental
 */
@Directive({
  selector:
    "[uiListbox][ngModel], [uiListbox][formControl], [uiListbox][formControlName]",
  providers: [provideValueAccessor(() => UiListboxValueAccessor)],
})
class UiListboxValueAccessor extends UiValueAccessor<unknown> {
  protected fromForm(value: unknown) {
    return value ?? null
  }
}

export { createListboxController } from "@ui-sdk/core/listbox"
export type {
  ListboxApi,
  ListboxChangeOptions,
  ListboxController,
  ListboxItemIconProps,
  ListboxItemIconState,
  ListboxItemIndicatorProps,
  ListboxItemIndicatorState,
  ListboxItemProps,
  ListboxItemState,
  ListboxOptions,
  ListboxPrimitive,
  ListboxState,
  ListboxValue,
  ListboxValueChangeReason,
  ListData,
  ListGroup,
  ListHighlightDetails,
  ListItem,
  ListSeparator,
} from "@ui-sdk/core/listbox"

export {
  type ListboxValueChangeDetails,
  UiListbox,
  UiListboxGroup,
  UiListboxGroupLabel,
  UiListboxItem,
  UiListboxItemIcon,
  UiListboxItemIndicator,
  UiListboxSeparator,
  UiListboxValueAccessor,
}
