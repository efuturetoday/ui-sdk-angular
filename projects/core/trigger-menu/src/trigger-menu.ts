import {
  computed,
  Directive,
  forwardRef,
  inject,
  input,
  output,
  signal,
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
import type { ListHighlightDetails } from "@ui-sdk/core/listbox"
import {
  triggerMenu,
  type TextEditorAdapter,
  type TokenInsert,
  type TriggerDefinition,
  type TriggerMenuContentState,
  type TriggerMenuController,
  type TriggerMenuDismissReason,
  type TriggerMenuOpenChangeReason,
  type TriggerMenuPrimitive,
  type TriggerMenuQueryChangeReason,
  type TriggerMenuSelectDetails,
} from "@ui-sdk/core/trigger-menu"
import {
  optionalBoolean,
  injectPart,
  injectPopupPart,
  type PopupContainer,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
  type PresentPartContext,
  EditorToken,
  ListHighlight,
  VirtualIndex,
  TextSource,
  letCoreWrite,
} from "@ngx-ui-sdk/core"

/**
 * Why the menu opens or closes, and for which trigger.
 * @experimental
 */
type TriggerMenuOpenChangeDetails =
  ChangeDetails<TriggerMenuOpenChangeReason> & { trigger: string | null }

/**
 * Why the query changes, with its trigger.
 * @experimental
 */
type TriggerMenuQueryChangeDetails =
  ChangeDetails<TriggerMenuQueryChangeReason> & {
    trigger: string
    argument?: string
  }

/**
 * Suggestions that open as you type a trigger like `@` or `/` in a text
 * field. It renders no element of its own, so it goes on an `ng-container`
 * around its parts. Inside a `uiTokenInput` it suggests into its editor;
 * else into a `uiTriggerMenuInput`, or the `editor` given.
 * @experimental
 */
@Directive({
  selector: "[uiTriggerMenu]",
  exportAs: "uiTriggerMenu",
  providers: [
    provideRoot(triggerMenu, () => UiTriggerMenu),
    {
      provide: ListHighlight,
      useFactory: () => inject(forwardRef(() => UiTriggerMenu)).highlighted,
    },
  ],
})
class UiTriggerMenu {
  /** The triggers, like `@` for people, and the items each suggests. */
  readonly triggers = input.required<TriggerDefinition<any>[]>()
  /** The text editor it suggests into, if not the token input around it or its own input. */
  readonly editor = input<TextEditorAdapter>()
  /** Whether it's open. Bind it, or `[(open)]`, to control it. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The loading state of items that load as you type. */
  readonly status = input<AsyncOptionsStatus>()
  /** Whether the first match is highlighted as the query changes. */
  readonly autoHighlight = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the arrow keys wrap around. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** A keyboard shortcut that opens it, like `"mod+k"`. */
  readonly shortcut = input<string>()
  /** Opens it from anywhere. Create one with `createTriggerMenuController()`. */
  readonly controller = input<TriggerMenuController>()
  /** Whether Escape and outside presses may close it, `true` by default. */
  readonly dismissible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Renders the suggestions into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** Runs as an item is chosen. A returned Promise keeps the token it inserts pending, and can change it. */
  readonly onSelect =
    input<
      (
        value: any,
        details: TriggerMenuSelectDetails<any>
      ) => void | Promise<void | Partial<TokenInsert>>
    >()
  /** What a screen reader announces while a choice is pending. */
  readonly pendingAnnouncement = input<string>()
  /** Emits the new open state once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before it opens or closes. `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: TriggerMenuOpenChangeDetails
  }>()
  /** Emits once it has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when a dismissal is refused, like Escape on one that isn't `dismissible`. */
  readonly dismissAttempt =
    output<DismissAttemptDetails<TriggerMenuDismissReason>>()
  /** Emits as the query after the trigger changes. */
  readonly queryChange = output<{
    query: string
    details: TriggerMenuQueryChangeDetails
  }>()
  readonly #highlighted = signal(-1)
  /** @internal The highlighted item's index, which `*uiVirtualFor` scrolls into view. */
  readonly highlighted = this.#highlighted.asReadonly()
  readonly #inherited = inject(EditorToken, { optional: true })
  readonly handle: PrimitiveHandle<TriggerMenuPrimitive> = injectPrimitive(
    triggerMenu,
    () => ({
      triggers: this.triggers(),
      editor: this.editor() ?? this.#inherited?.(),
      open: this.open(),
      status: this.status(),
      autoHighlight: this.autoHighlight(),
      loop: this.loop(),
      shortcut: this.shortcut(),
      controller: this.controller(),
      dismissible: this.dismissible(),
      debug: this.debug(),
      onSelect: this.onSelect(),
      pendingAnnouncement: this.pendingAnnouncement(),
      onOpenChange: (open: boolean, details: TriggerMenuOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
      onDismissAttempt: (
        details: DismissAttemptDetails<TriggerMenuDismissReason>
      ) => this.dismissAttempt.emit(details),
      onQueryChange: (query: string, details: TriggerMenuQueryChangeDetails) =>
        this.queryChange.emit({ query, details }),
      onHighlight: (_value: unknown, details: ListHighlightDetails) =>
        this.#highlighted.set(details.index),
    })
  )
  /** The menu's state. */
  readonly state: Signal<TypesOf<TriggerMenuPrimitive>["state"]> =
    this.handle.state
}

/**
 * A `<textarea>` or `<input>` it suggests into, when it isn't inside a token input.
 * @experimental
 */
@Directive({
  selector: "textarea[uiTriggerMenuInput], input[uiTriggerMenuInput]",
  exportAs: "uiTriggerMenuInput",
})
class UiTriggerMenuInput {
  readonly #part = injectPart(injectHandle(triggerMenu), "input")
  /** The input's state. */
  readonly state = this.#part.state
}

/**
 * The suggestions' popup, on the element it's written on:
 * `<div *uiTriggerMenuContent>`. Put a `uiTriggerMenuList` inside.
 * @experimental
 */
@Directive({ selector: "[uiTriggerMenuContent]" })
class UiTriggerMenuContent {
  /** Which side of the caret it opens on. */
  readonly side = input<Side>(undefined, {
    alias: "uiTriggerMenuContentSide",
  })
  /** How it lines up with the caret along that side. */
  readonly align = input<"start" | "center" | "end">(undefined, {
    alias: "uiTriggerMenuContentAlign",
  })
  /** Gap between the caret and the popup, in pixels. */
  readonly sideOffset = input<number>(undefined, {
    alias: "uiTriggerMenuContentSideOffset",
  })
  /** Shift along the caret, in pixels. */
  readonly alignOffset = input<number>(undefined, {
    alias: "uiTriggerMenuContentAlignOffset",
  })
  /** Space it keeps from the edges of the screen, in pixels. */
  readonly collisionPadding = input<number>(undefined, {
    alias: "uiTriggerMenuContentCollisionPadding",
  })
  /** Space an arrow keeps from the popup's corners, in pixels. */
  readonly arrowPadding = input<number>(undefined, {
    alias: "uiTriggerMenuContentArrowPadding",
  })
  /** What it's positioned against instead of the caret. */
  readonly anchor = input<Anchor | string | null>(undefined, {
    alias: "uiTriggerMenuContentAnchor",
  })
  /** Keeps it in the page, hidden, while closed. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiTriggerMenuContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Where it renders, instead of the menu's `container`. */
  readonly container = input<PopupContainer>(undefined, {
    alias: "uiTriggerMenuContentContainer",
  })
  readonly #root = inject(UiTriggerMenu)
  readonly #part = injectPopupPart(
    injectHandle(triggerMenu),
    "content",
    computed(() => ({
      side: this.side(),
      align: this.align(),
      sideOffset: this.sideOffset(),
      alignOffset: this.alignOffset(),
      collisionPadding: this.collisionPadding(),
      arrowPadding: this.arrowPadding(),
      anchor: this.anchor(),
      keepMounted: this.keepMounted(),
    })) as never,
    { container: () => this.container() ?? this.#root.container() }
  )

  static ngTemplateContextGuard(
    _directive: UiTriggerMenuContent,
    _context: unknown
  ): _context is PresentPartContext<TriggerMenuContentState> {
    return true
  }
}

/**
 * The listbox. Render its items from `state().items`.
 * @experimental
 */
@Directive({ selector: "[uiTriggerMenuList]", exportAs: "uiTriggerMenuList" })
class UiTriggerMenuList {
  readonly #part = injectPart(injectHandle(triggerMenu), "list")
  /** The list's state, with the matching `items`. */
  readonly state = this.#part.state
}

/**
 * A group of items, named by its `uiTriggerMenuGroupLabel`, and hidden while
 * none of its items matches.
 * @experimental
 */
@Directive({ selector: "[uiTriggerMenuGroup]", exportAs: "uiTriggerMenuGroup" })
class UiTriggerMenuGroup {
  /** @internal The group's id, which its items and label name. */
  readonly id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(triggerMenu), "group", () => ({
    id: this.id,
  }))
  /** The group's state. */
  readonly state = this.#part.state
}

/**
 * The group's heading, which names the group.
 * @experimental
 */
@Directive({
  selector: "[uiTriggerMenuGroupLabel]",
  exportAs: "uiTriggerMenuGroupLabel",
})
class UiTriggerMenuGroupLabel {
  readonly #group = inject(UiTriggerMenuGroup)
  readonly #part = injectPart(injectHandle(triggerMenu), "group-label", () => ({
    id: this.#group.id,
    group: this.#group.id,
  }))
  /** The label's state. */
  readonly state = this.#part.state
}

