import {
  computed,
  Directive,
  inject,
  input,
  output,
  type OnInit,
} from "@angular/core"
import type { Anchor, ChangeDetails, Side } from "@ui-sdk/core"
import {
  navigationMenu,
  type NavigationMenuContentState,
  type NavigationMenuController,
  type NavigationMenuPrimitive,
  type NavigationMenuValueChangeReason,
  type NavigationMenuViewportState,
} from "@ui-sdk/core/navigation-menu"
import {
  optionalBoolean,
  injectPart,
  injectPopupPart,
  type PopupContainer,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵtokenOf as tokenOf,
  ɵUiIds as UiIds,
  type PresentPartContext,
} from "ngx-ui-sdk"

/**
 * Why the open item changes.
 * @experimental
 */
type NavigationMenuValueChangeDetails =
  ChangeDetails<NavigationMenuValueChangeReason>

/**
 * A site's navigation, on a `<nav>` it's written on. Inside another menu's
 * content, on a `<div>`, it's a nested menu that closes with its parent.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenu]",
  exportAs: "uiNavigationMenu",
  providers: [provideRoot(navigationMenu, () => UiNavigationMenu)],
})
class UiNavigationMenu implements OnInit {
  /** The open item's value, or null. Bind it, or `[(value)]`, to control it. */
  readonly value = input<string | null>()
  /** The open item at first, when uncontrolled. */
  readonly defaultValue = input<string | null>()
  /** How long resting the pointer on a trigger waits before opening, in milliseconds. */
  readonly delay = input<number>()
  /** How long it waits before closing as the pointer leaves, in milliseconds. */
  readonly closeDelay = input<number>()
  /** Whether resting the pointer on a trigger opens its content. */
  readonly openOnHover = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether choosing a link closes the menu. */
  readonly closeOnSelect = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Which arrow keys move between the items. */
  readonly orientation = input<"horizontal" | "vertical">()
  /** Opens and closes items from anywhere. Create one with `createNavigationMenuController()`. */
  readonly controller = input<NavigationMenuController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Renders the contents and viewport into this element instead of in place. */
  readonly container = input<PopupContainer>()
  /** Emits the open item once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<string | null>()
  /** Emits before the open item changes. `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: string | null
    details: NavigationMenuValueChangeDetails
  }>()
  /** Emits once a content has finished opening or closing, after any animation. */
  readonly openChangeComplete = output<boolean>()
  // The menu and item it's nested in, inside another menu's content.
  readonly #parentMenu = inject(tokenOf(navigationMenu), {
    optional: true,
    skipSelf: true,
  })?.handle
  readonly #parentItem = inject(UiNavigationMenuItem, { optional: true })
  readonly handle: PrimitiveHandle<NavigationMenuPrimitive> = injectPrimitive(
    navigationMenu,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      delay: this.delay(),
      closeDelay: this.closeDelay(),
      openOnHover: this.openOnHover(),
      closeOnSelect: this.closeOnSelect(),
      orientation: this.orientation(),
      controller: this.controller(),
      debug: this.debug(),
      parent:
        this.#parentMenu && this.#parentItem
          ? { api: this.#parentMenu.api, item: this.#parentItem.key() }
          : undefined,
      onValueChange: (
        value: string | null,
        details: NavigationMenuValueChangeDetails
      ) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
      onOpenChangeComplete: (open: boolean) =>
        this.openChangeComplete.emit(open),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The menu's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The list of top-level items.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuList]",
  exportAs: "uiNavigationMenuList",
})
class UiNavigationMenuList implements OnInit {
  readonly #part = injectPart(injectHandle(navigationMenu), "list")
  /** The list's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * One item: a link, or a trigger and the content it opens.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuItem]",
  exportAs: "uiNavigationMenuItem",
})
class UiNavigationMenuItem implements OnInit {
  /** The item's value, which the menu's `value` names while it's open. A link's item needs none. */
  readonly value = input<string>()
  readonly #id = inject(UiIds).next()
  /** @internal The item's key: its value, or an id of its own. */
  readonly key = computed(() => this.value() ?? this.#id)
  readonly #part = injectPart(injectHandle(navigationMenu), "item", () => ({
    value: this.key(),
  }))
  /** The item's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The button that opens its item's content. Resting the pointer on it opens
 * the content too.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuTrigger]",
  exportAs: "uiNavigationMenuTrigger",
})
class UiNavigationMenuTrigger implements OnInit {
  /** Stops it from opening its content. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #item = inject(UiNavigationMenuItem)
  readonly #part = injectPart(injectHandle(navigationMenu), "trigger", () => ({
    value: this.#item.key(),
    disabled: this.disabled(),
  }))
  /** The trigger's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Its item's content, on the element it's written on:
 * `<div *uiNavigationMenuContent>`. While its item is open it renders into
 * the viewport, or without one as its own popup; closed and kept, in place.
 * @experimental
 */
