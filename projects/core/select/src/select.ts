import {
  afterNextRender,
  computed,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
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
  selectAllKey,
  selectItemIcons,
  selectSelectAll,
} from "@ui-sdk/core/renderer"
import {
  select,
  type ListAnnouncement,
  type ListData,
  type ListFilter,
  type ListHighlightDetails,
  type SelectContentProps,
  type SelectContentState,
  type SelectController,
  type SelectDismissReason,
  type SelectItemIndicatorState,
  type SelectOpenChangeReason,
  type SelectPrimitive,
  type SelectQueryChangeReason,
  type SelectValueChangeReason,
  type SelectValueState,
} from "@ui-sdk/core/select"
import {
  ɵinjectContentOwner as injectContentOwner,
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
  injectConnectedPart,
  injectPart,
  injectTargetPart,
  injectPopupPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵtokenOf as tokenOf,
  ɵUiIds as UiIds,
  injectPresentPart,
  type PresentPartContext,
} from "@ngx-ui-sdk/core"

/**
 * Why the select's value changes.
 * @experimental
 */
type SelectValueChangeDetails = ChangeDetails<SelectValueChangeReason>

/**
 * Why the select opens or closes.
 * @experimental
 */
type SelectOpenChangeDetails = ChangeDetails<SelectOpenChangeReason>

/**
 * Why the select's search query changes.
 * @experimental
 */
type SelectQueryChangeDetails = ChangeDetails<SelectQueryChangeReason>

// The select a part inside a trigger belongs to: the trigger's, which a
// trigger outside the select finds through its controller.
const SelectTarget = new InjectionToken<
  Signal<PrimitiveHandle<SelectPrimitive> | undefined>
>("select-target")

/**
 * Picks one value, or several with `multiple`, from a list in a popup. It
 * renders no element of its own, so it goes on an `ng-container` around its
 * parts. With `name`, a native form gets its value.
 * @experimental
 */
