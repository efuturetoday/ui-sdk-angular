import {
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
  autocomplete,
  type AutocompleteContentProps,
  type AutocompleteContentState,
  type AutocompleteController,
  type AutocompleteDismissReason,
  type AutocompleteOpenChangeReason,
  type AutocompletePrimitive,
  type AutocompleteSubmitDetails,
  type AutocompleteValueChangeReason,
  type ListAnnouncement,
  type ListData,
  type ListHighlightDetails,
  type SearchFilter,
} from "@ui-sdk/core/autocomplete"
import {
  ɵinjectContentOwner as injectContentOwner,
  ɵFieldContextToken as FieldContextToken,
  injectFieldControl,
  injectFormValue,
  ɵleaves as leaves,
  provideValueAccessor,
  UiValueAccessor,
  optionalBoolean,
  ListHighlight,
  VirtualIndex,
  injectPart,
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
 * Why the autocomplete's text changes.
 * @experimental
 */
type AutocompleteValueChangeDetails =
  ChangeDetails<AutocompleteValueChangeReason>

/**
 * Why the autocomplete's suggestions open or close.
 * @experimental
 */
type AutocompleteOpenChangeDetails = ChangeDetails<AutocompleteOpenChangeReason>

/**
 * A text input that suggests completions in a popup; its value is the text.
 * It renders no element of its own, so it goes on an `ng-container` around
 * its parts.
 * @experimental
 */
@Directive({
  selector: "[uiAutocomplete]",
  exportAs: "uiAutocomplete",
  providers: [
    provideRoot(autocomplete, () => UiAutocomplete),
    {
      provide: ListHighlight,
      useFactory: () => inject(forwardRef(() => UiAutocomplete)).highlighted,
    },
  ],
})
class UiAutocomplete implements OnInit {
  /** The text. Bind it, or `[(value)]`, to control it. */
  readonly value = input<string>()
  /** The text at first, when uncontrolled. */
  readonly defaultValue = input<string>()
  /** Whether the suggestions are open. Bind it, or `[(open)]`, to control it. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the suggestions are open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The suggestions as data. Render them in the list yourself, from its `state().items`. */
  readonly items = input<ListData<string>>()
  /** The suggestions shown while the text is empty, like recent ones. */
  readonly emptyItems = input<ListData<string>>()
  /** What a screen reader announces as the list changes. */
  readonly announcement =
    input<(change: ListAnnouncement) => string | null | undefined>()
  /** How the text filters the suggestions, or `false` to leave filtering to you. */
  readonly filter = input<SearchFilter<string>>()
  /** Completes the text inline with the highlighted suggestion. */
  readonly inlineComplete = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the first match is highlighted as the user types. */
  readonly autoHighlight = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether focusing the input opens the suggestions. */
  readonly openOnFocus = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether choosing a suggestion submits, like a search. */
  readonly submitOnSelect = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The loading state of suggestions that load as you type. */
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
  /** Shows the text without letting it change. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** `readOnly` under its HTML name, which Signal Forms sets. */
  readonly readonly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a form needs text. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name the text submits under in a native form. */
  readonly name = input<string>()
  /** The id of the form it belongs to, if it isn't inside it. */
  readonly form = input<string>()
  /** Opens it and sets its text from anywhere. Create one with `createAutocompleteController()`. */
  readonly controller = input<AutocompleteController>()
  /** Whether Escape and outside presses may close it, `true` by default. */
  readonly dismissible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Logs why it opens and closes to the console. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Renders the suggestions into this element instead of in place. */
  readonly container = input<Element | DocumentFragment | null>()
  /** Emits the new text once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string>()
  /** Emits before the text changes. `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string
    details: AutocompleteValueChangeDetails
  }>()
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the suggestions open or close. `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: AutocompleteOpenChangeDetails
  }>()
  /** Emits once the suggestions have finished opening or closing. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when a dismissal is refused. */
  readonly dismissAttempt =
    output<DismissAttemptDetails<AutocompleteDismissReason>>()
  /** Emits when the text is submitted, by Enter or by choosing with `submitOnSelect`; named apart from the form's native `submit`. */
  readonly valueSubmit = output<{
    value: string
    details: AutocompleteSubmitDetails
  }>()
  /** Emits as a suggestion is highlighted. */
  readonly highlight = output<{
    value: string | null
    details: ListHighlightDetails
  }>()
  readonly #highlighted = signal(-1)
  /** @internal The highlighted item's index, which `uiVirtualRows` scrolls into view. */
  readonly highlighted = this.#highlighted.asReadonly()
  /** Emits when the list scrolls near its end, to load more suggestions. */
  readonly loadMore = output<void>()
  /** Emits when focus leaves the input while closed, which marks it touched in Signal Forms. */
  readonly touch = output<void>()
  readonly #form = injectFormValue<string>()
  readonly #field = inject(FieldContextToken, { optional: true })
  /** @internal The input, which moves into a sheet's header. */
  readonly inputElement = signal<HTMLElement | undefined>(undefined)
  readonly handle: PrimitiveHandle<AutocompletePrimitive> = injectPrimitive(
    autocomplete,
    () => ({
      value: this.value() ?? this.#form?.value(),
      defaultValue: this.defaultValue(),
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      items: this.items(),
      emptyItems: this.emptyItems(),
      announcement: this.announcement(),
      filter: this.filter(),
      inlineComplete: this.inlineComplete(),
      autoHighlight: this.autoHighlight(),
      openOnFocus: this.openOnFocus(),
      submitOnSelect: this.submitOnSelect(),
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
      debug: this.debug(),
      onValueChange: (
        value: string,
        details: AutocompleteValueChangeDetails
      ) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
          this.#form?.change(value)
        }
      },
      onOpenChange: (open: boolean, details: AutocompleteOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
      onDismissAttempt: (
        details: DismissAttemptDetails<AutocompleteDismissReason>
      ) => this.dismissAttempt.emit(details),
      onSubmit: (value: string, details: AutocompleteSubmitDetails) =>
        this.valueSubmit.emit({ value, details }),
      onHighlight: (value: string | null, details: ListHighlightDetails) => {
        this.#highlighted.set(details.index)
        this.highlight.emit({ value, details })
      },
      onLoadMore: () => this.loadMore.emit(),
    })
  )
  /** The autocomplete's state. */
  readonly state: Signal<TypesOf<AutocompletePrimitive>["state"]> =
    this.handle.state

  /** @internal Called by the input as focus leaves it. */
  touched() {
    this.touch.emit()
    this.#form?.touch()
  }

  ngOnInit() {
    this.handle.init()
  }
}

