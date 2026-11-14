import { Directive, input, type OnInit } from "@angular/core"
import {
  separator,
  type SeparatorOrientation,
  type SeparatorPrimitive,
} from "@ui-sdk/core/separator"
import {
  optionalBoolean,
  injectPart,
  injectPrimitive,
  type PrimitiveHandle,
} from "ngx-ui-sdk"

/**
 * A line between groups of content, announced as a separator unless it's `decorative`.
 * @experimental
 */
@Directive({ selector: "[uiSeparator]", exportAs: "uiSeparator" })
class UiSeparator implements OnInit {
  /** Which way the line runs, `"horizontal"` by default. */
  readonly orientation = input<SeparatorOrientation>()
  /** Hides it from assistive technology, for a line that's only visual. */
  readonly decorative = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  readonly handle: PrimitiveHandle<SeparatorPrimitive> = injectPrimitive(
    separator,
    () => ({
      orientation: this.orientation(),
      decorative: this.decorative(),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The separator's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

export type {
  SeparatorOptions,
  SeparatorOrientation,
  SeparatorPrimitive,
  SeparatorState,
} from "@ui-sdk/core/separator"

export { UiSeparator }
