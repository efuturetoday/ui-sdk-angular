import {
  computed,
  Directive,
  forwardRef,
  inject,
  InjectionToken,
  input,
  output,
  type InputSignal,
  type OnInit,
  type Signal,
} from "@angular/core"
import {
  formatShortcut,
  type Anchor,
  type ChangeDetails,
  type DismissAttemptDetails,
  type Side,
  type TypesOf,
} from "@ui-sdk/core"
import {
  menu,
  type MenuActionDetails,
  type MenuCheckedChangeDetails,
  type MenuCheckedChangeReason,
  type MenuContentProps,
  type MenuContentState,
  type MenuController,
  type MenuData,
  type MenuDismissReason,
  type MenuItemIndicatorState,
  type MenuOpenChangeReason,
  type MenuPayloadChangeReason,
  type MenuPrimitive,
  type MenuValueChangeDetails,
  type MenuValueChangeReason,
} from "@ui-sdk/core/menu"
import {
  menuCheckable,
  menuContextTrigger,
  menuItemIcons,
} from "@ui-sdk/core/renderer"
import {
  ɵinjectDefaultText as injectDefaultText,
  MenubarToken,
  optionalBoolean,
  injectConnectedPart,
  injectPart,
  injectPopupPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
  ɵunboundTrigger as unboundTrigger,
  injectPresentPart,
  type PresentPartContext,
} from "@ngx-ui-sdk/core"

/**
 * Why a menu opens or closes.
 * @experimental
 */
type MenuOpenChangeDetails = ChangeDetails<MenuOpenChangeReason>

// The checkbox or radio item an indicator belongs to.
type CheckableItem = {
  item: "checkbox-item" | "radio-item"
  itemKey: Signal<string>
  group?: string
}
const CheckableItemToken = new InjectionToken<CheckableItem>("menu-item")

// The id of the group a label names: its radio group's name, or its group's id.
const MenuGroupToken = new InjectionToken<{ id: string }>("menu-group")

/**
 * A list of actions and options, opened from a button or a right-click. It
 * renders no element of its own, so it goes on an `ng-container` around its
 * trigger and content.
 * @experimental
 */