@Directive({
  selector: "[uiSelect]",
  exportAs: "uiSelect",
  providers: [
    provideRoot(select, () => UiSelect),
    {
      provide: ListHighlight,
      useFactory: () => inject(forwardRef(() => UiSelect)).highlighted,
    },
  ],
})
class UiSelect implements OnInit {
  /** The selected value, or values with `multiple`. Bind it, or `[(value)]`, to control it. */
  readonly value = input<unknown>(undefined)
  /** The value at first, when uncontrolled. */
  readonly defaultValue = input<unknown>(undefined)
  /** Whether the list is open. Bind it, or `[(open)]`, to control it. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the list is open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether several values can be selected. */
  readonly multiple = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The items as data. Render them in the content yourself, from its `state().items`. */
  readonly items = input<ListData<any>>()
  /** The items shown while the search is empty, like recent ones. */
  readonly emptyItems = input<ListData<any>>()
  /** The search query. Bind it, or `[(query)]`, to control it. */
  readonly query = input<string>()
  /** The search query at first, when uncontrolled. */
  readonly defaultQuery = input<string>()
  /** How the search filters the items, or `false` to leave filtering to you. */
  readonly filter = input<ListFilter<any>>()
  /** The loading state of items that load as you search. */
  readonly status = input<AsyncOptionsStatus>()
  /** What a screen reader announces as the list changes. */
  readonly announcement =
    input<(change: ListAnnouncement) => string | null | undefined>()
  /** What the trigger shows while nothing is selected. */
  readonly placeholder = input<string>()
  /** A data item's value, for items that aren't strings. */
  readonly itemToValue = input<(item: any) => string>()
  /** A data item's label, for items that aren't strings. */
  readonly itemToLabel = input<(item: any) => string>()
  /** Whether an item's value is the selected one, for values that are objects. */
  readonly isItemEqualToValue = input<(itemValue: any, value: any) => boolean>()
  /** Whether the arrow keys wrap around. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the page behind is inert while open. */
  readonly modal = input<boolean | "pointer">()
  /** How it presents: `"sheet"` slides up from the bottom, `"auto"` does that on small touch screens. */
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
  /** The browser's autofill hint, like `"country"`. */
  readonly autoComplete = input<string>()
  /** Opens it and sets its value from anywhere. Create one with `createSelectController()`. */
  readonly controller = input<SelectController<any, any>>()
  /** Whether Escape and outside presses may close it, `true` by default. */
  readonly dismissible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Logs why it opens and closes to the console. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Renders the list into this element instead of in place. */
  readonly container = input<Element | DocumentFragment | null>()
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<unknown>()
  /** Emits before the value changes. `details.reason` says why, and `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: unknown
    details: SelectValueChangeDetails
  }>()
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the list opens or closes. `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: SelectOpenChangeDetails
  }>()
  /** Emits once the list has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when a dismissal is refused, like Escape on a select that isn't `dismissible`. */
  readonly dismissAttempt = output<DismissAttemptDetails<SelectDismissReason>>()
  /** Emits as an item is highlighted. */
  readonly highlight = output<{
    value: unknown
    details: ListHighlightDetails
  }>()
  /** Emits the new query once a change isn't canceled, for `[(query)]`. */
  readonly queryChange = output<string>()
  /** Emits before the query changes. `details.cancel()` stops it. */
  readonly beforeQueryChange = output<{
    query: string
    details: SelectQueryChangeDetails
  }>()
  readonly #highlighted = signal(-1)
  /** @internal The highlighted item's index, which `uiVirtualRows` scrolls into view. */
  readonly highlighted = this.#highlighted.asReadonly()
  /** Emits when the list scrolls near its end, to load more items. */
  readonly loadMore = output<void>()
  /** Emits when focus leaves the trigger while closed, which marks it touched in Signal Forms. */
  readonly touch = output<void>()
  readonly #form = injectFormValue<unknown>()
  readonly #field = inject(FieldContextToken, { optional: true })
  readonly handle: PrimitiveHandle<SelectPrimitive> = injectPrimitive(
    select,
    () => ({
      value: this.value() ?? this.#form?.value(),
      defaultValue: this.defaultValue(),
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      multiple: this.multiple(),
      items: this.items(),
      emptyItems: this.emptyItems(),
      query: this.query(),
      defaultQuery: this.defaultQuery(),
      filter: this.filter(),
      status: this.status(),
      announcement: this.announcement(),
      placeholder: this.placeholder(),
      itemToValue: this.itemToValue(),
      itemToLabel: this.itemToLabel(),
      isItemEqualToValue: this.isItemEqualToValue(),
      loop: this.loop(),
      modal: this.modal(),
      presentation: this.presentation(),
      disabled:
        this.disabled() || this.#form?.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly() ?? this.readonly(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      autoComplete: this.autoComplete(),
      controller: this.controller(),
      dismissible: this.dismissible(),
      debug: this.debug(),
      onValueChange: (value: unknown, details: SelectValueChangeDetails) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
          this.#form?.change(value)
        }
      },
      onOpenChange: (open: boolean, details: SelectOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
      onDismissAttempt: (details: DismissAttemptDetails<SelectDismissReason>) =>
        this.dismissAttempt.emit(details),
      onHighlight: (value: unknown, details: ListHighlightDetails) => {
        this.#highlighted.set(details.index)
        this.highlight.emit({ value, details })
      },
      onQueryChange: (query: string, details: SelectQueryChangeDetails) => {
        this.beforeQueryChange.emit({ query, details })
        if (!details.canceled) {
          this.queryChange.emit(query)
        }
      },
      onLoadMore: () => this.loadMore.emit(),
    })
  )
  /** The select's state. */
  readonly state: Signal<TypesOf<SelectPrimitive>["state"]> = this.handle.state
  readonly #inputs = injectFormInputs(this.handle, () =>
    this.handle.state().multiple
      ? (this.handle.api.internal.serialized() as string[])
      : []
  )

  constructor() {
    // Angular can't read the items before they render, the way React and Vue
    // find the value's label among their children, so a select that still
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

  /** @internal Called by the trigger as focus leaves it. */
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
 * A visible label for the select. Pressing it focuses the trigger, like a
 * native select's label.
 * @experimental
 */
@Directive({ selector: "[uiSelectLabel]", exportAs: "uiSelectLabel" })
class UiSelectLabel implements OnInit {
  readonly #part = injectPart(injectHandle(select), "label")
  /** The label's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The button that opens the list: a combobox named by the label. Typing on it
 * selects the item that matches. Left empty, put a `uiSelectValue` in it.
 * @experimental
 */
@Directive({
  selector: "[uiSelectTrigger]",
  exportAs: "uiSelectTrigger",
  host: { "(focusout)": "focusOut($event)" },
  providers: [
    {
      provide: SelectTarget,
      useFactory: () => inject(forwardRef(() => UiSelectTrigger)).target,
    },
  ],
})
class UiSelectTrigger implements OnInit {
  /** Stops the trigger from opening the list. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Connects a trigger outside the select to the one with this controller. */
  readonly controller = input<SelectController<any, any>>()
  readonly #root = inject(UiSelect, { optional: true })
  readonly #field = injectFieldControl()
  readonly #el = inject(ElementRef).nativeElement as HTMLElement
  readonly #part = injectConnectedPart(
    select,
    this.controller,
    "trigger",
    () => ({
      disabled: this.disabled(),
      named: !!this.#field || this.#el.hasAttribute("aria-labelledby"),
    }),
    {
      attrs: () => ({ type: "button" }),
      state: () =>
        ({
          open: false,
          disabled: !!this.disabled(),
          readOnly: false,
          required: false,
          placeholder: true,
        }) as never,
    },
    this.#field?.join
  )
  /** The select this trigger opens, once it's on the page. */
  readonly target = this.#part.target
  /** The trigger's state. */
  readonly state = this.#part.state

  protected focusOut(event: FocusEvent) {
    if (leaves(event) && !this.target()?.state().open) {
      this.#root?.touched()
    }
  }

  ngOnInit() {
    this.#part.init()
  }
}

// A value's state before its select is known.
const unselected: SelectValueState = {
  value: null,
  label: "",
  labels: [],
  placeholder: true,
}

/**
 * The selected item's label, or the placeholder. Left empty, it shows them.
 * @experimental
 */
@Directive({ selector: "[uiSelectValue]", exportAs: "uiSelectValue" })
class UiSelectValue implements OnInit {
  /** What it shows while nothing is selected, instead of the select's `placeholder`. */
  readonly placeholder = input<string>()
  /** How many labels it lists with `multiple` before it sums the rest up. */
  readonly maxLabels = input<number>()
  /** The text for the labels it leaves out, like `"+2 more"`. */
  readonly getMoreLabel = input<(count: number) => string>()
  readonly #nearest = inject(tokenOf(select), { optional: true })?.handle
  readonly #target =
    inject(SelectTarget, { optional: true }) ?? computed(() => this.#nearest)
  readonly #content = injectContentOwner()
  readonly #part = injectTargetPart(
    this.#target,
    "value",
    () => ({
      placeholder: this.placeholder(),
      maxLabels: this.maxLabels(),
      getMoreLabel: this.getMoreLabel(),
      text: this.#content.core(),
    }),
    { attrs: () => ({}), state: () => unselected }
  )
  /** The value's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#content.decide()
    this.#part.init()
  }
}

/**
 * The popup that holds the items, on the element it's written on:
 * `<div *uiSelectContent>`. A data select renders its items in it from
 * `let state`: `@for (item of state().items; …)`.
 * @experimental
 */
@Directive({ selector: "[uiSelectContent]" })
class UiSelectContent implements OnInit {
  /** Which side of the trigger it opens on: `*uiSelectContent="let state; side: 'top'"`. */
  readonly side = input<Side>(undefined, { alias: "uiSelectContentSide" })
  /** How it lines up with the trigger along that side. */
  readonly align = input<"start" | "center" | "end">(undefined, {
    alias: "uiSelectContentAlign",
  })
  /** Gap between the trigger and the list, in pixels. */
  readonly sideOffset = input<number>(undefined, {
    alias: "uiSelectContentSideOffset",
  })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input<number>(undefined, {
    alias: "uiSelectContentAlignOffset",
  })
  /** Space it keeps from the edges of the screen, in pixels. */
  readonly collisionPadding = input<number>(undefined, {
    alias: "uiSelectContentCollisionPadding",
  })
  /** Space the arrow keeps from the list's corners, in pixels. */
  readonly arrowPadding = input<number>(undefined, {
    alias: "uiSelectContentArrowPadding",
  })
  /** What it's positioned against instead of the trigger. */
  readonly anchor = input<Anchor | string | null>(undefined, {
    alias: "uiSelectContentAnchor",
  })
  /** Puts the selected item over the trigger, like a native select on macOS. */
  readonly alignItemWithTrigger = input<boolean | undefined, unknown>(
    undefined,
    { alias: "uiSelectContentAlignItemWithTrigger", transform: optionalBoolean }
  )
  /** Keeps the list in the page, hidden, while closed. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiSelectContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Where the list renders, instead of the root's `container`. */
  readonly container: InputSignal<SelectContentProps["container"]> = input<
    SelectContentProps["container"]
  >(undefined, { alias: "uiSelectContentContainer" })
  readonly #props = computed(() => ({
    side: this.side(),
    align: this.align(),
    sideOffset: this.sideOffset(),
    alignOffset: this.alignOffset(),
    collisionPadding: this.collisionPadding(),
    arrowPadding: this.arrowPadding(),
    anchor: this.anchor(),
    alignItemWithTrigger: this.alignItemWithTrigger(),
    keepMounted: this.keepMounted(),
  }))
  readonly #root = inject(UiSelect)
  readonly #part = injectPopupPart(
    injectHandle(select),
    "content",
    this.#props,
    {
      container: () => this.container() ?? this.#root.container(),
      viewport: "viewport",
    }
  )

  static ngTemplateContextGuard(
    _directive: UiSelectContent,
    _context: unknown
  ): _context is PresentPartContext<SelectContentState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The listbox, when the content holds more than items, like a `uiSelectInput`.
 * @experimental
 */
