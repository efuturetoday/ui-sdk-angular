import {
  computed,
  contentChild,
  Directive,
  inject,
  input,
  output,
  type OnInit,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  tree,
  type ListHighlightDetails,
  type TreeActionDetails,
  type TreeAnnouncement,
  type TreeCheckStrategy,
  type TreeCheckedChangeReason,
  type TreeController,
  type TreeExpandedChangeReason,
  type TreeGroupState,
  type TreeItemData,
  type TreeMode,
  type TreePrimitive,
  type TreeValueChangeReason,
} from "@ui-sdk/core/tree"
import {
  optionalBoolean,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  injectPresentPart,
  type PresentPartContext,
} from "ngx-ui-sdk"

type Value = string | string[] | null

/**
 * Why the selection changes.
 * @experimental
 */
type TreeValueChangeDetails = ChangeDetails<TreeValueChangeReason>

/**
 * Why the expanded branches change.
 * @experimental
 */
type TreeExpandedChangeDetails = ChangeDetails<TreeExpandedChangeReason>

/**
 * Why the checked items change.
 * @experimental
 */
type TreeCheckedChangeDetails = ChangeDetails<TreeCheckedChangeReason>

/**
 * A tree of items to browse, select, check or run, on the element it's
 * written on. Render items as data from its `state()`, or compose them.
 * @experimental
 */
@Directive({
  selector: "[uiTree]",
  exportAs: "uiTree",
  providers: [provideRoot(tree, () => UiTree)],
})
class UiTree implements OnInit {
  /** The items as data, which `uiTreeItem`s render. */
  readonly items = input<TreeItemData[]>()
  /** Paths like `"src/app/main.ts"` that make the items. */
  readonly paths = input<string[]>()
  /** What pressing an item does: select it, or several, or run it. */
  readonly mode = input<TreeMode>()
  /** The selected item, or items. Bind it, or `[(value)]`, to control it. */
  readonly value = input<Value>()
  /** The selection at first, when uncontrolled. */
  readonly defaultValue = input<Value>()
  /** Whether moving through the items selects them, `"automatic"`, or only pressing does, `"manual"`. */
  readonly activation = input<"automatic" | "manual">()
  /** The expanded branches. Bind it, or `[(expanded)]`, to control it. */
  readonly expanded = input<string[]>()
  /** The expanded branches at first, when uncontrolled. */
  readonly defaultExpanded = input<string[]>()
  /** Whether pressing a branch expands it. */
  readonly expandOnPress = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether items have checkboxes. */
  readonly checkable = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The checked items. Bind it, or `[(checked)]`, to control it. */
  readonly checked = input<string[]>()
  /** The checked items at first, when uncontrolled. */
  readonly defaultChecked = input<string[]>()
  /** How checking a branch checks its children, and theirs it. */
  readonly checkStrategy = input<TreeCheckStrategy>()
  /** Runs an item with its value. A returned Promise keeps it pending until it settles. */
  readonly onAction =
    input<(value: string, details: TreeActionDetails) => unknown>()
  /** What a screen reader announces while an action is pending. */
  readonly pendingAnnouncement = input<string>()
  /** Loads a branch's children as it expands. */
  readonly loadChildren =
    input<
      (
        value: string,
        details: { signal: AbortSignal }
      ) => void | Promise<unknown>
    >()
  /** The current item, like the open page, marked with `aria-current`. */
  readonly current = input<string | null>()
  /** Stops it from changing. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps disabled items focusable. */
  readonly focusableWhenDisabled = input<boolean | undefined, unknown>(
    undefined,
    { transform: optionalBoolean }
  )
  /** Keeps collapsed groups in the page, hidden. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps collapsed groups in the page, findable by the browser's search, which expands them. */
  readonly hiddenUntilFound = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** What a screen reader announces as items change. */
  readonly announcement =
    input<(change: TreeAnnouncement) => string | null | undefined>()
  /** Expands, selects and checks items from anywhere. Create one with `createTreeController()`. */
  readonly controller = input<TreeController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the selection once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<Value>()
  /** Emits before the selection changes. `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: Value
    details: TreeValueChangeDetails
  }>()
  /** Emits the expanded branches once a change isn't canceled, for `[(expanded)]`. */
  readonly expandedChange = output<string[]>()
  /** Emits before branches expand or collapse. `details.cancel()` stops it. */
  readonly beforeExpandedChange = output<{
    expanded: string[]
    details: TreeExpandedChangeDetails
  }>()
  /** Emits the checked items once a change isn't canceled, for `[(checked)]`. */
  readonly checkedChange = output<string[]>()
  /** Emits before items are checked or unchecked. `details.cancel()` stops it. */
  readonly beforeCheckedChange = output<{
    checked: string[]
    details: TreeCheckedChangeDetails
  }>()
  /** Emits as an item is highlighted. */
  readonly highlight = output<{
    value: string
    details: ListHighlightDetails
  }>()
  readonly handle: PrimitiveHandle<TreePrimitive> = injectPrimitive(
    tree,
    () => ({
      items: this.items(),
      paths: this.paths(),
      mode: this.mode(),
      value: this.value(),
      defaultValue: this.defaultValue(),
      activation: this.activation(),
      expanded: this.expanded(),
      defaultExpanded: this.defaultExpanded(),
      expandOnPress: this.expandOnPress(),
      checkable: this.checkable(),
      checked: this.checked(),
      defaultChecked: this.defaultChecked(),
      checkStrategy: this.checkStrategy(),
      onAction: this.onAction(),
      pendingAnnouncement: this.pendingAnnouncement(),
      loadChildren: this.loadChildren(),
      current: this.current(),
      disabled: this.disabled(),
      focusableWhenDisabled: this.focusableWhenDisabled(),
      keepMounted: this.keepMounted(),
      hiddenUntilFound: this.hiddenUntilFound(),
      announcement: this.announcement(),
      controller: this.controller(),
      debug: this.debug(),
      onValueChange: (value: Value, details: TreeValueChangeDetails) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
      onExpandedChange: (
        expanded: string[],
        details: TreeExpandedChangeDetails
      ) => {
        this.beforeExpandedChange.emit({ expanded, details })
        if (!details.canceled) {
          this.expandedChange.emit(expanded)
        }
      },
      onCheckedChange: (
        checked: string[],
        details: TreeCheckedChangeDetails
      ) => {
        this.beforeCheckedChange.emit({ checked, details })
        if (!details.canceled) {
          this.checkedChange.emit(checked)
        }
      },
      onHighlight: (value: string, details: ListHighlightDetails) =>
        this.highlight.emit({ value, details }),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The tree's state. */
  readonly state = this.#part.state
  /** The items as data, from `items` or `paths`, to render. */
  readonly data = computed(() => {
    this.handle.version()
    return this.handle.api.internal.items()
  })

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * An item. With a `uiTreeGroup` inside, it's a branch.
 * @experimental
 */
@Directive({ selector: "[uiTreeItem]", exportAs: "uiTreeItem" })
class UiTreeItem implements OnInit {
  /** The item's value. */
  readonly value = input.required<string>()
  /** Whether it's a branch, which has children to expand. A `uiTreeGroup` inside makes it one. */
  readonly branch = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Stops it from being selected, checked or run. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Its label, if its text isn't, for typeahead and screen readers. */
  readonly label = input<string>()
  readonly #parent = inject(UiTreeItem, { optional: true, skipSelf: true })
  // A group inside makes it a branch.
  private readonly group = contentChild(UiTreeGroup)
  readonly #part = injectPart(injectHandle(tree), "item", () => ({
    value: this.value(),
    parent: this.#parent?.value() ?? null,
    branch: this.branch() ?? (this.group() ? true : undefined),
    disabled: this.disabled(),
    label: this.label(),
  }))
  /** The item's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The item's label, which takes presses. Make it a link with `href` for an
 * item that opens a page.
 * @experimental
 */
@Directive({ selector: "[uiTreeItemLabel]", exportAs: "uiTreeItemLabel" })
class UiTreeItemLabel implements OnInit {
  readonly #item = inject(UiTreeItem)
  readonly #part = injectPart(injectHandle(tree), "label", () => ({
    value: this.#item.value(),
  }))
  /** The item's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shows whether a branch is expanded, like a chevron. Pressing it toggles the branch.
 * @experimental
 */
