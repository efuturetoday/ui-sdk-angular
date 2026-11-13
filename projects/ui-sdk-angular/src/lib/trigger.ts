import type { Primitive, PropsOf, StateOf } from "@ui-sdk/core"
import type { AlertDialogPrimitive } from "@ui-sdk/core/alert-dialog"
import type { DialogPrimitive } from "@ui-sdk/core/dialog"
import {
  computed,
  forwardRef,
  inject,
  InjectionToken,
  type Provider,
  type Signal,
  type Type,
} from "@angular/core"
import { injectTargetPart } from "./part"
import { tokenOf, type PrimitiveHandle } from "./primitive"

// What a trigger tells the parts inside it, like its Shortcut: the instance it
// opens, which a trigger outside its root finds through its controller, and
// its shortcut.
type TriggerContext<P extends Primitive> = {
  target: Signal<PrimitiveHandle<P> | undefined>
  shortcut: Signal<string | undefined>
}

const tokens = new WeakMap<
  Primitive,
  InjectionToken<TriggerContext<Primitive>>
>()

function triggerTokenOf<P extends Primitive>(primitive: P) {
  let token = tokens.get(primitive)
  if (!token) {
    tokens.set(
      primitive,
      (token = new InjectionToken(`${primitive.name}-trigger`))
    )
  }
  return token as InjectionToken<TriggerContext<P>>
}

function provideTrigger<P extends Primitive>(
  primitive: P,
  trigger: () => Type<TriggerContext<P>>
) {
  return {
    provide: triggerTokenOf(primitive),
    useExisting: forwardRef(trigger),
  } satisfies Provider
}

// A trigger whose instance isn't on the page yet is a plain button.
function unboundTrigger(
  disabled: () => boolean | undefined,
  focusableWhenDisabled: () => boolean | undefined
) {
  return {
    attrs: () => ({
      type: "button",
      disabled: disabled() && !focusableWhenDisabled() ? "" : undefined,
      "aria-disabled":
        disabled() && focusableWhenDisabled() ? "true" : undefined,
    }),
    state: () => ({ open: false, disabled: !!disabled() }),
  }
}

// A Shortcut part: in its root, or inside a trigger, which gives its keys and
// the instance it opens. Inside a trigger whose instance isn't on the page
// yet, it shows nothing.
function injectShortcut<P extends DialogPrimitive | AlertDialogPrimitive>(
  primitive: P,
  shortcut: () => string | undefined
) {
  const nearest = inject(tokenOf(primitive), { optional: true })?.handle
  const trigger = inject(triggerTokenOf(primitive), { optional: true })
  if (!nearest && !trigger) {
    throw new Error(
      `${primitive.name} shortcuts must be used inside their root or a trigger.`
    )
  }
  const target = computed(() => nearest ?? trigger?.target())
  return injectTargetPart(
    target,
    "shortcut",
    // Both dialogs' shortcut slots take these props and state; TypeScript
    // can't see it through P.
    () =>
      ({ shortcut: shortcut() ?? trigger?.shortcut() }) as PropsOf<
        P,
        "shortcut"
      >,
    {
      attrs: () => ({}),
      state: () => ({ text: "" }) as StateOf<P, "shortcut">,
    }
  )
}

export { injectShortcut, provideTrigger, type TriggerContext, unboundTrigger }
