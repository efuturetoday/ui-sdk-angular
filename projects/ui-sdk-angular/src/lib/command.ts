import {
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  type OnInit,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import type { AsyncOptionsStatus } from "@ui-sdk/core/async-options"
import {
  command,
  type CommandActionDetails,
  type CommandController,
  type CommandData,
  type CommandPagesChangeReason,
  type CommandPrimitive,
  type CommandQueryChangeReason,
  type CommandValueChangeDetails,
  type ListAnnouncement,
  type SearchFilter,
} from "@ui-sdk/core/command"
import { injectContentOwner, injectDefaultText } from "./content"
import { optionalBoolean } from "./inputs"
import { injectPart } from "./part"
import {
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  UiIds,
} from "./primitive"
import { injectPresentPart } from "./structural"
import { ListHighlight, VirtualIndex } from "./virtual-for"

/**
 * Why the search query changes.
 * @experimental
 */
type CommandQueryChangeDetails = ChangeDetails<CommandQueryChangeReason>

/**
 * Why the stack of pages changes.
 * @experimental
 */
type CommandPagesChangeDetails = ChangeDetails<CommandPagesChangeReason>

/**
 * A search field over an always-open list of commands, on the element it's
 * written on.
 * @experimental
 */
@Directive({
  selector: "[uiCommand]",
  exportAs: "uiCommand",
  providers: [
    provideRoot(command, () => UiCommand),
    {
      provide: ListHighlight,
      useFactory: () => inject(forwardRef(() => UiCommand)).highlighted,
    },
  ],
})
class UiCommand implements OnInit {
  /** The highlighted command's value. Bind it, or `[(value)]`, to control it. */
  readonly value = input<string | null>()
  /** The highlighted command at first, when uncontrolled. */
  readonly defaultValue = input<string | null>()
  /** The search query. Bind it, or `[(query)]`, to control it. */
  readonly query = input<string>()
  /** The search query at first, when uncontrolled. */
  readonly defaultQuery = input<string>()
  /** The stack of open pages, the top one last. Bind it, or `[(pages)]`, to control it. */
  readonly pages = input<string[]>()
  /** The stack of pages at first, when uncontrolled. */
  readonly defaultPages = input<string[]>()
  /** What a screen reader announces while an action is pending. */
  readonly pendingAnnouncement = input<string>()
  /** Runs a command with its value. A returned Promise keeps the command pending until it settles. */
  readonly onAction =
    input<(value: string, details: CommandActionDetails) => unknown>()
  /** The commands as data. Render them in the list yourself, from its `state().items`. */
  readonly items = input<CommandData>()
  /** The commands shown while the search is empty, like recent ones. */
  readonly emptyItems = input<CommandData>()
  /** How the search ranks the commands, or `false` to leave it to you. */
  readonly filter = input<SearchFilter<string>>()
  /** What a screen reader announces as the list changes. */
  readonly announcement =
    input<(change: ListAnnouncement) => string | null | undefined>()
  /** Whether the first match is highlighted as the query changes. */
  readonly autoHighlight = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the arrow keys wrap around. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The loading state of commands that load as you search. */
  readonly status = input<AsyncOptionsStatus>()
  /** Sets its query, pages and highlight from anywhere. Create one with `createCommandController()`. */
  readonly controller = input<CommandController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the highlighted command once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string | null>()
  /** Emits before the highlight changes. `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string | null
    details: CommandValueChangeDetails
  }>()
  /** Emits the new query once a change isn't canceled, for `[(query)]`. */
  readonly queryChange = output<string>()
  /** Emits before the query changes. `details.cancel()` stops it. */
  readonly beforeQueryChange = output<{
    query: string
    details: CommandQueryChangeDetails
  }>()
  /** Emits the new pages once a change isn't canceled, for `[(pages)]`. */
  readonly pagesChange = output<string[]>()
  /** Emits before the pages change. `details.cancel()` stops it. */
  readonly beforePagesChange = output<{
    pages: string[]
    details: CommandPagesChangeDetails
  }>()
  /** Emits when the list scrolls near its end, to load more commands. */
  readonly loadMore = output<void>()
  readonly #highlighted = signal(-1)
  /** @internal The highlighted command's index, which `*uiVirtualFor` scrolls into view. */
  readonly highlighted = this.#highlighted.asReadonly()
  readonly handle: PrimitiveHandle<CommandPrimitive> = injectPrimitive(
    command,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      query: this.query(),
      defaultQuery: this.defaultQuery(),
      pages: this.pages(),
      defaultPages: this.defaultPages(),
      pendingAnnouncement: this.pendingAnnouncement(),
      onAction: this.onAction(),
      items: this.items(),
      emptyItems: this.emptyItems(),
      filter: this.filter(),
      announcement: this.announcement(),
      autoHighlight: this.autoHighlight(),
      loop: this.loop(),
      status: this.status(),
      controller: this.controller(),
      debug: this.debug(),
      onValueChange: (
        value: string | null,
        details: CommandValueChangeDetails
      ) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.#highlighted.set(details.index)
          this.valueChange.emit(value)
        }
      },
      onQueryChange: (query: string, details: CommandQueryChangeDetails) => {
        this.beforeQueryChange.emit({ query, details })
        if (!details.canceled) {
          this.queryChange.emit(query)
        }
      },
      onPagesChange: (pages: string[], details: CommandPagesChangeDetails) => {
        this.beforePagesChange.emit({ pages, details })
        if (!details.canceled) {
          this.pagesChange.emit(pages)
        }
      },
      onLoadMore: () => this.loadMore.emit(),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The command's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The search field, on an `<input>`. It keeps focus while arrow keys move the
 * highlight. Name it with `aria-label`.
 * @experimental
 */
@Directive({ selector: "input[uiCommandInput]", exportAs: "uiCommandInput" })
class UiCommandInput implements OnInit {
  readonly #part = injectPart(injectHandle(command), "input")
  /** The input's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The listbox. Render the commands in it, or from its `state().items` for
 * data commands, ranked as the user types.
 * @experimental
 */
@Directive({ selector: "[uiCommandList]", exportAs: "uiCommandList" })
class UiCommandList implements OnInit {
  readonly #part = injectPart(injectHandle(command), "list")
  /** The list's state, with the ranked `items` for data commands. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Commands shown while this page is on top, on an `ng-container` or element:
 * `<ng-container *uiCommandPage="'theme'">`. Without a value, it's the first page.
 * @experimental
 */
@Directive({ selector: "[uiCommandPage]" })
class UiCommandPage implements OnInit {
  /** The page's value, which `pages` names while it's open. */
  readonly value = input<string | undefined, string | "">(undefined, {
    alias: "uiCommandPage",
    transform: (value: string | "") => value || undefined,
  })
  readonly #part = injectPresentPart(
    injectHandle(command),
    "page",
    () => ({ value: this.value() }),
    undefined,
    { bare: true }
  )

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A group of commands, named by its `uiCommandGroupLabel`. It hides while
 * none of its commands matches the search.
 * @experimental
 */
@Directive({ selector: "[uiCommandGroup]", exportAs: "uiCommandGroup" })
class UiCommandGroup implements OnInit {
  /** @internal The group's id, which its commands and label name. */
  readonly id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(command), "group", () => ({
    id: this.id,
  }))
  /** The group's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A group's heading, which names it.
 * @experimental
 */
@Directive({
  selector: "[uiCommandGroupLabel]",
  exportAs: "uiCommandGroupLabel",
})
class UiCommandGroupLabel implements OnInit {
  readonly #group = inject(UiCommandGroup)
  readonly #part = injectPart(injectHandle(command), "group-label", () => ({
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
 * A command. Pressing it, or Enter while it's highlighted, runs it, with its
 * `value` passed to the command's `onAction`.
 * @experimental
 */
@Directive({ selector: "[uiCommandItem]", exportAs: "uiCommandItem" })
class UiCommandItem implements OnInit {
  /** The value `onAction` gets. Without one, it has an id of its own. */
  readonly value = input<string>()
  /** Its label, if its text isn't, for the search and screen readers. */
  readonly label = input<string>()
  /** More words the search matches it by. */
  readonly keywords = input<string[]>()
  /** Stops it from running. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** A keyboard shortcut that runs it, like `"mod+k"`, shown by its `uiCommandShortcut`. */
  readonly shortcut = input<string>()
  /** The page it opens instead of running. */
  readonly page = input<string>()
  /** Its position among the data commands, for screen readers while some aren't rendered. */
  readonly index = input<number>()
  /** Runs when it's chosen, before the command's `onAction`. A returned Promise keeps it pending. */
  readonly onSelect = input<(event: Event) => unknown>()
  readonly #id = inject(UiIds).next()
  readonly #virtualIndex = inject(VirtualIndex, { optional: true })
  readonly #group = inject(UiCommandGroup, { optional: true })
  readonly #page = inject(UiCommandPage, { optional: true })
  /** @internal The command's key: its value, or its own id. */
  readonly key = () => this.value() ?? this.#id
  readonly #part = injectPart(injectHandle(command), "item", () => ({
    id: this.key(),
    value: this.key(),
    label: this.label(),
    keywords: this.keywords(),
    disabled: this.disabled(),
    shortcut: this.shortcut(),
    page: this.page(),
    index: this.index() ?? this.#virtualIndex ?? undefined,
    onSelect: this.onSelect(),
    group: this.#group?.id,
    inPage: this.#page ? (this.#page.value() ?? null) : undefined,
    data: false,
  }))
  /** The command's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The command's text. Written empty, it shows its label with the part the
 * search matched in `<mark>`. With content of its own, the content is yours.
 * @experimental
 */
@Directive({ selector: "[uiCommandItemText]", exportAs: "uiCommandItemText" })
class UiCommandItemText implements OnInit {
  readonly #item = inject(UiCommandItem)
  readonly #el = inject(ElementRef).nativeElement as HTMLElement
  readonly #content = injectContentOwner()
  // Its text is the command's label, or its own text, which the search reads.
  readonly #part = injectPart(injectHandle(command), "item-text", () => ({
    id: this.#item.key(),
    text:
      this.#item.label() ??
      (this.#content.core() ? this.#item.key() : this.#el.textContent.trim()),
    write: this.#content.core(),
  }))
  /** The text's state, with the search's match. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#content.decide()
    this.#part.init()
  }
}

/**
 * The keys of a command's shortcut, formatted for the platform. Written
 * empty, it shows its command's `shortcut`, or its own.
 * @experimental
 */
@Directive({ selector: "[uiCommandShortcut]", exportAs: "uiCommandShortcut" })
class UiCommandShortcut implements OnInit {
  /** The keys, if not its command's `shortcut`. */
  readonly shortcut = input<string>()
  readonly #item = inject(UiCommandItem, { optional: true })
  readonly #part = injectPart(injectHandle(command), "shortcut", () => ({
    shortcut: this.shortcut() ?? this.#item?.shortcut(),
  }))
  /** The shortcut's state, with its `text`. */
  readonly state = this.#part.state
  readonly #content = injectDefaultText(() => this.state().text)

  ngOnInit() {
    this.#content.decide()
    this.#part.init()
  }
}

