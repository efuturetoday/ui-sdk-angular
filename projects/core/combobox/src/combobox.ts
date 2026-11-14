import {
  afterNextRender,
  computed,
  Directive,
  forwardRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  type InputSignal,
  type OnInit,
  type Signal,
} from "@angular/core"
import type {
  Anchor,
  ChangeDetails,
  DismissAttemptDetails,
  Side,
  TypesOf,
} from "@ui-sdk/core"
import type { AsyncOptionsStatus } from "@ui-sdk/core/async-options"
import {
  combobox,
  type ComboboxChipState,
  type ComboboxContentProps,
  type ComboboxContentState,
  type ComboboxController,
  type ComboboxDismissReason,
  type ComboboxItemIndicatorState,
  type ComboboxOpenChangeReason,
  type ComboboxPrimitive,
  type ComboboxQueryChangeReason,
  type ComboboxValueChangeReason,
  type ListAnnouncement,
  type ListData,
  type ListFilter,
  type ListHighlightDetails,
} from "@ui-sdk/core/combobox"
import {
  comboboxChips,
  comboboxCreate,
  comboboxItemIcons,
  comboboxSelectAll,
  selectAllKey,
} from "@ui-sdk/core/renderer"
import {
  ɵinjectContentOwner as injectContentOwner,
  ɵinjectDefaultText as injectDefaultText,
  ɵFieldContextToken as FieldContextToken,
  injectFieldControl,
  ɵinjectFormInputs as injectFormInputs,
  injectFormValue,
  ɵleaves as leaves,
  provideValueAccessor,
  UiValueAccessor,
  optionalBoolean,
  ListHighlight,
  VirtualIndex,
  injectPart,
  ɵinjectStatePart as injectStatePart,
  injectPopupPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
  injectPresentPart,
  type PresentPartContext,
} from "@ngx-ui-sdk/core"

/**
 * Why the combobox's value changes.
 * @experimental
 */
type ComboboxValueChangeDetails = ChangeDetails<ComboboxValueChangeReason>

/**
 * Why the combobox opens or closes.
 * @experimental
 */
type ComboboxOpenChangeDetails = ChangeDetails<ComboboxOpenChangeReason>

/**
 * Why the combobox's text changes.
 * @experimental
 */
type ComboboxQueryChangeDetails = ChangeDetails<ComboboxQueryChangeReason>

/**
 * A text input that filters a list in a popup and picks one value, or several
 * with `multiple`. It renders no element of its own, so it goes on an
 * `ng-container` around its parts. With `name`, a native form gets its value.
 * @experimental
 */