@Directive({ selector: "[uiSelectList]", exportAs: "uiSelectList" })
class UiSelectList implements OnInit {
  readonly #part = injectPart(injectHandle(select), "list")
  /** The list's state, with the `items` that match the search. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A search field inside the content that filters the list while focus stays
 * in it. Put the items in a `uiSelectList`, and name it with `aria-label`.
 * @experimental
 */
@Directive({ selector: "input[uiSelectInput]", exportAs: "uiSelectInput" })
class UiSelectInput implements OnInit {
  readonly #part = injectPart(injectHandle(select), "input")
  /** The search field's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shown while no item matches the search; its message is announced as it
 * appears. Its content shows only then.
 * @experimental
 */
@Directive({ selector: "[uiSelectEmpty]", exportAs: "uiSelectEmpty" })
class UiSelectEmpty implements OnInit {
  readonly #part = injectPart(injectHandle(select), "empty", () => ({
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
@Directive({ selector: "[uiSelectStatus]", exportAs: "uiSelectStatus" })
class UiSelectStatus implements OnInit {
  readonly #part = injectPart(injectHandle(select), "status")
  /** The status's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A group of items, named by its `uiSelectGroupLabel`, and hidden while none
 * of its items shows.
 * @experimental
 */
@Directive({ selector: "[uiSelectGroup]", exportAs: "uiSelectGroup" })
class UiSelectGroup implements OnInit {
  /** @internal The group's id, which its items and label name. */
  readonly id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(select), "group", () => ({
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
  selector: "[uiSelectGroupLabel]",
  exportAs: "uiSelectGroupLabel",
})
class UiSelectGroupLabel implements OnInit {
  readonly #group = inject(UiSelectGroup)
  readonly #part = injectPart(injectHandle(select), "group-label", () => ({
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
@Directive({ selector: "[uiSelectItem]", exportAs: "uiSelectItem" })
class UiSelectItem implements OnInit {
  /** The value it selects. */
  readonly value = input.required<unknown>()
  /** Its label, if its text isn't. */
  readonly label = input<string>()
  /** Stops it from being selected. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Its position among the data items, for screen readers while some aren't rendered. */
  readonly index = input<number>()
  readonly #virtualIndex = inject(VirtualIndex, { optional: true })
  readonly #group = inject(UiSelectGroup, { optional: true })
  readonly #part = injectPart(injectHandle(select), "item", () => ({
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
 * The item's text. Written empty, it shows the item's label with the part the
 * search matched in `<mark>`. With content of its own, the content is yours:
 * render `state().segments` to mark the match, and give the item a `label`.
 * @experimental
 */
@Directive({ selector: "[uiSelectItemText]", exportAs: "uiSelectItemText" })
class UiSelectItemText implements OnInit {
  readonly #item = inject(UiSelectItem)
  readonly #handle = injectHandle(select)
  readonly #content = injectContentOwner()
  // Its text is the item's label as core knows it, which typeahead and the
  // trigger show too: its `label`, or its text. It follows core's changes.
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
  /** The text's state, with the search's match. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#content.decide()
    this.#part.init()
  }
}

/**
 * The check inside a selected item, on the element it's written on:
 * `<span *uiSelectItemIndicator>`. Rendered while its item is selected, or
 * always with `keepMounted`.
 * @experimental
 */
@Directive({ selector: "[uiSelectItemIndicator]" })
class UiSelectItemIndicator implements OnInit {
  /** Keeps it in the page while unselected: `*uiSelectItemIndicator="let state; keepMounted: true"`. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiSelectItemIndicatorKeepMounted",
    transform: optionalBoolean,
  })
  readonly #item = inject(UiSelectItem)
  readonly #id = inject(UiIds).next()
  readonly #part = injectPresentPart(
    injectHandle(select),
    "item-indicator",
    computed(() => ({
      item: this.#item.value() as string,
      keepMounted: this.keepMounted(),
      id: this.#id,
    }))
  )

  static ngTemplateContextGuard(
    _directive: UiSelectItemIndicator,
    _context: unknown
  ): _context is PresentPartContext<SelectItemIndicatorState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An option that selects every item that matches, with `multiple`: in its
 * group inside a `uiSelectGroup`, or in the whole list.
 * @experimental
 */
@Directive({ selector: "[uiSelectSelectAll]", exportAs: "uiSelectSelectAll" })
class UiSelectSelectAll implements OnInit {
  readonly #group = inject(UiSelectGroup, { optional: true })
  readonly #handle = injectHandle(select)
  readonly #part = injectPart(this.#handle, "select-all", () => ({
    id: selectAllKey(this.#group?.id),
  }))
  /** The option's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#handle.instance.use(selectSelectAll)
    this.#part.init()
  }
}

/**
 * An icon inside an item. A `uiSelectValueIcon` shows the selected item's in
 * the trigger. Screen readers, typeahead and filtering skip it, and `mirror`
 * flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiSelectItemIcon]", exportAs: "uiSelectItemIcon" })
class UiSelectItemIcon implements OnInit {
  /** Flips it in right-to-left text, for icons that point a way. */
  readonly mirror = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #item = inject(UiSelectItem)
  readonly #id = inject(UiIds).next()
  readonly #handle = injectHandle(select)
  readonly #part = injectPart(this.#handle, "item-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
    item: this.#item.value() as string,
  }))
  /** The icon's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#handle.instance.use(selectItemIcons)
    this.#part.init()
  }
}

/**
 * The selected item's icon, copied from its `uiSelectItemIcon`, like before
 * the value in the trigger. Write it empty: its content is the copy core writes.
 * @experimental
 */
@Directive({ selector: "[uiSelectValueIcon]", exportAs: "uiSelectValueIcon" })
class UiSelectValueIcon implements OnInit {
  readonly #nearest = inject(tokenOf(select), { optional: true })?.handle
  readonly #target =
    inject(SelectTarget, { optional: true }) ?? computed(() => this.#nearest)
  readonly #part = injectTargetPart(this.#target, "value-icon", () => ({}), {
    attrs: () => ({}),
    state: () => ({}) as never,
  })