/**
 * A suggestion. Choosing it inserts it at the trigger.
 * @experimental
 */
@Directive({ selector: "[uiTriggerMenuItem]", exportAs: "uiTriggerMenuItem" })
class UiTriggerMenuItem {
  /** The value it inserts. */
  readonly value = input.required<unknown>()
  /** Its label, if its text isn't, for matching and the token. */
  readonly label = input<string>()
  /** More words the query matches it by. */
  readonly keywords = input<string[]>()
  /** Stops it from being chosen. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Runs when it's chosen, instead of the menu's `onSelect`. A returned Promise keeps its token pending, and can change it. */
  readonly onSelect =
    input<
      (
        value: unknown,
        details: TriggerMenuSelectDetails<unknown>
      ) => void | Promise<void | Partial<TokenInsert>>
    >()
  readonly #virtualIndex = inject(VirtualIndex, { optional: true })
  readonly #group = inject(UiTriggerMenuGroup, { optional: true })
  readonly #part = injectPart(injectHandle(triggerMenu), "item", () => ({
    value: this.value() as string,
    label: this.label(),
    keywords: this.keywords(),
    disabled: this.disabled(),
    onSelect: this.onSelect(),
    index: this.#virtualIndex ?? undefined,
    group: this.#group?.id,
  }))
  /** The item's state. */
  readonly state = this.#part.state
}

