import type { Primitive, PropsOf, SlotName, StateOf } from "@ui-sdk/core"
import {
  inject,
  Injector,
  TemplateRef,
  ViewContainerRef,
  type EmbeddedViewRef,
  type Provider,
  type Signal,
} from "@angular/core"
import { bindPart } from "./part"
import type { PrimitiveHandle } from "./primitive"

/**
 * The context a structural part's template gets: `let state` is the part's state.
 * @experimental
 */
type PresentPartContext<State> = { $implicit: Signal<State> }

/**
 * Where a structural part's element goes, if not where it's written, like a
 * popup's into its container. `place` gets the element once its view exists,
 * before it renders; `forget` comes as the view goes. `providers` reach the
 * parts inside.
 * @experimental
 */
type Placement = {
  place: (el: HTMLElement) => void
  forget: () => void
  providers?: Provider[]
}

/**
 * Makes a structural directive one part of a primitive whose presence core
 * decides, like a dialog's content: it creates its template while the part is
 * present, and the part is the template's first element, placed by
 * `placement` if given. Pass a function for `handle` when the part's presence
 * also depends on the app, like a toast's title on its data: it returns the
 * instance while the part may be present. Call it in a field initializer and
 * its `init()` from `ngOnInit`.
 * @experimental
 */
function injectPresentPart<P extends Primitive, S extends SlotName<P>>(
  handle: PrimitiveHandle<P> | (() => PrimitiveHandle<P> | undefined),
  slot: S,
  props = () => ({}) as PropsOf<P, S>,
  placement?: Placement
) {
  const target = typeof handle === "function" ? handle : () => handle
  const template =
    inject<TemplateRef<PresentPartContext<StateOf<P, S>>>>(TemplateRef)
  const viewContainer = inject(ViewContainerRef)
  const injector = placement?.providers
    ? Injector.create({
        providers: placement.providers,
        parent: viewContainer.injector,
      })
    : viewContainer.injector
  let view: EmbeddedViewRef<PresentPartContext<StateOf<P, S>>> | undefined
  const element = () =>
    view?.rootNodes.find((node: Node) => node.nodeType === 1) as
      HTMLElement | undefined

  return bindPart(target, slot, props, {
    show: (state) => {
      if (!view) {
        view = viewContainer.createEmbeddedView(
          template,
          { $implicit: state },
          { injector }
        )
        const el = element()
        if (el) {
          placement?.place(el)
        }
        // Core binds the part and moves focus into it as it appears, so its
        // view renders now, with the parts inside it, as React and Vue do.
        view.detectChanges()
      }
      return element()
    },
    hide: () => {
      placement?.forget()
      view?.destroy()
      view = undefined
    },
    at: viewContainer.element.nativeElement as Node,
  })
}

export { injectPresentPart, type Placement, type PresentPartContext }