@Directive({
  selector: "[uiCombobox]",
  exportAs: "uiCombobox",
  providers: [
    provideRoot(combobox, () => UiCombobox),
    {
      provide: ListHighlight,
      useFactory: () => inject(forwardRef(() => UiCombobox)).highlighted,
    },
  ],
})
class UiCombobox implements OnInit {
  /** The selected value, or values with `multiple`. Bind it, or `[(value)]`, to control it. */
  readonly value = input<unknown>(undefined)
  /** The value at first, when uncontrolled. */
  readonly defaultValue = input<unknown>(undefined)
  /** The input's text. Bind it, or `[(query)]`, to control it. */
  readonly query = input<string>()
  /** The input's text at first, when uncontrolled. */
  readonly defaultQuery = input<string>()
  /** Whether the list is open. Bind it, or `[(open)]`, to control it. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the list is open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether several values can be selected, shown as chips. */
  readonly multiple = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** How many values `multiple` allows. */
  readonly maxSelected = input<number>()
  /** The items as data. Render them in the list yourself, from its `state().items`. */
  readonly items = input<ListData<any>>()
  /** The items shown while the input is empty, like recent ones. */
  readonly emptyItems = input<ListData<any>>()
  /** How the text filters the items, or `false` to leave filtering to you. */
  readonly filter = input<ListFilter<any>>()
  /** What a screen reader announces as the list changes. */
  readonly announcement =
    input<(change: ListAnnouncement) => string | null | undefined>()
  /** A data item's value, for items that aren't strings. */
  readonly itemToValue = input<(item: any) => string>()
  /** A data item's label, for items that aren't strings. */
  readonly itemToLabel = input<(item: any) => string>()
  /** Whether an item's value is the selected one, for values that are objects. */
  readonly isItemEqualToValue = input<(itemValue: any, value: any) => boolean>()
  /** Whether the first match is highlighted as the user types; `"always"` keeps one highlighted. */
  readonly autoHighlight = input<boolean | "always">()
  /** Keeps the text after choosing, instead of the chosen item's label. */
  readonly keepQuery = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Lets the text be a value that no item has. */
  readonly allowCustomValue = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** What a screen reader announces while a create action is pending. */
  readonly pendingAnnouncement = input<string>()
  /** The loading state of items that load as you type. */
  readonly status = input<AsyncOptionsStatus>()
  /** Whether the arrow keys wrap around. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the page behind is inert while open. */
  readonly modal = input<boolean | "pointer">()
  /** How it presents: `"sheet"` slides up from the bottom, with the input in its header. */
  readonly presentation = input<"auto" | "popover" | "sheet">()
  /** Stops it from opening and changing. */
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
  /** The name its value submits under in a native form. */
  readonly name = input<string>()
  /** The id of the form it belongs to, if it isn't inside it. */
  readonly form = input<string>()
  /** Opens it and sets its value from anywhere. Create one with `createComboboxController()`. */
  readonly controller = input<ComboboxController<any, any>>()
  /** Whether Escape and outside presses may close it, `true` by default. */
  readonly dismissible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Renders the list into this element instead of in place. */
  readonly container = input<Element | DocumentFragment | null>()
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<unknown>()
  /** Emits before the value changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: unknown
    details: ComboboxValueChangeDetails
  }>()
  /** Emits the new text once a change isn't canceled, for `[(query)]`. */
  readonly queryChange = output<string>()
  /** Emits before the text changes. `details.cancel()` stops it. */
  readonly beforeQueryChange = output<{
    query: string
    details: ComboboxQueryChangeDetails
  }>()
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the list opens or closes. `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: ComboboxOpenChangeDetails
  }>()
  /** Emits once the list has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when a dismissal is refused. */
  readonly dismissAttempt =
    output<DismissAttemptDetails<ComboboxDismissReason>>()
  /** Emits as an item is highlighted. */
  readonly highlight = output<{
    value: unknown
    details: ListHighlightDetails
  }>()
  readonly #highlighted = signal(-1)
  /** @internal The highlighted item's index, which `uiVirtualRows` scrolls into view. */
  readonly highlighted = this.#highlighted.asReadonly()
  /** Emits when the list scrolls near its end, to load more items. */
  readonly loadMore = output<void>()
  /** Emits when focus leaves the input while closed, which marks it touched in Signal Forms. */
  readonly touch = output<void>()
  readonly #form = injectFormValue<unknown>()
  readonly #field = inject(FieldContextToken, { optional: true })
  /** @internal The input, which moves into a sheet's header. */
  readonly inputElement = signal<HTMLElement | undefined>(undefined)
  readonly handle: PrimitiveHandle<ComboboxPrimitive> = injectPrimitive(
    combobox,
    () => ({
      value: this.value() ?? this.#form?.value(),
      defaultValue: this.defaultValue(),
      query: this.query(),
      defaultQuery: this.defaultQuery(),
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      multiple: this.multiple(),
      maxSelected: this.maxSelected(),
      items: this.items(),
      emptyItems: this.emptyItems(),
      filter: this.filter(),
      announcement: this.announcement(),
      itemToValue: this.itemToValue(),
      itemToLabel: this.itemToLabel(),
      isItemEqualToValue: this.isItemEqualToValue(),
      autoHighlight: this.autoHighlight(),
      keepQuery: this.keepQuery(),
      allowCustomValue: this.allowCustomValue(),
      pendingAnnouncement: this.pendingAnnouncement(),
      status: this.status(),
      loop: this.loop(),
      modal: this.modal(),
      presentation: this.presentation(),
      disabled:
        this.disabled() || this.#form?.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly() ?? this.readonly(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      controller: this.controller(),
      dismissible: this.dismissible(),
      onValueChange: (value: unknown, details: ComboboxValueChangeDetails) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
          this.#form?.change(value)
        }
      },
      onQueryChange: (query: string, details: ComboboxQueryChangeDetails) => {
        this.beforeQueryChange.emit({ query, details })
        if (!details.canceled) {
          this.queryChange.emit(query)
        }
      },
      onOpenChange: (open: boolean, details: ComboboxOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
      onDismissAttempt: (
        details: DismissAttemptDetails<ComboboxDismissReason>
      ) => this.dismissAttempt.emit(details),
      onHighlight: (value: unknown, details: ListHighlightDetails) => {
        this.#highlighted.set(details.index)
        this.highlight.emit({ value, details })
      },
      onLoadMore: () => this.loadMore.emit(),
    })
  )
  /** The combobox's state. */
  readonly state: Signal<TypesOf<ComboboxPrimitive>["state"]> =
    this.handle.state
  readonly #inputs = injectFormInputs(this.handle, () =>
    this.handle.state().multiple
      ? (this.handle.api.internal.serialized() as string[])
      : []
  )

  constructor() {
    // Angular can't read the items before they render, the way React and Vue
    // find the value's label among their children, so a combobox that still
    // lacks one shows its list hidden once, and the items say theirs.
    afterNextRender(() => {
      const { internal } = this.handle.api
      if (
        !this.itemToLabel() &&
        internal.selection.needsItems(internal.hasValueIcon())
      ) {
        internal.prepare()
      }
    })
  }

  /** @internal Called by the input as focus leaves it. */
  touched() {
    this.touch.emit()
    this.#form?.touch()
  }

  ngOnInit() {
    this.handle.init()
    this.#inputs.init()
  }
}

/**
 * A visible label for the input.
 * @experimental
 */
@Directive({ selector: "[uiComboboxLabel]", exportAs: "uiComboboxLabel" })
class UiComboboxLabel implements OnInit {
  readonly #part = injectPart(injectHandle(combobox), "label")
  /** The label's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The text input that filters the list and holds the chosen item's label.
 * Presented as a sheet, it moves into the sheet's header while open.
 * @experimental
 */
@Directive({
  selector: "input[uiComboboxInput]",
  exportAs: "uiComboboxInput",
  host: { "(focusout)": "focusOut($event)" },
})
class UiComboboxInput implements OnInit {
  readonly #root = inject(UiCombobox)
  readonly #field = injectFieldControl()
  readonly #part = injectPart(
    injectHandle(combobox),
    "input",
    undefined,
    this.#field?.join
  )
  /** The input's state. */
  readonly state = this.#part.state

  constructor() {
    this.#root.inputElement.set(inject(ElementRef).nativeElement)
  }

  protected focusOut(event: FocusEvent) {
    if (leaves(event) && !this.#root.state().open) {
      this.#root.touched()
    }
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A button that opens the list.
 * @experimental
 */
@Directive({ selector: "[uiComboboxTrigger]", exportAs: "uiComboboxTrigger" })
class UiComboboxTrigger implements OnInit {
  readonly #part = injectPart(injectHandle(combobox), "trigger")
  /** The trigger's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The popup that holds the list, on the element it's written on:
 * `<div *uiComboboxContent>`.
 * @experimental
 */
@Directive({ selector: "[uiComboboxContent]" })
class UiComboboxContent implements OnInit {
  /** Which side of the input it opens on: `*uiComboboxContent="let state; side: 'top'"`. */
  readonly side = input<Side>(undefined, { alias: "uiComboboxContentSide" })
  /** How it lines up with the input along that side. */
  readonly align = input<"start" | "center" | "end">(undefined, {
    alias: "uiComboboxContentAlign",
  })
  /** Gap between the input and the list, in pixels. */
  readonly sideOffset = input<number>(undefined, {
    alias: "uiComboboxContentSideOffset",
  })
  /** Shift along the input, in pixels. */
  readonly alignOffset = input<number>(undefined, {
    alias: "uiComboboxContentAlignOffset",
  })
  /** Space it keeps from the edges of the screen, in pixels. */
  readonly collisionPadding = input<number>(undefined, {
    alias: "uiComboboxContentCollisionPadding",
  })
  /** Space the arrow keeps from the list's corners, in pixels. */
  readonly arrowPadding = input<number>(undefined, {
    alias: "uiComboboxContentArrowPadding",
  })
  /** What it's positioned against instead of the input. */
  readonly anchor = input<Anchor | string | null>(undefined, {
    alias: "uiComboboxContentAnchor",
  })
  /** Keeps the list in the page, hidden, while closed. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiComboboxContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Where the list renders, instead of the root's `container`. */
  readonly container: InputSignal<ComboboxContentProps["container"]> = input<
    ComboboxContentProps["container"]
  >(undefined, { alias: "uiComboboxContentContainer" })
  readonly #props = computed(() => ({
    side: this.side(),
    align: this.align(),
    sideOffset: this.sideOffset(),
    alignOffset: this.alignOffset(),
    collisionPadding: this.collisionPadding(),
    arrowPadding: this.arrowPadding(),
    anchor: this.anchor(),
    keepMounted: this.keepMounted(),
  }))
  readonly #root = inject(UiCombobox)
  readonly #part = injectPopupPart(
    injectHandle(combobox),
    "content",
    this.#props,
    {
      container: () => this.container() ?? this.#root.container(),
      viewport: "viewport",
      header: { slot: "header", input: () => this.#root.inputElement() },
    }
  )

  static ngTemplateContextGuard(
    _directive: UiComboboxContent,
    _context: unknown
  ): _context is PresentPartContext<ComboboxContentState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The listbox. A data combobox renders its matching items in it from
 * `state().items`.
 * @experimental
 */
@Directive({ selector: "[uiComboboxList]", exportAs: "uiComboboxList" })
class UiComboboxList implements OnInit {
  readonly #part = injectPart(injectHandle(combobox), "list")
  /** The list's state, with the `items` that match. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A group of items, named by its `uiComboboxGroupLabel`, and hidden while none
 * of its items shows.
 * @experimental
 */
@Directive({ selector: "[uiComboboxGroup]", exportAs: "uiComboboxGroup" })
class UiComboboxGroup implements OnInit {
  /** @internal The group's id, which its items and label name. */
  readonly id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(combobox), "group", () => ({
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
  selector: "[uiComboboxGroupLabel]",
  exportAs: "uiComboboxGroupLabel",
})
class UiComboboxGroupLabel implements OnInit {
  readonly #group = inject(UiComboboxGroup)
  readonly #part = injectPart(injectHandle(combobox), "group-label", () => ({
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
 * An option. Choosing it selects it, or toggles it with `multiple`.
 * @experimental
 */
@Directive({ selector: "[uiComboboxItem]", exportAs: "uiComboboxItem" })
class UiComboboxItem implements OnInit {
  /** The value it selects. */
  readonly value = input.required<unknown>()
  /** Its label, if its text isn't. */
  readonly label = input<string>()
  /** More words the text matches it by. */
  readonly keywords = input<string[]>()
  /** Stops it from being chosen. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Its position among the data items, for screen readers while some aren't rendered. */
  readonly index = input<number>()
  readonly #virtualIndex = inject(VirtualIndex, { optional: true })
  readonly #group = inject(UiComboboxGroup, { optional: true })
  readonly #part = injectPart(injectHandle(combobox), "item", () => ({
    value: this.value() as string,
    label: this.label(),
    keywords: this.keywords(),
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
 * The item's text. Written empty, it shows the item's label with the part the
 * text matched in `<mark>`. With content of its own, the content is yours:
 * render `state().segments` to mark the match, and give the item a `label`.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxItemText]",
  exportAs: "uiComboboxItemText",
})
class UiComboboxItemText implements OnInit {
  readonly #item = inject(UiComboboxItem)
  readonly #handle = injectHandle(combobox)
  readonly #content = injectContentOwner()
  // Its text is the item's label as core knows it: its `label`, or its text.
  readonly #part = injectPart(this.#handle, "item-text", () => {
    this.#handle.version()
    const { internal } = this.#handle.api
    const value = this.#item.value()
    return {
      id: value as string,
      text:
        this.#item.label() ??
        internal.listbox.labelOf(internal.keyOf(value)) ??
        String(value),
      write: this.#content.core(),
    }
  })
  /** The text's state, with the match. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#content.decide()
    this.#part.init()
  }
}

/**
 * The check inside a selected item, on the element it's written on:
 * `<span *uiComboboxItemIndicator>`. Rendered while its item is selected, or
 * always with `keepMounted`.
 * @experimental
 */
@Directive({ selector: "[uiComboboxItemIndicator]" })
class UiComboboxItemIndicator implements OnInit {
  /** Keeps it in the page while unselected: `*uiComboboxItemIndicator="let state; keepMounted: true"`. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiComboboxItemIndicatorKeepMounted",
    transform: optionalBoolean,
  })
  readonly #item = inject(UiComboboxItem)
  readonly #id = inject(UiIds).next()
  readonly #part = injectPresentPart(
    injectHandle(combobox),
    "item-indicator",
    computed(() => ({
      item: this.#item.value() as string,
      keepMounted: this.keepMounted(),
      id: this.#id,
    }))
  )

  static ngTemplateContextGuard(
    _directive: UiComboboxItemIndicator,
    _context: unknown
  ): _context is PresentPartContext<ComboboxItemIndicatorState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An option that selects every item that matches, with `multiple`: in its
 * group inside a `uiComboboxGroup`, or in the whole list.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxSelectAll]",
  exportAs: "uiComboboxSelectAll",
})
class UiComboboxSelectAll implements OnInit {
  readonly #group = inject(UiComboboxGroup, { optional: true })
  readonly #handle = injectHandle(combobox)
  readonly #part = injectPart(this.#handle, "select-all", () => ({
    id: selectAllKey(this.#group?.id),
  }))
  /** The option's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#handle.instance.use(comboboxSelectAll)
    this.#part.init()
  }
}

/**
 * An icon inside an item. A `uiComboboxValueIcon` shows the selected item's.
 * Screen readers, typeahead and filtering skip it, and `mirror` flips it in
 * right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiComboboxItemIcon]", exportAs: "uiComboboxItemIcon" })
class UiComboboxItemIcon implements OnInit {
  /** Flips it in right-to-left text, for icons that point a way. */
  readonly mirror = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #item = inject(UiComboboxItem)
  readonly #id = inject(UiIds).next()
  readonly #handle = injectHandle(combobox)
  readonly #part = injectPart(this.#handle, "item-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
    item: this.#item.value() as string,
  }))
  /** The icon's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#handle.instance.use(comboboxItemIcons)
    this.#part.init()
  }
}

/**
 * The selected item's icon, copied from its `uiComboboxItemIcon`, like before
 * the input. Write it empty: its content is the copy core writes.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxValueIcon]",
  exportAs: "uiComboboxValueIcon",
})
class UiComboboxValueIcon implements OnInit {
  readonly #handle = injectHandle(combobox)
  readonly #part = injectPart(this.#handle, "value-icon")

  ngOnInit() {
    this.#handle.instance.use(comboboxItemIcons)
    this.#part.init()
  }
}

/**
 * A line between items or groups, hidden from screen readers.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxSeparator]",
  exportAs: "uiComboboxSeparator",
})
class UiComboboxSeparator implements OnInit {
  readonly #part = injectPart(injectHandle(combobox), "separator")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An option that creates an item from the input's text, on the element it's
 * written on: `<div *uiComboboxCreate="let state; onCreate: add">`. Written
 * empty, it says Create “…”.
 * @experimental
 */
@Directive({ selector: "[uiComboboxCreate]" })
class UiComboboxCreate implements OnInit {
  /** Runs with the text when the option is chosen. A returned Promise marks it pending until it settles. */
  readonly onCreate = input<(query: string) => unknown>(undefined, {
    alias: "uiComboboxCreateOnCreate",
  })
  /** How many characters the text needs before the option shows. */
  readonly minLength = input<number>(undefined, {
    alias: "uiComboboxCreateMinLength",
  })
  readonly #handle = injectHandle(combobox)
  readonly #part = injectPresentPart(
    this.#handle,
    "create",
    computed(() => ({
      onCreate: this.onCreate(),
      minLength: this.minLength(),
      text: true,
    }))
  )

  ngOnInit() {
    this.#handle.instance.use(comboboxCreate)
    this.#part.init()
  }
}

/**
 * Shown while no item matches; its message is announced as it appears. Its
 * content shows only then.
 * @experimental
 */
@Directive({ selector: "[uiComboboxEmpty]", exportAs: "uiComboboxEmpty" })
class UiComboboxEmpty implements OnInit {
  readonly #part = injectPart(injectHandle(combobox), "empty", () => ({
    stash: true,
  }))
  /** The empty message's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A polite live region for loading and result counts. Its content is yours.
 * @experimental
 */
@Directive({ selector: "[uiComboboxStatus]", exportAs: "uiComboboxStatus" })
class UiComboboxStatus implements OnInit {
  readonly #part = injectPart(injectHandle(combobox), "status")
  /** The status's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A button that empties the input and selects nothing, on the element it's
 * written on: `<button *uiComboboxClear>`. Rendered while there's something
 * to clear, or always with `keepMounted`.
 * @experimental
 */
@Directive({ selector: "[uiComboboxClear]" })
class UiComboboxClear implements OnInit {
  /** Keeps it in the page while there's nothing to clear. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiComboboxClearKeepMounted",
    transform: optionalBoolean,
  })
  readonly #part = injectPresentPart(
    injectHandle(combobox),
    "clear",
    computed(() => ({ keepMounted: this.keepMounted() }))
  )

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The selected value, for rendering chips or a summary. It renders no element:
 * put it on an `ng-container` and read `state()`, like
 * `<ng-container uiComboboxValue #value="uiComboboxValue">`.
 * @experimental
 */
@Directive({ selector: "[uiComboboxValue]", exportAs: "uiComboboxValue" })
class UiComboboxValue implements OnInit {
  /** How many labels `state().label` lists before it sums the rest up. */
  readonly maxLabels = input<number>()
  /** The text for the labels it leaves out, like `"+2 more"`. */
  readonly getMoreLabel = input<(count: number) => string>()
  readonly #part = injectStatePart(injectHandle(combobox), "value", () => ({
    maxLabels: this.maxLabels(),
    getMoreLabel: this.getMoreLabel(),
  }))
  /** The value's state: `value`, and its `label`. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The selected values as chips, around the input.
 * @experimental
 */
