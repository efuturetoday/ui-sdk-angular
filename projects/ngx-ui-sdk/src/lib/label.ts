import { Directive, type OnInit } from "@angular/core"
import { label, type LabelPrimitive } from "@ui-sdk/core/label"
import { injectPart } from "./part"
import { injectPrimitive, type PrimitiveHandle } from "./primitive"

/**
 * A native `<label>` that names any control, by `for` or by wrapping it. A
 * control a `<label>` can't reach, like a radio group or a slider, takes it as
 * its name, and a press on the label activates it.
 * @experimental
 */
@Directive({ selector: "[uiLabel]", exportAs: "uiLabel" })
class UiLabel implements OnInit {
  readonly handle: PrimitiveHandle<LabelPrimitive> = injectPrimitive(
    label,
    () => ({})
  )
  readonly #part = injectPart(this.handle, "root")
  /** The label's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

export type { LabelOptions, LabelPrimitive } from "@ui-sdk/core/label"

export { UiLabel }
