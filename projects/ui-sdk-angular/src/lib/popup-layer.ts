import type { Primitive, PropsOf, SlotName } from "@ui-sdk/core"
import { portalTarget, present as isPresent } from "@ui-sdk/core/renderer"
import {
  inject,
  InjectionToken,
  Renderer2,
  untracked,
  ViewContainerRef,
} from "@angular/core"
import { bindPart } from "./part"
import { unwatchPresence, watchPresence } from "./presence"
import type { PrimitiveHandle } from "./primitive"
import { injectPresentPart, type Placement } from "./structural"

/**
 * Where a popup renders instead of in place.
 * @experimental
 */
type PopupContainer = Element | DocumentFragment | null | undefined

// The container the nearest popup above renders into. Popups inside it render
// there too, like a menu inside a portaled popover, unless they name their own.
const InheritedContainer = new InjectionToken<() => PopupContainer>(
  "popup-container"
)

// Where a popup's nodes are: in place, in its container, or in a viewport while
// it's a sheet. Only the layer moves them, and Angular removes nodes only where
// it put them, so the layer also takes them out while the page is away.
function createLayer<P extends Primitive>(
  handle: PrimitiveHandle<P>,
  container: (() => PopupContainer) | undefined,
  viewport: SlotName<P> | undefined
) {
  const renderer = inject(Renderer2)
  const anchor = inject(ViewContainerRef).element.nativeElement as Node
  const inherited = inject(InheritedContainer, { optional: true })
  const resolved = () => container?.() ?? inherited?.()
  let el: HTMLElement | undefined
  let wrapper: HTMLElement | undefined

  const target = () => (container ? portalTarget(untracked(resolved)) : null)
  const sheet = () =>
    !!viewport && isPresent(handle.instance.part(viewport, {} as never))

  // A browser takes a popover out of the top layer when it moves, so nodes
  // move into place before anything shows them.
  const put = (node: Node) => {
    const into = target()
    if (into) {
      renderer.appendChild(into, node)
    } else {
      renderer.insertBefore(anchor.parentNode, node, anchor.nextSibling)
    }
  }

  // Core finds a sheet's viewport as its content's parent.
  const arrange = () => {
    if (sheet()) {
      wrapper ??= renderer.createElement("div") as HTMLElement
      if (!wrapper.isConnected) {
        put(wrapper)
      }
      if (el && el.parentNode !== wrapper) {
        renderer.appendChild(wrapper, el)
      }
    } else if (el && target() && el.parentNode !== target()) {
      put(el)
    }
  }

  const unwrap = () => {
    if (!wrapper) {
      return
    }
    if (el?.parentNode === wrapper) {
      renderer.insertBefore(wrapper.parentNode, el, wrapper)
    }
    renderer.removeChild(wrapper.parentNode, wrapper)
    wrapper = undefined
  }

  const take = (node: Node | undefined) => {
    if (node?.parentNode) {
      renderer.removeChild(node.parentNode, node)
    }
  }

  const presence = {
    at: anchor,
    leave: () => {
      take(el)
      take(wrapper)
    },
    back: arrange,
  }

  const placement: Placement = {
    place: (next) => {
      el = next
      arrange()
      watchPresence(presence)
    },
    forget: () => {
      unwatchPresence(presence)
      el = undefined
    },
    providers: [{ provide: InheritedContainer, useValue: resolved }],
  }

  const viewportElement = {
    show: () => {
      arrange()
      return wrapper
    },
    hide: unwrap,
    at: anchor,
  }

  return { placement, viewportElement }
}

/**
 * Makes a structural directive one part of a popup, like its content or
 * backdrop: `injectPresentPart`, rendered into `container` or the one the
 * popup around it renders into. A part that can show as a sheet passes the
 * popup's `viewport` slot: while that's present, the part sits in a viewport
 * element the layer makes around it. Call it in a field initializer and its
 * `init()` from `ngOnInit`.
 * @experimental
 */
function injectPopupPart<P extends Primitive, S extends SlotName<P>>(
  handle: PrimitiveHandle<P>,
  slot: S,
  props = () => ({}) as PropsOf<P, S>,
  {
    container,
    viewport,
  }: { container?: () => PopupContainer; viewport?: SlotName<P> } = {}
) {
  const layer = createLayer(handle, container, viewport)
  const part = injectPresentPart(handle, slot, props, layer.placement)
  if (!viewport) {
    return part
  }
  const sheet = bindPart(
    () => handle,
    viewport,
    () => ({}) as never,
    layer.viewportElement
  )
  return {
    ...part,
    init: () => {
      part.init()
      sheet.init()
    },
  }
}

export { injectPopupPart, type PopupContainer }