  ngOnInit() {
    this.#target()?.instance.use(selectItemIcons)
    this.#part.init()
  }
}

/**
 * A line between items or groups, hidden from screen readers.
 * @experimental
 */
@Directive({ selector: "[uiSelectSeparator]", exportAs: "uiSelectSeparator" })
class UiSelectSeparator implements OnInit {
  readonly #part = injectPart(injectHandle(select), "separator")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A button that selects nothing, on the element it's written on:
 * `<button *uiSelectClear>`. Rendered while something is selected, or always
 * with `keepMounted`.
 * @experimental
 */
@Directive({ selector: "[uiSelectClear]" })
class UiSelectClear implements OnInit {
  /** Keeps it in the page while nothing is selected. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiSelectClearKeepMounted",
    transform: optionalBoolean,
  })
  readonly #part = injectPresentPart(
    injectHandle(select),
    "clear",
    computed(() => ({ keepMounted: this.keepMounted() }))
  )

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An arrow on the popup's edge that points at the trigger.
 * @experimental
 */
@Directive({ selector: "[uiSelectArrow]", exportAs: "uiSelectArrow" })
class UiSelectArrow implements OnInit {
  readonly #part = injectPart(injectHandle(select), "arrow")
  /** The arrow's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * select's `value`. Signal Forms' `formField` needs nothing more.
 * @experimental
 */
@Directive({
  selector:
    "[uiSelect][ngModel], [uiSelect][formControl], [uiSelect][formControlName]",
  providers: [provideValueAccessor(() => UiSelectValueAccessor)],
})
class UiSelectValueAccessor extends UiValueAccessor<unknown> {
  protected fromForm(value: unknown) {
    return value ?? null
  }
}

export { createSelectController } from "@ui-sdk/core/select"
export type {
  ListAnnouncement,
  ListData,
  ListFilter,
  ListGroup,
  ListHighlightDetails,
  ListItem,
  ListSeparator,
  MatchSegment,
  SelectApi,
  SelectArrowState,
  SelectChangeOptions,
  SelectClearProps,
  SelectClearState,
  SelectContentProps,
  SelectContentState,
  SelectController,
  SelectDismissReason,
  SelectEmptyState,
  SelectInputState,
  SelectItemIconProps,
  SelectItemIconState,
  SelectItemIndicatorProps,
  SelectItemIndicatorState,
  SelectItemProps,
  SelectItemState,
  SelectItemTextState,
  SelectOpenChangeReason,
  SelectOptions,
  SelectPrimitive,
  SelectQueryChangeReason,
  SelectSelectAllState,
  SelectStatusState,
  SelectTriggerProps,
  SelectTriggerState,
  SelectValue,
  SelectValueChangeReason,
  SelectValueProps,
  SelectValueState,
} from "@ui-sdk/core/select"

export {
  type SelectOpenChangeDetails,
  type SelectQueryChangeDetails,
  type SelectValueChangeDetails,
  UiSelect,
  UiSelectArrow,
  UiSelectClear,
  UiSelectContent,
  UiSelectEmpty,
  UiSelectGroup,
  UiSelectGroupLabel,
  UiSelectInput,
  UiSelectItem,
  UiSelectItemIcon,
  UiSelectItemIndicator,
  UiSelectItemText,
  UiSelectLabel,
  UiSelectList,
  UiSelectSelectAll,
  UiSelectSeparator,
  UiSelectStatus,
  UiSelectTrigger,
  UiSelectValue,
  UiSelectValueAccessor,
  UiSelectValueIcon,
}