@Directive({
  selector: "[uiMenu]",
  exportAs: "uiMenu",
  providers: [
    provideRoot(menu, () => UiMenu),
    // A menu inside this one's content is no item of the menubar.
    { provide: MenubarToken, useValue: null },
  ],
})
class UiMenu implements OnInit {
  /** Whether the menu is open. Bind it, or `[(open)]`, to control it. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the menu is open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The items as data. Render them in the content yourself. */
  readonly items = input<MenuData>()
  /** Whether items' `shortcut`s press them while the menu is open. */
  readonly itemShortcuts = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the arrow keys wrap around. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** How long hovering a submenu's trigger waits before opening it, in milliseconds. */
  readonly delay = input<number>()
  /** How it presents: `"sheet"` slides up from the bottom, `"auto"` does that on small touch screens. */
  readonly presentation = input<"auto" | "popover" | "sheet">()
  /** Whether the page behind is inert while open. */
  readonly modal = input<boolean | "pointer">()
  /** Opens it from anywhere. Create one with `createMenuController()`. */
  readonly controller = input<MenuController<any>>()
  /** Whether Escape and outside presses may close it, `true` by default. */
  readonly dismissible = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** What a screen reader announces while an item's action is pending. */
  readonly pendingAnnouncement = input<string>()
  /** Logs why it opens and closes to the console. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Renders the menu into this element instead of in place. */
  readonly container = input<Element | DocumentFragment | null>()
  /** Runs with the value of the item chosen. A returned Promise keeps it pending until it settles. */
  readonly onAction =
    input<(value: string, details: MenuActionDetails) => unknown>()
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the menu opens or closes. `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: MenuOpenChangeDetails
  }>()
  /** Emits once the menu has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  /** Emits when a dismissal is refused. */
  readonly dismissAttempt = output<DismissAttemptDetails<MenuDismissReason>>()
  /** Emits when the payload a trigger or the controller passed changes. */
  readonly payloadChange = output<{
    payload: unknown
    details: ChangeDetails<MenuPayloadChangeReason>
  }>()
  /** Emits when any checkbox item in it checks or unchecks. */
  readonly checkedChange = output<{
    checked: boolean
    details: MenuCheckedChangeDetails
  }>()
  /** Emits when any radio group in it changes its value. */
  readonly valueChange = output<{
    value: string
    details: MenuValueChangeDetails
  }>()
  readonly #menubar = inject(MenubarToken, { optional: true, skipSelf: true })
  readonly handle: PrimitiveHandle<MenuPrimitive> = injectPrimitive(
    menu,
    () => ({
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      items: this.items(),
      itemShortcuts: this.itemShortcuts(),
      loop: this.loop(),
      delay: this.delay(),
      presentation: this.presentation(),
      modal: this.modal(),
      controller: this.controller(),
      dismissible: this.dismissible(),
      pendingAnnouncement: this.pendingAnnouncement(),
      debug: this.debug(),
      onAction: this.onAction(),
      menubar: this.#menubar ?? undefined,
      onOpenChange: (open: boolean, details: MenuOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
      onDismissAttempt: (details: DismissAttemptDetails<MenuDismissReason>) =>
        this.dismissAttempt.emit(details),
      onPayloadChange: (
        payload: unknown,
        details: ChangeDetails<MenuPayloadChangeReason>
      ) => this.payloadChange.emit({ payload, details }),
      onCheckedChange: (checked: boolean, details: MenuCheckedChangeDetails) =>
        this.checkedChange.emit({ checked, details }),
      onValueChange: (value: string, details: MenuValueChangeDetails) =>
        this.valueChange.emit({ value, details }),
    })
  )
  /** The menu's state. */
  readonly state: Signal<TypesOf<MenuPrimitive>["state"]> = this.handle.state

  ngOnInit() {
    this.handle.init()
  }
}

/**
 * A submenu, inside a menu's content. It renders no element of its own, so it
 * goes on an `ng-container` around its `uiMenuSubTrigger` and `uiMenuSubContent`.
 * @experimental
 */
@Directive({
  selector: "[uiMenuSub]",
  exportAs: "uiMenuSub",
  providers: [
    provideRoot(menu, () => UiMenuSub),
    { provide: MenubarToken, useValue: null },
  ],
})
class UiMenuSub implements OnInit {
  /** Whether the submenu is open. Bind it, or `[(open)]`, to control it. */
  readonly open = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether the submenu is open at first, when uncontrolled. */
  readonly defaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** How long hovering its trigger waits before opening it, in milliseconds. */
  readonly delay = input<number>()
  /** Whether the arrow keys wrap around. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Opens it from anywhere. */
  readonly controller = input<MenuController<any>>()
  /** Logs why it opens and closes to the console. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new value once a change isn't canceled, for `[(open)]`. */
  readonly openChange = output<boolean>()
  /** Emits before the submenu opens or closes. `details.cancel()` stops it. */
  readonly beforeOpenChange = output<{
    open: boolean
    details: MenuOpenChangeDetails
  }>()
  /** Emits once the submenu has finished opening or closing. */
  readonly openChangeComplete = output<boolean>()
  readonly #parent = inject(UiMenu, { skipSelf: true, optional: true })
  readonly #parentSub = inject(UiMenuSub, { skipSelf: true, optional: true })
  readonly handle: PrimitiveHandle<MenuPrimitive> = injectPrimitive(
    menu,
    () => ({
      open: this.open(),
      defaultOpen: this.defaultOpen(),
      delay: this.delay(),
      loop: this.loop(),
      controller: this.controller(),
      debug: this.debug(),
      parent: (this.#parentSub ?? this.#parent)?.handle.api,
      onOpenChange: (open: boolean, details: MenuOpenChangeDetails) => {
        this.beforeOpenChange.emit({ open, details })
        if (!details.canceled) {
          this.openChange.emit(open)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
    })
  )
  /** The submenu's state. */
  readonly state: Signal<TypesOf<MenuPrimitive>["state"]> = this.handle.state

  ngOnInit() {
    this.handle.init()
  }
}

/**
 * The button that opens the menu. A trigger outside the menu connects through
 * `controller`.
 * @experimental
 */
@Directive({ selector: "[uiMenuTrigger]", exportAs: "uiMenuTrigger" })
class UiMenuTrigger implements OnInit {
  /** What the menu gets as its payload when this trigger opens it. */
  readonly payload = input<unknown>()
  /** Stops the trigger from opening the menu. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps a disabled trigger focusable. */
  readonly focusableWhenDisabled = input<boolean | undefined, unknown>(
    undefined,
    { transform: optionalBoolean }
  )
  /** A keyboard shortcut that opens the menu, like `"mod+j"`. */
  readonly shortcut = input<string>()
  /** Connects a trigger outside the menu to the one with this controller. */
  readonly controller = input<MenuController<any>>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectConnectedPart(
    menu,
    this.controller,
    "trigger",
    () => ({
      id: this.#id,
      payload: this.payload(),
      disabled: this.disabled(),
      focusableWhenDisabled: this.focusableWhenDisabled(),
      shortcut: this.shortcut(),
    }),
    unboundTrigger(this.disabled, this.focusableWhenDisabled)
  )
  /** The menu this trigger opens, once it's on the page. */
  readonly target = this.#part.target
  /** The trigger's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An area that opens the menu at the pointer on a right-click or a long press,
 * and on Shift+F10.
 * @experimental
 */
@Directive({
  selector: "[uiMenuContextTrigger]",
  exportAs: "uiMenuContextTrigger",
})
class UiMenuContextTrigger implements OnInit {
  /** What the menu gets as its payload when this area opens it. */
  readonly payload = input<unknown>()
  /** Stops the area from opening the menu. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Connects an area outside the menu to the one with this controller. */
  readonly controller = input<MenuController<any>>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectConnectedPart(
    menu,
    this.controller,
    "context-trigger",
    () => ({
      id: this.#id,
      payload: this.payload(),
      disabled: this.disabled(),
    }),
    {
      attrs: () => ({}),
      state: () => ({ open: false, disabled: !!this.disabled() }),
    }
  )
  /** The menu this area opens, once it's on the page. */
  readonly target = this.#part.target
  /** The area's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.target()?.instance.use(menuContextTrigger)
    this.#part.init()
  }
}

/**
 * The popup that holds the items, on the element it's written on:
 * `<div *uiMenuContent>`. A submenu's renders inside its parent's popup.
 * @experimental
 */
@Directive({ selector: "[uiMenuContent], [uiMenuSubContent]" })
class UiMenuContent implements OnInit {
  /** Which side of the trigger it opens on: `*uiMenuContent="let state; side: 'top'"`. */
  readonly side = input<Side>(undefined, { alias: "uiMenuContentSide" })
  /** How it lines up with the trigger along that side. */
  readonly align = input<"start" | "center" | "end">(undefined, {
    alias: "uiMenuContentAlign",
  })
  /** Gap between the trigger and the menu, in pixels. */
  readonly sideOffset = input<number>(undefined, {
    alias: "uiMenuContentSideOffset",
  })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input<number>(undefined, {
    alias: "uiMenuContentAlignOffset",
  })
  /** Space it keeps from the edges of the screen, in pixels. */
  readonly collisionPadding = input<number>(undefined, {
    alias: "uiMenuContentCollisionPadding",
  })
  /** Space the arrow keeps from the menu's corners, in pixels. */
  readonly arrowPadding = input<number>(undefined, {
    alias: "uiMenuContentArrowPadding",
  })
  /** What it's positioned against instead of the trigger. */
  readonly anchor = input<Anchor | string | null>(undefined, {
    alias: "uiMenuContentAnchor",
  })
  /** Where focus goes when the menu closes while focus is inside it. */
  readonly finalFocus: InputSignal<MenuContentProps["finalFocus"]> = input<
    MenuContentProps["finalFocus"]
  >(undefined, { alias: "uiMenuContentFinalFocus" })
  /** Keeps the menu in the page, hidden, while closed. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiMenuContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Where the menu renders, instead of the root's `container`. Submenus stay in their parent's popup. */
  readonly container: InputSignal<MenuContentProps["container"]> = input<
    MenuContentProps["container"]
  >(undefined, { alias: "uiMenuContentContainer" })
  readonly #props = computed(() => ({
    side: this.side(),
    align: this.align(),
    sideOffset: this.sideOffset(),
    alignOffset: this.alignOffset(),
    collisionPadding: this.collisionPadding(),
    arrowPadding: this.arrowPadding(),
    anchor: this.anchor(),
    finalFocus: this.finalFocus(),
    keepMounted: this.keepMounted(),
  }))
  readonly #sub = inject(UiMenuSub, { optional: true })
  readonly #root = inject(UiMenu, { optional: true })
  readonly #part = injectPopupPart(
    injectHandle(menu),
    "content",
    this.#props,
    this.#sub
      ? {}
      : {
          container: () => this.container() ?? this.#root?.container(),
          viewport: "viewport",
        }
  )

  static ngTemplateContextGuard(
    _directive: UiMenuContent,
    _context: unknown
  ): _context is PresentPartContext<MenuContentState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An action. Pressing it runs `onSelect` and closes the menu, unless
 * `closeOnSelect` is false. Put a `uiMenuShortcut` in it to show its `shortcut`.
 * @experimental
 */
@Directive({ selector: "[uiMenuItem]", exportAs: "uiMenuItem" })
class UiMenuItem implements OnInit {
  /** Identifies the item in the menu's `onAction`. */
  readonly value = input<string>()
  /** Its label, if its text isn't. */
  readonly label = input<string>()
  /** Stops it from being chosen. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** A keyboard shortcut that presses it while the menu is open, like `"mod+s"`. */
  readonly shortcut = input<string>()
  /** Whether choosing it closes the menu, `true` by default. */
  readonly closeOnSelect = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Marks it as one that deletes or can't be undone. */
  readonly destructive = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Runs as it's chosen. A returned Promise keeps it pending until it settles. */
  readonly onSelect = input<(event: Event) => unknown>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(menu), "item", () => ({
    id: this.#id,
    value: this.value(),
    label: this.label(),
    disabled: this.disabled(),
    shortcut: this.shortcut(),
    closeOnSelect: this.closeOnSelect(),
    destructive: this.destructive(),
    onSelect: this.onSelect(),
  }))
  /** The item's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shows the keys of the item's shortcut, like `⌘S`, inside the item. Hidden
 * from screen readers. Written empty, it shows the item's `shortcut`.
 * @experimental
 */
@Directive({ selector: "[uiMenuShortcut]", exportAs: "uiMenuShortcut" })
class UiMenuShortcut implements OnInit {
  readonly #handle = injectHandle(menu)
  readonly #item = inject(UiMenuItem, { optional: true })
  readonly #part = injectPart(this.#handle, "shortcut")
  readonly #text = injectDefaultText(() => {
    const shortcut = this.#item?.shortcut()
    return shortcut ? formatShortcut(shortcut, this.#handle.state().apple) : ""
  })

  ngOnInit() {
    this.#text.decide()
    this.#part.init()
  }
}

/**
 * An item that checks and unchecks an option.
 * @experimental
 */
@Directive({
  selector: "[uiMenuCheckboxItem]",
  exportAs: "uiMenuCheckboxItem",
  providers: [
    {
      provide: CheckableItemToken,
      useFactory: () => {
        const item = inject(forwardRef(() => UiMenuCheckboxItem))
        return { item: "checkbox-item", itemKey: item.value }
      },
    },
  ],
})
class UiMenuCheckboxItem implements OnInit {
  /** Identifies the option. */
  readonly value = input.required<string>()
  /** Its label, if its text isn't. */
  readonly label = input<string>()
  /** Stops it from being toggled. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether it's checked. Bind it, or `[(checked)]`, to control it. */
  readonly checked = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether it's checked at first, when uncontrolled. */
  readonly defaultChecked = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether toggling it closes the menu. */
  readonly closeOnSelect = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new value once a change isn't canceled, for `[(checked)]`. */
  readonly checkedChange = output<boolean>()
  /** Emits before it checks or unchecks. `details.cancel()` stops it. */
  readonly beforeCheckedChange = output<{
    checked: boolean
    details: ChangeDetails<MenuCheckedChangeReason>
  }>()
  readonly #handle = injectHandle(menu)
  readonly #part = injectPart(this.#handle, "checkbox-item", () => ({
    value: this.value(),
    label: this.label(),
    disabled: this.disabled(),
    checked: this.checked(),
    defaultChecked: this.defaultChecked(),
    closeOnSelect: this.closeOnSelect(),
    onCheckedChange: (
      checked: boolean,
      details: ChangeDetails<MenuCheckedChangeReason>
    ) => {
      this.beforeCheckedChange.emit({ checked, details })
      if (!details.canceled) {
        this.checkedChange.emit(checked)
      }
    },
  }))
  /** The item's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#handle.instance.use(menuCheckable)
    this.#part.init()
  }
}

/**
 * Radio items that share one value, named by a `uiMenuGroupLabel` inside it.
 * @experimental
 */
@Directive({
  selector: "[uiMenuRadioGroup]",
  exportAs: "uiMenuRadioGroup",
  providers: [
    {
      provide: MenuGroupToken,
      useFactory: () => inject(forwardRef(() => UiMenuRadioGroup)),
    },
  ],
})
class UiMenuRadioGroup implements OnInit {
  /** Identifies the group in the menu's `valueChange`. A generated id by default. */
  readonly name = input<string>()
  /** The checked value. Bind it, or `[(value)]`, to control it. */
  readonly value = input<string | null>()
  /** The checked value at first, when uncontrolled. */
  readonly defaultValue = input<string | null>()
  /** Emits the new value once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string>()
  /** Emits before the value changes. `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string
    details: ChangeDetails<MenuValueChangeReason>
  }>()
  readonly #generated = inject(UiIds).next()
  readonly #handle = injectHandle(menu)
  /** @internal The group's name, which its items and label take. */
  get id() {
    return this.name() ?? this.#generated
  }
  readonly #part = injectPart(this.#handle, "radio-group", () => ({
    value: this.value(),
    defaultValue: this.defaultValue(),
    id: this.id,
    name: this.id,
    onValueChange: (
      value: string,
      details: ChangeDetails<MenuValueChangeReason>
    ) => {
      this.beforeValueChange.emit({ value, details })
      if (!details.canceled) {
        this.valueChange.emit(value)
      }
    },
  }))
  /** The group's state, with its `value`. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#handle.instance.use(menuCheckable)
    this.#part.init()
  }
}

/**
 * An item in a `uiMenuRadioGroup`. Pressing it checks its value.
 * @experimental
 */
