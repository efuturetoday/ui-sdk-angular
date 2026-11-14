import { Directive, input, type OnInit } from "@angular/core"
import {
  button,
  type ButtonActionDetails,
  type ButtonPrimitive,
} from "@ui-sdk/core/button"
import { optionalBoolean } from "./inputs"
import { injectPart } from "./part"
import { injectPrimitive, type PrimitiveHandle } from "./primitive"

/**
 * A button, or a link or any element that acts as one, on the element it's
 * written on.
 * @experimental
 */
@Directive({ selector: "[uiButton]", exportAs: "uiButton" })
class UiButton implements OnInit {
  /** Stops presses. The button leaves the tab order unless `focusableWhenDisabled` is set. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Keeps a disabled button in the tab order with `aria-disabled`, so it can hold focus and host a tooltip. */
  readonly focusableWhenDisabled = input<boolean | undefined, unknown>(
    undefined,
    { transform: optionalBoolean }
  )
  /** What a native button does in a form: `"submit"`, `"reset"` or nothing. */
  readonly type = input<"button" | "submit" | "reset">()
  /** What screen readers hear once the button has been pending for a second, `"Loading"` by default. */
  readonly pendingAnnouncement = input<string>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /**
   * Runs on a press, in place of `(click)`: `[action]="save"`. A returned
   * Promise keeps the button pending until it settles, `details.source` says
   * whether a pointer or the keyboard pressed it, and a disabled or pending
   * button never runs it.
   */
  readonly action =
    input<(event: MouseEvent, details: ButtonActionDetails) => unknown>()
  readonly handle: PrimitiveHandle<ButtonPrimitive> = injectPrimitive(
    button,
    () => ({
      disabled: this.disabled(),
      focusableWhenDisabled: this.focusableWhenDisabled(),
      type: this.type(),
      pendingAnnouncement: this.pendingAnnouncement(),
      debug: this.debug(),
      action: (event, details) => this.action()?.(event as MouseEvent, details),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The button's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

export type {
  ButtonActionDetails,
  ButtonApi,
  ButtonOptions,
  ButtonPrimitive,
  ButtonState,
} from "@ui-sdk/core/button"

export { UiButton }