@Directive({
  selector: "[uiTreeItemIndicator]",
  exportAs: "uiTreeItemIndicator",
})
class UiTreeItemIndicator implements OnInit {
  readonly #item = inject(UiTreeItem)
  readonly #part = injectPart(injectHandle(tree), "indicator", () => ({
    value: this.#item.value(),
  }))
  /** The item's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The item's checkbox, in a `checkable` tree.
 * @experimental
 */
@Directive({ selector: "[uiTreeItemCheckbox]", exportAs: "uiTreeItemCheckbox" })
class UiTreeItemCheckbox implements OnInit {
  readonly #item = inject(UiTreeItem)
  readonly #part = injectPart(injectHandle(tree), "checkbox", () => ({
    value: this.#item.value(),
  }))
  /** The item's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A branch's children, on the element it's written on: `<div *uiTreeGroup>`.
 * Rendered while its branch is expanded, or always with the tree's
 * `keepMounted`.
 * @experimental
 */
@Directive({ selector: "[uiTreeGroup]" })
class UiTreeGroup implements OnInit {
  /** Keeps it in the page while collapsed: `*uiTreeGroup="let state; keepMounted: true"`. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiTreeGroupKeepMounted",
    transform: optionalBoolean,
  })
  /** Keeps it in the page while collapsed, findable by the browser's search. */
  readonly hiddenUntilFound = input<boolean | undefined, unknown>(undefined, {
    alias: "uiTreeGroupHiddenUntilFound",
    transform: optionalBoolean,
  })
  readonly #item = inject(UiTreeItem)
  readonly #part = injectPresentPart(injectHandle(tree), "group", () => ({
    value: this.#item.value(),
    keepMounted: this.keepMounted(),
    hiddenUntilFound: this.hiddenUntilFound(),
  }))

  static ngTemplateContextGuard(
    _directive: UiTreeGroup,
    _context: unknown
  ): _context is PresentPartContext<TreeGroupState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

export {
  createTreeController,
  treeFromPaths,
  visibleTreeRows,
} from "@ui-sdk/core/tree"
export type {
  ListHighlightDetails,
  TreeActionDetails,
  TreeAnnouncement,
  TreeApi,
  TreeChangeOptions,
  TreeCheckedChangeReason,
  TreeCheckedState,
  TreeCheckStrategy,
  TreeCollection,
  TreeCollectionNode,
  TreeController,
  TreeExpandedChangeReason,
  TreeGroupProps,
  TreeGroupState,
  TreeItemData,
  TreeItemPartProps,
  TreeItemProps,
  TreeItemState,
  TreeMode,
  TreeOptions,
  TreePrimitive,
  TreeRow,
  TreeState,
  TreeValue,
  TreeValueChangeReason,
} from "@ui-sdk/core/tree"

export {
  type TreeCheckedChangeDetails,
  type TreeExpandedChangeDetails,
  type TreeValueChangeDetails,
  UiTree,
  UiTreeGroup,
  UiTreeItem,
  UiTreeItemCheckbox,
  UiTreeItemIndicator,
  UiTreeItemLabel,
}