@Directive({
  selector: "[uiMenuRadioItem]",
  exportAs: "uiMenuRadioItem",
  providers: [
    {
      provide: CheckableItemToken,
      useFactory: () => {
        const item = inject(forwardRef(() => UiMenuRadioItem))
        return {
          item: "radio-item",
          itemKey: item.value,
          group: inject(UiMenuRadioGroup).id,
        }
      },
    },
  ],
})
class UiMenuRadioItem implements OnInit {
  /** The value it checks. */
  readonly value = input.required<string>()
  /** Its label, if its text isn't. */
  readonly label = input<string>()
  /** Stops it from being chosen. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether choosing it closes the menu. */
  readonly closeOnSelect = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #group = inject(UiMenuRadioGroup)
  readonly #handle = injectHandle(menu)
  readonly #part = injectPart(this.#handle, "radio-item", () => ({
    value: this.value(),
    label: this.label(),
    disabled: this.disabled(),
    closeOnSelect: this.closeOnSelect(),
    group: this.#group.id,
  }))
  /** The item's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#handle.instance.use(menuCheckable)
    this.#part.init()
  }
}

/**
 * The check or dot inside a checkbox or radio item, on the element it's
 * written on: `<span *uiMenuItemIndicator>`. Rendered while the item is
 * checked, or always with `keepMounted`.
 * @experimental
 */