@Directive({ selector: "[uiNavigationMenuContent]" })
class UiNavigationMenuContent implements OnInit {
  /** Which side of the trigger it opens on, without a viewport. */
  readonly side = input<Side>(undefined, {
    alias: "uiNavigationMenuContentSide",
  })
  /** How it lines up with the trigger along that side. */
  readonly align = input<"start" | "center" | "end">(undefined, {
    alias: "uiNavigationMenuContentAlign",
  })
  /** Gap between the trigger and the content, in pixels. */
  readonly sideOffset = input<number>(undefined, {
    alias: "uiNavigationMenuContentSideOffset",
  })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input<number>(undefined, {
    alias: "uiNavigationMenuContentAlignOffset",
  })
  /** Space it keeps from the edges of the screen, in pixels. */
  readonly collisionPadding = input<number>(undefined, {
    alias: "uiNavigationMenuContentCollisionPadding",
  })
  /** Space an arrow keeps from the content's corners, in pixels. */
  readonly arrowPadding = input<number>(undefined, {
    alias: "uiNavigationMenuContentArrowPadding",
  })
  /** What it's positioned against instead of the trigger. */
  readonly anchor = input<Anchor | string | null>(undefined, {
    alias: "uiNavigationMenuContentAnchor",
  })
  /** Keeps it in the page, hidden, while closed. */
  readonly keepMounted = input<boolean | undefined, unknown>(undefined, {
    alias: "uiNavigationMenuContentKeepMounted",
    transform: optionalBoolean,
  })
  /** Keeps it in the page while closed, findable by the browser's search, which opens it. */
  readonly hiddenUntilFound = input<boolean | undefined, unknown>(undefined, {
    alias: "uiNavigationMenuContentHiddenUntilFound",
    transform: optionalBoolean,
  })
  /** Where it renders as its own popup, instead of the menu's `container`. */
  readonly container = input<PopupContainer>(undefined, {
    alias: "uiNavigationMenuContentContainer",
  })
  readonly #root = inject(UiNavigationMenu)
  readonly #item = inject(UiNavigationMenuItem)
  readonly #handle = injectHandle(navigationMenu)
  readonly #props = computed(() => ({
    side: this.side(),
    align: this.align(),
    sideOffset: this.sideOffset(),
    alignOffset: this.alignOffset(),
    collisionPadding: this.collisionPadding(),
    arrowPadding: this.arrowPadding(),
    anchor: this.anchor() as string | undefined,
    keepMounted: this.keepMounted(),
    hiddenUntilFound: this.hiddenUntilFound(),
    value: this.#item.key(),
  }))
  // Inside the viewport while its item is open; with a viewport but closed,
  // in place; without one, a popup of its own.
  readonly #part = injectPopupPart(this.#handle, "content", this.#props, {
    container: () => {
      const { internal } = this.#handle.api
      const viewport = internal.viewportElement()
      if (viewport && internal.inViewport(this.#item.key())) {
        return viewport
      }
      return this.#handle.state().viewport
        ? null
        : (this.container() ?? this.#root.container())
    },
  })

  static ngTemplateContextGuard(
    _directive: UiNavigationMenuContent,
    _context: unknown
  ): _context is PresentPartContext<NavigationMenuContentState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A link. Pressing it closes the menu, and `current` marks the current page
 * with `aria-current="page"`.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuLink]",
  exportAs: "uiNavigationMenuLink",
})
class UiNavigationMenuLink implements OnInit {
  /** Marks the current page. */
  readonly current = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether choosing it closes the menu, the menu's `closeOnSelect` by default. */
  readonly closeOnSelect = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** @internal Its id, which its icon names. */
  readonly id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(navigationMenu), "link", () => ({
    id: this.id,
    current: this.current(),
    closeOnSelect: this.closeOnSelect(),
  }))
  /** The link's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An icon inside a link. Screen readers skip it, and `mirror` flips it in
 * right-to-left text.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuLinkIcon]",
  exportAs: "uiNavigationMenuLinkIcon",
})
class UiNavigationMenuLinkIcon implements OnInit {
  /** Flips it in right-to-left text, for icons that point a way. */
  readonly mirror = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly #link = inject(UiNavigationMenuLink)
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(
    injectHandle(navigationMenu),
    "link-icon",
    () => ({ id: this.#id, mirror: this.mirror(), item: this.#link.id })
  )
  /** The icon's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The one popup every content renders into, on the element it's written on:
 * `<div *uiNavigationMenuViewport>`. It takes the open content's size as
 * `--viewport-width` and `--viewport-height`, and moves to the open trigger.
 * @experimental
 */
@Directive({ selector: "[uiNavigationMenuViewport]" })
class UiNavigationMenuViewport implements OnInit {
  /** Which side of the trigger it opens on. */
  readonly side = input<Side>(undefined, {
    alias: "uiNavigationMenuViewportSide",
  })
  /** How it lines up with the trigger along that side. */
  readonly align = input<"start" | "center" | "end">(undefined, {
    alias: "uiNavigationMenuViewportAlign",
  })
  /** Gap between the trigger and the viewport, in pixels. */
  readonly sideOffset = input<number>(undefined, {
    alias: "uiNavigationMenuViewportSideOffset",
  })
  /** Shift along the trigger, in pixels. */
  readonly alignOffset = input<number>(undefined, {
    alias: "uiNavigationMenuViewportAlignOffset",
  })
  /** Space it keeps from the edges of the screen, in pixels. */
  readonly collisionPadding = input<number>(undefined, {
    alias: "uiNavigationMenuViewportCollisionPadding",
  })
  /** Space an arrow keeps from the viewport's corners, in pixels. */
  readonly arrowPadding = input<number>(undefined, {
    alias: "uiNavigationMenuViewportArrowPadding",
  })
  /** What it's positioned against instead of the trigger. */
  readonly anchor = input<Anchor | string | null>(undefined, {
    alias: "uiNavigationMenuViewportAnchor",
  })
  /** Where it renders, instead of the menu's `container`. */
  readonly container = input<PopupContainer>(undefined, {
    alias: "uiNavigationMenuViewportContainer",
  })
  readonly #root = inject(UiNavigationMenu)
  readonly #part = injectPopupPart(
    injectHandle(navigationMenu),
    "viewport",
    computed(() => ({
      side: this.side(),
      align: this.align(),
      sideOffset: this.sideOffset(),
      alignOffset: this.alignOffset(),
      collisionPadding: this.collisionPadding(),
      arrowPadding: this.arrowPadding(),
      anchor: this.anchor() as string | undefined,
    })),
    { container: () => this.container() ?? this.#root.container() }
  )

  static ngTemplateContextGuard(
    _directive: UiNavigationMenuViewport,
    _context: unknown
  ): _context is PresentPartContext<NavigationMenuViewportState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Sits under the open trigger, or under the link with `current` while every
 * panel is closed. Screen readers skip it.
 * @experimental
 */
@Directive({
  selector: "[uiNavigationMenuIndicator]",
  exportAs: "uiNavigationMenuIndicator",
})
class UiNavigationMenuIndicator implements OnInit {
  readonly #part = injectPart(injectHandle(navigationMenu), "indicator")
  /** The indicator's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createNavigationMenuController } from "@ui-sdk/core/navigation-menu"
export type {
  NavigationMenuApi,
  NavigationMenuChangeOptions,
  NavigationMenuContentProps,
  NavigationMenuContentState,
  NavigationMenuController,
  NavigationMenuIndicatorState,
  NavigationMenuItemProps,
  NavigationMenuItemState,
  NavigationMenuLinkIconProps,
  NavigationMenuLinkIconState,
  NavigationMenuLinkProps,
  NavigationMenuLinkState,
  NavigationMenuListState,
  NavigationMenuMotion,
  NavigationMenuOptions,
  NavigationMenuOrientation,
  NavigationMenuPrimitive,
  NavigationMenuState,
  NavigationMenuTriggerProps,
  NavigationMenuTriggerState,
  NavigationMenuValueChangeReason,
  NavigationMenuViewportProps,
  NavigationMenuViewportState,
} from "@ui-sdk/core/navigation-menu"

export {
  type NavigationMenuValueChangeDetails,
  UiNavigationMenu,
  UiNavigationMenuContent,
  UiNavigationMenuIndicator,
  UiNavigationMenuItem,
  UiNavigationMenuLink,
  UiNavigationMenuLinkIcon,
  UiNavigationMenuList,
  UiNavigationMenuTrigger,
  UiNavigationMenuViewport,
}
