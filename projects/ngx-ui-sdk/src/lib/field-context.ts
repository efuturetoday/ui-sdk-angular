import { ElementRef, inject, InjectionToken, type Signal } from "@angular/core"
import type { Attrs } from "@ui-sdk/core"
import type { FieldPrimitive } from "@ui-sdk/core/field"
import { madeLabel } from "@ui-sdk/core/renderer"
import type { JoinedPart } from "./part"
import type { PrimitiveHandle } from "./primitive"

/**
 * What a control inside a field takes from it: its name and disabled state,
 * and its ids and validity through the field's control part.
 * @experimental
 */
type FieldContext = {
  handle: PrimitiveHandle<FieldPrimitive>
  name: Signal<string | undefined>
  disabled: Signal<boolean | undefined>
}

const FieldContextToken = new InjectionToken<FieldContext>("field")

/**
 * The field around a control, or null outside one. Its `join` makes the
 * control's element the field's control part too, with the field's id, so the
 * label points at it from the server's HTML on, unless the element has its own.
 * Call it in a field initializer of the control's root directive.
 * @experimental
 */
function injectFieldControl() {
  const context = inject(FieldContextToken, { optional: true })
  if (!context) {
    return null
  }
  const el = inject(ElementRef).nativeElement as HTMLElement
  let authored: { id?: string; describedBy?: string } | undefined
  const join: JoinedPart = {
    part: (own) => {
      // The element's own id and description, before anything writes either,
      // and the control's own description, like a date's format hint, ahead
      // of the field's, as Vue passes it.
      authored ??= {
        id: el.getAttribute("id") ?? undefined,
        describedBy: el.getAttribute("aria-describedby") ?? undefined,
      }
      const describedBy =
        [authored.describedBy, own["aria-describedby"]]
          .filter(Boolean)
          .join(" ") || undefined
      return context.handle.instance.part("control", {
        id: authored.id,
        describedBy,
      })
    },
    // The field decides the id, and its label names the control over the
    // control's own, but not over the author's. The control stays its own part.
    merge: (own, joined) => {
      const label = own["aria-labelledby"]
      const merged: Attrs = { ...own, id: undefined }
      for (const key in joined) {
        if (joined[key] !== undefined) {
          merged[key] = joined[key]
        }
      }
      return {
        ...merged,
        "aria-labelledby":
          label && !madeLabel(label)
            ? label
            : (joined["aria-labelledby"] ?? label),
        "data-slot": own["data-slot"],
      }
    },
  }
  return { context, name: context.name, disabled: context.disabled, join }
}

export { type FieldContext, FieldContextToken, injectFieldControl }