@Directive({ selector: "[uiMenuItemIndicator]" })
class UiMenuItemIndicator implements OnInit {
  /** Keeps it in the page while unchecked: `*uiMenuItemIndicator="let state; keepMounted: true"`. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiMenuItemIndicatorKeepMounted",
    transform: optionalBoolean,
  })
  readonly #item = inject(CheckableItemToken)
  readonly #id = inject(UiIds).next()
  readonly #handle = injectHandle(menu)
  readonly #part = injectPresentPart(
    this.#handle,
    "item-indicator",
    computed(() => ({
      id: this.#id,
      item: this.#item.item,
      itemKey: this.#item.itemKey(),
      group: this.#item.group,
      keepMounted: this.keepMounted(),
    }))
  )

  static ngTemplateContextGuard(
    _directive: UiMenuItemIndicator,
    _context: unknown
  ): _context is PresentPartContext<MenuItemIndicatorState> {
    return true
  }

  ngOnInit() {
    this.#handle.instance.use(menuCheckable)
    this.#part.init()
  }
}

/**
 * An icon inside an item or a submenu trigger. Screen readers and typeahead
 * skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiMenuItemIcon]", exportAs: "uiMenuItemIcon" })
class UiMenuItemIcon implements OnInit {
  /** Flips it in right-to-left text, for icons that point a way. */
  readonly mirror = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #id = inject(UiIds).next()
  readonly #handle = injectHandle(menu)
  readonly #part = injectPart(this.#handle, "item-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
  }))
  /** The icon's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#handle.instance.use(menuItemIcons)
    this.#part.init()
  }
}

/**
 * A group of items, named by its `uiMenuGroupLabel`.
 * @experimental
 */