/**
 * An icon inside an item. Screen readers and matching skip it, and `mirror`
 * flips it in right-to-left text.
 * @experimental
 */
@Directive({
  selector: "[uiTriggerMenuItemIcon]",
  exportAs: "uiTriggerMenuItemIcon",
})
class UiTriggerMenuItemIcon {
  /** Flips it in right-to-left text, for icons that point a way. */
  readonly mirror = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #item = inject(UiTriggerMenuItem)
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(triggerMenu), "item-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
    item: this.#item.value() as string,
  }))
  /** The icon's state. */
  readonly state = this.#part.state
}

/**
 * A line between items or groups, hidden from screen readers.
 * @experimental
 */
@Directive({
  selector: "[uiTriggerMenuSeparator]",
  exportAs: "uiTriggerMenuSeparator",
})
class UiTriggerMenuSeparator {
  readonly #part = injectPart(injectHandle(triggerMenu), "separator")
}

/**
 * Shown while nothing matches. Its message is announced when it appears.
 * @experimental
 */
@Directive({ selector: "[uiTriggerMenuEmpty]", exportAs: "uiTriggerMenuEmpty" })
class UiTriggerMenuEmpty {
  readonly #part = injectPart(injectHandle(triggerMenu), "empty", () => ({
    stash: true,
  }))
  /** The empty message's state. */
  readonly state = this.#part.state
}

