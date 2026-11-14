import {
  Directive,
  forwardRef,
  inject,
  input,
  type OnInit,
} from "@angular/core"
import {
  menubar,
  type MenubarController,
  type MenubarOrientation,
  type MenubarPrimitive,
} from "@ui-sdk/core/menubar"
import {
  optionalBoolean,
  MenubarToken,
  injectPart,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "@ngx-ui-sdk/core"

/**
 * A row of menus, like a desktop app's, on the element it's written on: one
 * tab stop, arrow keys between the triggers and between open menus. Each
 * `uiMenu` inside joins it.
 * @experimental
 */
@Directive({
  selector: "[uiMenubar]",
  exportAs: "uiMenubar",
  providers: [
    provideRoot(menubar, () => UiMenubar),
    // Menus join it through the token, so a menu doesn't bundle the menubar.
    {
      provide: MenubarToken,
      useFactory: () => {
        const bar = inject(forwardRef(() => UiMenubar))
        return () => bar.handle.api
      },
    },
  ],
})
class UiMenubar implements OnInit {
  /** Which arrow keys move between menus. A vertical menubar opens its menus to the side. */
  readonly orientation = input<MenubarOrientation>()
  /** Whether arrow keys wrap from the last menu to the first. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Stops every menu from opening. Triggers stay focusable with `aria-disabled`. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The `modal` of every menu in it that doesn't set its own, `"pointer"` by default. */
  readonly modal = input<boolean | "pointer">()
  /** Opens, closes and focuses the menubar from anywhere. Create one with `createMenubarController()`. */
  readonly controller = input<MenubarController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly handle: PrimitiveHandle<MenubarPrimitive> = injectPrimitive(
    menubar,
    () => ({
      orientation: this.orientation(),
      loop: this.loop(),
      disabled: this.disabled(),
      modal: this.modal(),
      controller: this.controller(),
      debug: this.debug(),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The menubar's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

export { createMenubarController } from "@ui-sdk/core/menubar"
export type {
  MenubarApi,
  MenubarController,
  MenubarMember,
  MenubarOptions,
  MenubarOrientation,
  MenubarPrimitive,
  MenubarState,
} from "@ui-sdk/core/menubar"

export { UiMenubar }