@Directive({
  selector: "[uiMenuGroup]",
  exportAs: "uiMenuGroup",
  providers: [
    {
      provide: MenuGroupToken,
      useFactory: () => inject(forwardRef(() => UiMenuGroup)),
    },
  ],
})
class UiMenuGroup implements OnInit {
  /** @internal The group's id, which its label names. */
  readonly id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(menu), "group", () => ({
    id: this.id,
  }))
  /** The group's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The heading of a `uiMenuGroup` or `uiMenuRadioGroup`, which names it.
 * @experimental
 */
@Directive({ selector: "[uiMenuGroupLabel]", exportAs: "uiMenuGroupLabel" })
class UiMenuGroupLabel implements OnInit {
  readonly #group = inject(MenuGroupToken)
  // Keyed by its group, so each group's label is a part of its own.
  readonly #part = injectPart(injectHandle(menu), "group-label", () => ({
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
 * A line between items or groups.
 * @experimental
 */
@Directive({ selector: "[uiMenuSeparator]", exportAs: "uiMenuSeparator" })
class UiMenuSeparator implements OnInit {
  readonly #part = injectPart(injectHandle(menu), "separator")

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The item that opens its submenu, inside a `uiMenuSub`.
 * @experimental
 */
@Directive({ selector: "[uiMenuSubTrigger]", exportAs: "uiMenuSubTrigger" })
class UiMenuSubTrigger implements OnInit {
  /** Stops it from opening the submenu. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #part = injectPart(inject(UiMenuSub).handle, "trigger", () => ({
    disabled: this.disabled(),
  }))
  /** The trigger's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createMenuController } from "@ui-sdk/core/menu"
export type {
  MenuActionDetails,
  MenuApi,
  MenuCheckboxItemProps,
  MenuCheckboxItemState,
  MenuCheckedChangeDetails,
  MenuCheckedChangeReason,
  MenuContentProps,
  MenuContentState,
  MenuContextTriggerProps,
  MenuContextTriggerState,
  MenuController,
  MenuData,
  MenuDataItem,
  MenuDismissReason,
  MenuFinalFocus,
  MenuItemIconProps,
  MenuItemIconState,
  MenuItemIndicatorProps,
  MenuItemIndicatorState,
  MenuItemProps,
  MenuItemState,
  MenuOpenChangeReason,
  MenuOpenOptions,
  MenuOptions,
  MenuPayloadChangeReason,
  MenuPrimitive,
  MenuRadioGroupProps,
  MenuRadioGroupState,
  MenuRadioItemProps,
  MenuRadioItemState,
  MenuSubTriggerProps,
  MenuTriggerProps,
  MenuTriggerState,
  MenuValueChangeDetails,
  MenuValueChangeReason,
} from "@ui-sdk/core/menu"

export {
  type MenuOpenChangeDetails,
  UiMenu,
  UiMenuCheckboxItem,
  UiMenuContent,
  UiMenuContextTrigger,
  UiMenuGroup,
  UiMenuGroupLabel,
  UiMenuItem,
  UiMenuItemIcon,
  UiMenuItemIndicator,
  UiMenuRadioGroup,
  UiMenuRadioItem,
  UiMenuSeparator,
  UiMenuShortcut,
  UiMenuSub,
  UiMenuSubTrigger,
  UiMenuTrigger,
}