@Directive({ selector: "[uiComboboxChips]", exportAs: "uiComboboxChips" })
class UiComboboxChips implements OnInit {
  readonly #handle = injectHandle(combobox)
  readonly #part = injectPart(this.#handle, "chips")
  /** The chips' state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#handle.instance.use(comboboxChips)
    this.#part.init()
  }
}

/**
 * How many chips don't fit on the chips' line, once some collapse. Rendering
 * it inside `uiComboboxChips` turns collapsing on. Written empty, "+2 more".
 * @experimental
 */
@Directive({
  selector: "[uiComboboxChipsOverflow]",
  exportAs: "uiComboboxChipsOverflow",
})
class UiComboboxChipsOverflow implements OnInit {
  readonly #handle = injectHandle(combobox)
  readonly #content = injectContentOwner()
  readonly #part = injectPart(this.#handle, "chips-overflow", () => ({
    text: this.#content.core(),
  }))
  /** The overflow's state, with its `count`. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#content.decide()
    this.#handle.instance.use(comboboxChips)
    this.#part.init()
  }
}

/**
 * One selected value. Written empty, it shows the value's label.
 * @experimental
 */
@Directive({ selector: "[uiComboboxChip]", exportAs: "uiComboboxChip" })
class UiComboboxChip implements OnInit {
  /** The value it shows. */
  readonly value = input.required<unknown>()
  readonly #handle = injectHandle(combobox)
  readonly #part = injectPart(this.#handle, "chip", () => ({
    id: this.#handle.api.internal.keyOf(this.value()),
    value: this.value() as string,
  }))
  /** The chip's state, with its `label`. */
  readonly state: Signal<ComboboxChipState> = this.#part.state
  readonly #text = injectDefaultText(() => this.state()?.label ?? "")

  ngOnInit() {
    this.#text.decide()
    this.#handle.instance.use(comboboxChips)
    this.#part.init()
  }
}