/**
 * A polite live region for loading and result counts. With `uiText`, core
 * writes its text; with content of its own, the content.
 * @experimental
 */
@Directive({
  providers: [{ provide: TextSource, useExisting: UiTriggerMenuStatus }],
  selector: "[uiTriggerMenuStatus]",
  exportAs: "uiTriggerMenuStatus",
})
class UiTriggerMenuStatus implements TextSource {
  readonly #coreWrites = signal(false)
  /** Has core write the part's text where `uiText` is. */
  readonly attach = letCoreWrite(this.#coreWrites)
  readonly #part = injectPart(injectHandle(triggerMenu), "status", () => ({
    text: this.#coreWrites(),
  }))
  /** The status's state. */
  readonly state = this.#part.state
}

/**
 * Tells how to use the menu while it's open, like "↑↓ to navigate". With
 * `uiText`, core writes its text; with content of its own, the content.
 * @experimental
 */
@Directive({
  providers: [{ provide: TextSource, useExisting: UiTriggerMenuHint }],
  selector: "[uiTriggerMenuHint]",
  exportAs: "uiTriggerMenuHint",
})
class UiTriggerMenuHint implements TextSource {
  readonly #coreWrites = signal(false)
  /** Has core write the part's text where `uiText` is. */
  readonly attach = letCoreWrite(this.#coreWrites)
  readonly #part = injectPart(injectHandle(triggerMenu), "hint", () => ({
    text: this.#coreWrites(),
  }))
  /** The hint's state. */
  readonly state = this.#part.state
}

export {
  createTriggerMenuController,
  textFieldAdapter,
} from "@ui-sdk/core/trigger-menu"
export type {
  EditorChange,
  EditorReplaceOptions,
  ListFilter,
  ListItem,
  ListSeparator,
  TextEditorAdapter,
  TextRange,
  TextRect,
  Token,
  TokenInsert,
  TriggerAfter,
  TriggerArgument,
  TriggerBoundary,
  TriggerDefinition,
  TriggerItemsLoader,
  TriggerMatch,
  TriggerMenuApi,
  TriggerMenuChangeOptions,
  TriggerMenuContentProps,
  TriggerMenuContentState,
  TriggerMenuController,
  TriggerMenuData,
  TriggerMenuDataGroup,
  TriggerMenuDataItem,
  TriggerMenuDismissReason,
  TriggerMenuEmptyState,
  TriggerMenuHintState,
  TriggerMenuInputState,
  TriggerMenuItemIconProps,
  TriggerMenuItemIconState,
  TriggerMenuItemProps,
  TriggerMenuItemState,
  TriggerMenuOpenChangeReason,
  TriggerMenuOptions,
  TriggerMenuPrimitive,
  TriggerMenuQueryChangeReason,
  TriggerMenuSelectDetails,
  TriggerMenuStatusState,
  TriggerRule,
} from "@ui-sdk/core/trigger-menu"

export {
  type TriggerMenuOpenChangeDetails,
  type TriggerMenuQueryChangeDetails,
  UiTriggerMenu,
  UiTriggerMenuContent,
  UiTriggerMenuEmpty,
  UiTriggerMenuGroup,
  UiTriggerMenuGroupLabel,
  UiTriggerMenuHint,
  UiTriggerMenuInput,
  UiTriggerMenuItem,
  UiTriggerMenuItemIcon,
  UiTriggerMenuList,
  UiTriggerMenuSeparator,
  UiTriggerMenuStatus,
}
