import {
  computed,
  Directive,
  forwardRef,
  inject,
  input,
  type OnInit,
} from "@angular/core"
import {
  toolbar,
  type ToolbarController,
  type ToolbarOrientation,
  type ToolbarPrimitive,
} from "@ui-sdk/core/toolbar"
import {
  optionalBoolean,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
  ɵToolbarGroupDisabled as ToolbarGroupDisabled,
  ɵToolbarToken as ToolbarToken,
} from "ngx-ui-sdk"

/**
 * A row of controls with one tab stop and arrow keys between them, on the
 * element it's written on. Toggles and toggle groups inside join it; put
 * `uiToolbarButton` on a menu or select trigger, and `uiToolbarInput` on a field.
 * @experimental
 */
@Directive({
  selector: "[uiToolbar]",
  exportAs: "uiToolbar",
  providers: [
    provideRoot(toolbar, () => UiToolbar),
    {
      provide: ToolbarToken,
      useFactory: () => {
        const bar = inject(forwardRef(() => UiToolbar))
        return () => bar.handle.api
      },
    },
  ],
})
class UiToolbar implements OnInit {
  /** Which arrow keys move between the items. */
  readonly orientation = input<ToolbarOrientation>()
  /** Whether arrow keys wrap from the last item to the first. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Disables every item, which stay focusable. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Focuses its items from anywhere. Create one with `createToolbarController()`. */
  readonly controller = input<ToolbarController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly handle: PrimitiveHandle<ToolbarPrimitive> = injectPrimitive(
    toolbar,
    () => ({
      orientation: this.orientation(),
      loop: this.loop(),
      disabled: this.disabled(),
      controller: this.controller(),
      debug: this.debug(),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The toolbar's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * A group of related items in the toolbar. `disabled` disables every item in it.
 * @experimental
 */
@Directive({
  selector: "[uiToolbarGroup]",
  exportAs: "uiToolbarGroup",
  providers: [
    {
      provide: ToolbarGroupDisabled,
      useFactory: () => {
        const group = inject(forwardRef(() => UiToolbarGroup))
        return () => group.state().disabled
      },
    },
  ],
})
class UiToolbarGroup implements OnInit {
  /** Disables every item in it. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** @internal The group's id. */
  readonly id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(toolbar), "group", () => ({
    id: this.id,
    disabled: this.disabled(),
  }))
  /** The group's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

// What an item takes from the group it sits in.
function injectGroupDisabled() {
  const group = inject(UiToolbarGroup, { optional: true })
  return computed(() => group?.disabled())
}

/**
 * A button in the toolbar, or a menu or select trigger written as one.
 * Arrow keys move between it and the toolbar's other items.
 * @experimental
 */
@Directive({ selector: "[uiToolbarButton]", exportAs: "uiToolbarButton" })
class UiToolbarButton implements OnInit {
  /** Stops presses. It stays focusable with `focusableWhenDisabled`. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps it in the arrow keys' path while disabled. */
  readonly focusableWhenDisabled = input<boolean | undefined, unknown>(
    undefined,
    { transform: optionalBoolean }
  )
  readonly #id = inject(UiIds).next()
  readonly #group = injectGroupDisabled()
  readonly #part = injectPart(injectHandle(toolbar), "button", () => ({
    id: this.#id,
    disabled: this.disabled(),
    focusableWhenDisabled: this.focusableWhenDisabled(),
    groupDisabled: this.#group(),
  }))
  /** The button's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A text field in the toolbar. Arrows move its caret, and leave it only from
 * the end they point at.
 * @experimental
 */
@Directive({ selector: "input[uiToolbarInput]", exportAs: "uiToolbarInput" })
class UiToolbarInput implements OnInit {
  /** Stops typing. It stays focusable with `focusableWhenDisabled`. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps it in the arrow keys' path while disabled. */
  readonly focusableWhenDisabled = input<boolean | undefined, unknown>(
    undefined,
    { transform: optionalBoolean }
  )
  readonly #id = inject(UiIds).next()
  readonly #group = injectGroupDisabled()
  readonly #part = injectPart(injectHandle(toolbar), "input", () => ({
    id: this.#id,
    disabled: this.disabled(),
    focusableWhenDisabled: this.focusableWhenDisabled(),
    groupDisabled: this.#group(),
  }))
  /** The field's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A link in the toolbar. Arrow keys move between it and the toolbar's other items.
 * @experimental
 */
@Directive({ selector: "[uiToolbarLink]", exportAs: "uiToolbarLink" })
class UiToolbarLink implements OnInit {
  readonly #id = inject(UiIds).next()
  readonly #group = injectGroupDisabled()
  readonly #part = injectPart(injectHandle(toolbar), "link", () => ({
    id: this.#id,
    groupDisabled: this.#group(),
  }))
  /** The link's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A line between groups of items.
 * @experimental
 */
@Directive({ selector: "[uiToolbarSeparator]", exportAs: "uiToolbarSeparator" })
class UiToolbarSeparator implements OnInit {
  readonly #part = injectPart(injectHandle(toolbar), "separator")
  /** The separator's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createToolbarController } from "@ui-sdk/core/toolbar"
export type {
  ToolbarApi,
  ToolbarButtonProps,
  ToolbarButtonState,
  ToolbarController,
  ToolbarGroupProps,
  ToolbarGroupState,
  ToolbarInputProps,
  ToolbarInputState,
  ToolbarLinkState,
  ToolbarOptions,
  ToolbarOrientation,
  ToolbarPrimitive,
  ToolbarState,
  ToolbarSeparatorState,
} from "@ui-sdk/core/toolbar"

export {
  UiToolbar,
  UiToolbarButton,
  UiToolbarGroup,
  UiToolbarInput,
  UiToolbarLink,
  UiToolbarSeparator,
}