/**
 * A visible label for the input.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteLabel]",
  exportAs: "uiAutocompleteLabel",
})
class UiAutocompleteLabel implements OnInit {
  readonly #part = injectPart(injectHandle(autocomplete), "label")
  /** The label's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The text input the suggestions complete. Presented as a sheet, it moves
 * into the sheet's header while open.
 * @experimental
 */
@Directive({
  selector: "input[uiAutocompleteInput]",
  exportAs: "uiAutocompleteInput",
  host: { "(focusout)": "focusOut($event)" },
})
class UiAutocompleteInput implements OnInit {
  readonly #root = inject(UiAutocomplete)
  readonly #field = injectFieldControl()
  readonly #part = injectPart(
    injectHandle(autocomplete),
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
 * A button that opens the suggestions.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteTrigger]",
  exportAs: "uiAutocompleteTrigger",
})
class UiAutocompleteTrigger implements OnInit {
  readonly #part = injectPart(injectHandle(autocomplete), "trigger")
  /** The trigger's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A button that empties the input, on the element it's written on:
 * `<button *uiAutocompleteClear>`. Rendered while there's text, or always with
 * `keepMounted`.
 * @experimental
 */
@Directive({ selector: "[uiAutocompleteClear]" })
class UiAutocompleteClear implements OnInit {
  /** Keeps it in the page while there's no text. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiAutocompleteClearKeepMounted",
    transform: optionalBoolean,
  })
  readonly #part = injectPresentPart(
    injectHandle(autocomplete),
    "clear",
    computed(() => ({ keepMounted: this.keepMounted() }))
  )

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The popup that holds the suggestions, on the element it's written on:
 * `<div *uiAutocompleteContent>`.
 * @experimental
 */
@Directive({ selector: "[uiAutocompleteContent]" })
class UiAutocompleteContent implements OnInit {
  /** Which side of the input it opens on: `*uiAutocompleteContent="let state; side: 'top'"`. */
  readonly side = input<Side>(undefined, { alias: "uiAutocompleteContentSide" })
  /** How it lines up with the input along that side. */
  readonly align = input<"start" | "center" | "end">(undefined, {
    alias: "uiAutocompleteContentAlign",
  })
  /** Gap between the input and the suggestions, in pixels. */
  readonly sideOffset = input<number>(undefined, {
    alias: "uiAutocompleteContentSideOffset",
  })
  /** Shift along the input, in pixels. */
  readonly alignOffset = input<number>(undefined, {
    alias: "uiAutocompleteContentAlignOffset",
  })
  /** Space it keeps from the edges of the screen, in pixels. */
  readonly collisionPadding = input<number>(undefined, {
    alias: "uiAutocompleteContentCollisionPadding",
  })
  /** Space the arrow keeps from the popup's corners, in pixels. */
  readonly arrowPadding = input<number>(undefined, {
    alias: "uiAutocompleteContentArrowPadding",
  })
  /** What it's positioned against instead of the input. */
  readonly anchor = input<Anchor | string | null>(undefined, {
    alias: "uiAutocompleteContentAnchor",
  })
  /** Keeps the suggestions in the page, hidden, while closed. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiAutocompleteContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Where the suggestions render, instead of the root's `container`. */
  readonly container: InputSignal<AutocompleteContentProps["container"]> =
    input<AutocompleteContentProps["container"]>(undefined, {
      alias: "uiAutocompleteContentContainer",
    })
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
  readonly #root = inject(UiAutocomplete)
  readonly #part = injectPopupPart(
    injectHandle(autocomplete),
    "content",
    this.#props,
    {
      container: () => this.container() ?? this.#root.container(),
      viewport: "viewport",
      header: { slot: "header", input: () => this.#root.inputElement() },
    }
  )