/**
 * A button inside a chip that removes its value. Name it with `aria-label`.
 * @experimental
 */
@Directive({
  selector: "[uiComboboxChipRemove]",
  exportAs: "uiComboboxChipRemove",
})
class UiComboboxChipRemove implements OnInit {
  readonly #chip = inject(UiComboboxChip)
  readonly #handle = injectHandle(combobox)
  readonly #part = injectPart(this.#handle, "chip-remove", () => ({
    id: this.#handle.api.internal.keyOf(this.#chip.value()),
    value: this.#chip.value() as string,
  }))
  /** The button's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#handle.instance.use(comboboxChips)
    this.#part.init()
  }
}

/**
 * An arrow on the popup's edge that points at the input.
 * @experimental
 */
@Directive({ selector: "[uiComboboxArrow]", exportAs: "uiComboboxArrow" })
class UiComboboxArrow implements OnInit {
  readonly #part = injectPart(injectHandle(combobox), "arrow")
  /** The arrow's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * combobox's `value`. Signal Forms' `formField` needs nothing more.
 * @experimental
 */
@Directive({
  selector:
    "[uiCombobox][ngModel], [uiCombobox][formControl], [uiCombobox][formControlName]",
  providers: [provideValueAccessor(() => UiComboboxValueAccessor)],
})
class UiComboboxValueAccessor extends UiValueAccessor<unknown> {
  protected fromForm(value: unknown) {
    return value ?? null
  }
}

export { createComboboxController } from "@ui-sdk/core/combobox"
export type {
  ComboboxApi,
  ComboboxArrowState,
  ComboboxChangeOptions,
  ComboboxChipProps,
  ComboboxChipsOverflowState,
  ComboboxChipState,
  ComboboxClearProps,
  ComboboxClearState,
  ComboboxContentProps,
  ComboboxContentState,
  ComboboxController,
  ComboboxCreateProps,
  ComboboxCreateState,
  ComboboxDismissReason,
  ComboboxEmptyState,
  ComboboxInputState,
  ComboboxItemIconProps,
  ComboboxItemIconState,
  ComboboxItemIndicatorProps,
  ComboboxItemIndicatorState,
  ComboboxItemProps,
  ComboboxItemState,
  ComboboxItemTextState,
  ComboboxOpenChangeReason,
  ComboboxOptions,
  ComboboxPrimitive,
  ComboboxQueryChangeReason,
  ComboboxSelectAllState,
  ComboboxStatusState,
  ComboboxTriggerState,
  ComboboxValue,
  ComboboxValueChangeReason,
  ComboboxValueProps,
  ComboboxValueState,
  ListAnnouncement,
  ListData,
  ListFilter,
  ListGroup,
  ListHighlightDetails,
  ListItem,
  ListSeparator,
  MatchSegment,
} from "@ui-sdk/core/combobox"

export {
  type ComboboxOpenChangeDetails,
  type ComboboxQueryChangeDetails,
  type ComboboxValueChangeDetails,
  UiCombobox,
  UiComboboxArrow,
  UiComboboxChip,
  UiComboboxChipRemove,
  UiComboboxChips,
  UiComboboxChipsOverflow,
  UiComboboxClear,
  UiComboboxContent,
  UiComboboxCreate,
  UiComboboxEmpty,
  UiComboboxGroup,
  UiComboboxGroupLabel,
  UiComboboxInput,
  UiComboboxItem,
  UiComboboxItemIcon,
  UiComboboxItemIndicator,
  UiComboboxItemText,
  UiComboboxLabel,
  UiComboboxList,
  UiComboboxSelectAll,
  UiComboboxSeparator,
  UiComboboxStatus,
  UiComboboxTrigger,
  UiComboboxValue,
  UiComboboxValueAccessor,
  UiComboboxValueIcon,
}
