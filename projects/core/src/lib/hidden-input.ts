import { isPlatformBrowser } from "@angular/common"
import {
  afterNextRender,
  effect,
  inject,
  isDevMode,
  PLATFORM_ID,
} from "@angular/core"
import { FormField } from "@angular/forms/signals"
import { injectFormValue } from "./forms"

// The controls whose hidden input is in the page.
const linked = new WeakSet<object>()

/**
 * Tells the control `control` gives that it has its hidden input. Call it
 * where Angular allows `inject`, in the hidden input's directive.
 * @experimental
 */
function linkHiddenInput(control: () => object) {
  effect(() => {
    linked.add(control())
  })
}

/**
 * In development, warns once the page has rendered when a control has no
 * hidden input and Angular's forms don't hold its value. Call it in a field
 * initializer of the control's root directive, like `uiCheckbox`.
 * @experimental
 */
function checkHiddenInput(control: object, selector: string) {
  if (!isDevMode() || !isPlatformBrowser(inject(PLATFORM_ID))) {
    return
  }
  const forms =
    injectFormValue() ?? inject(FormField, { self: true, optional: true })
  afterNextRender(() => {
    if (!forms && !linked.has(control)) {
      console.warn(
        `A ${selector} has no hidden input, so it takes no part in forms and a <label> around it can't always name it. Write <input [${selector}Input]="…" /> right after it.`
      )
    }
  })
}

export { checkHiddenInput, linkHiddenInput }