  static ngTemplateContextGuard(
    _directive: UiAutocompleteContent,
    _context: unknown
  ): _context is PresentPartContext<AutocompleteContentState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The listbox. A data autocomplete renders its matching suggestions in it from
 * `state().items`.
 * @experimental
 */
@Directive({ selector: "[uiAutocompleteList]", exportAs: "uiAutocompleteList" })
class UiAutocompleteList implements OnInit {
  readonly #part = injectPart(injectHandle(autocomplete), "list")
  /** The list's state, with the `items` that match. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A group of suggestions, named by its `uiAutocompleteGroupLabel`, and hidden
 * while none of its suggestions shows.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteGroup]",
  exportAs: "uiAutocompleteGroup",
})
class UiAutocompleteGroup implements OnInit {
  /** @internal The group's id, which its suggestions and label name. */
  readonly id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(autocomplete), "group", () => ({
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
  selector: "[uiAutocompleteGroupLabel]",
  exportAs: "uiAutocompleteGroupLabel",
})
class UiAutocompleteGroupLabel implements OnInit {
  readonly #group = inject(UiAutocompleteGroup)
  readonly #part = injectPart(
    injectHandle(autocomplete),
    "group-label",
    () => ({ id: this.#group.id, group: this.#group.id })
  )
  /** The label's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A suggestion. Choosing it fills the input with its label.
 * @experimental
 */
@Directive({ selector: "[uiAutocompleteItem]", exportAs: "uiAutocompleteItem" })
class UiAutocompleteItem implements OnInit {
  /** Identifies the suggestion; the input gets it when there's no `label`. */
  readonly value = input.required<string>()
  /** The text the input gets and filtering matches, when the content isn't plain text. */
  readonly label = input<string>()
  /** More words filtering matches. */
  readonly keywords = input<string[]>()
  /** Keeps it from being chosen. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Its position among the visible suggestions, for lists that render only some. */
  readonly index = input<number>()
  readonly #virtualIndex = inject(VirtualIndex, { optional: true })
  readonly #group = inject(UiAutocompleteGroup, { optional: true })
  readonly #part = injectPart(injectHandle(autocomplete), "item", () => ({
    value: this.value(),
    label: this.label(),
    keywords: this.keywords(),
    disabled: this.disabled(),
    index: this.index() ?? this.#virtualIndex ?? undefined,
    group: this.#group?.id,
  }))
  /** The suggestion's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The suggestion's text. Written empty, it shows its label with the part the
 * input's text matched in `<mark>`. With content of its own, the content is
 * yours: render `state().segments` to mark the match, and give the item a `label`.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteItemText]",
  exportAs: "uiAutocompleteItemText",
})
class UiAutocompleteItemText implements OnInit {
  readonly #item = inject(UiAutocompleteItem)
  readonly #handle = injectHandle(autocomplete)
  readonly #content = injectContentOwner()
  // Its text is the suggestion's label as core knows it: its `label`, or its text.
  readonly #part = injectPart(this.#handle, "item-text", () => {
    this.#handle.version()
    const value = this.#item.value()
    return {
      id: value,
      text:
        this.#item.label() ??
        this.#handle.api.internal.listbox.labelOf(value) ??
        value,
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
 * An icon inside a suggestion. Screen readers, typeahead and filtering skip
 * it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteItemIcon]",
  exportAs: "uiAutocompleteItemIcon",
})
class UiAutocompleteItemIcon implements OnInit {
  /** Flips it in right-to-left text, for icons that point a way. */
  readonly mirror = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #item = inject(UiAutocompleteItem)
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(autocomplete), "item-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
    item: this.#item.value(),
  }))
  /** The icon's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A line between suggestions or groups, hidden from screen readers.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteSeparator]",
  exportAs: "uiAutocompleteSeparator",
})
class UiAutocompleteSeparator implements OnInit {
  readonly #part = injectPart(injectHandle(autocomplete), "separator")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shown while no suggestion matches; its message is announced as it appears.
 * Its content shows only then.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteEmpty]",
  exportAs: "uiAutocompleteEmpty",
})
class UiAutocompleteEmpty implements OnInit {
  readonly #part = injectPart(injectHandle(autocomplete), "empty", () => ({
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
@Directive({
  selector: "[uiAutocompleteStatus]",
  exportAs: "uiAutocompleteStatus",
})
class UiAutocompleteStatus implements OnInit {
  readonly #part = injectPart(injectHandle(autocomplete), "status")
  /** The status's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An arrow on the popup's edge that points at the input.
 * @experimental
 */
@Directive({
  selector: "[uiAutocompleteArrow]",
  exportAs: "uiAutocompleteArrow",
})
class UiAutocompleteArrow implements OnInit {
  readonly #part = injectPart(injectHandle(autocomplete), "arrow")
  /** The arrow's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Lets `ngModel`, `formControl` and `formControlName` set and read the
 * autocomplete's text. Signal Forms' `formField` needs nothing more.
 * @experimental
 */
@Directive({
  selector:
    "[uiAutocomplete][ngModel], [uiAutocomplete][formControl], [uiAutocomplete][formControlName]",
  providers: [provideValueAccessor(() => UiAutocompleteValueAccessor)],
})
class UiAutocompleteValueAccessor extends UiValueAccessor<string> {
  protected fromForm(value: unknown) {
    return typeof value === "string" ? value : ""
  }
}

export { createAutocompleteController } from "@ui-sdk/core/autocomplete"
export type {
  AutocompleteApi,
  AutocompleteArrowState,
  AutocompleteChangeOptions,
  AutocompleteClearProps,
  AutocompleteClearState,
  AutocompleteContentProps,
  AutocompleteContentState,
  AutocompleteController,
  AutocompleteDismissReason,
  AutocompleteEmptyState,
  AutocompleteInputState,
  AutocompleteItemIconProps,
  AutocompleteItemIconState,
  AutocompleteItemProps,
  AutocompleteItemState,
  AutocompleteItemTextState,
  AutocompleteOpenChangeReason,
  AutocompleteOptions,
  AutocompletePrimitive,
  AutocompleteStatusState,
  AutocompleteSubmitDetails,
  AutocompleteTriggerState,
  AutocompleteValueChangeReason,
  ListAnnouncement,
  ListData,
  ListFilter,
  ListGroup,
  ListHighlightDetails,
  ListItem,
  ListSeparator,
  MatchSegment,
  SearchFilter,
} from "@ui-sdk/core/autocomplete"

export {
  type AutocompleteOpenChangeDetails,
  type AutocompleteValueChangeDetails,
  UiAutocomplete,
  UiAutocompleteArrow,
  UiAutocompleteClear,
  UiAutocompleteContent,
  UiAutocompleteEmpty,
  UiAutocompleteGroup,
  UiAutocompleteGroupLabel,
  UiAutocompleteInput,
  UiAutocompleteItem,
  UiAutocompleteItemIcon,
  UiAutocompleteItemText,
  UiAutocompleteLabel,
  UiAutocompleteList,
  UiAutocompleteSeparator,
  UiAutocompleteStatus,
  UiAutocompleteTrigger,
  UiAutocompleteValueAccessor,
}