/**
 * An icon inside a command. Screen readers and the search skip it, and
 * `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiCommandItemIcon]", exportAs: "uiCommandItemIcon" })
class UiCommandItemIcon implements OnInit {
  /** Flips it in right-to-left text, for icons that point a way. */
  readonly mirror = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #item = inject(UiCommandItem)
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(command), "item-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
    item: this.#item.key(),
  }))
  /** The icon's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A line between groups, hidden from screen readers. It hides while the list
 * is filtered.
 * @experimental
 */
@Directive({ selector: "[uiCommandSeparator]", exportAs: "uiCommandSeparator" })
class UiCommandSeparator implements OnInit {
  readonly #part = injectPart(injectHandle(command), "separator")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shown while no command matches. Its message is announced when it appears.
 * Place it outside the list.
 * @experimental
 */
@Directive({ selector: "[uiCommandEmpty]", exportAs: "uiCommandEmpty" })
class UiCommandEmpty implements OnInit {
  readonly #part = injectPart(injectHandle(command), "empty", () => ({
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
@Directive({ selector: "[uiCommandStatus]", exportAs: "uiCommandStatus" })
class UiCommandStatus implements OnInit {
  readonly #part = injectPart(injectHandle(command), "status")
  /** The status's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createCommandController } from "@ui-sdk/core/command"
export type {
  CommandActionDetails,
  CommandApi,
  CommandChangeOptions,
  CommandController,
  CommandData,
  CommandDataGroup,
  CommandDataItem,
  CommandEmptyState,
  CommandInputState,
  CommandItemIconProps,
  CommandItemIconState,
  CommandItemProps,
  CommandItemState,
  CommandItemTextState,
  CommandListState,
  CommandOptions,
  CommandPageProps,
  CommandPagesChangeReason,
  CommandPrimitive,
  CommandQueryChangeReason,
  CommandState,
  CommandShortcutProps,
  CommandShortcutState,
  CommandStatusState,
  CommandValueChangeDetails,
  CommandValueChangeReason,
  ListAnnouncement,
  ListFilter,
  ListSeparator,
  MatchSegment,
  SearchFilter,
} from "@ui-sdk/core/command"

export {
  type CommandPagesChangeDetails,
  type CommandQueryChangeDetails,
  UiCommand,
  UiCommandEmpty,
  UiCommandGroup,
  UiCommandGroupLabel,
  UiCommandInput,
  UiCommandItem,
  UiCommandItemIcon,
  UiCommandItemText,
  UiCommandList,
  UiCommandPage,
  UiCommandSeparator,
  UiCommandShortcut,
  UiCommandStatus,
}
