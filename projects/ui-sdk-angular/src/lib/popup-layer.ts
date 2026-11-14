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
  viewport: SlotName<P> | undefined,
  input: (() => HTMLElement | undefined) | undefined
) {
  const renderer = inject(Renderer2)
  const anchor = inject(ViewContainerRef).element.nativeElement as Node
  const inherited = inject(InheritedContainer, { optional: true })
  const resolved = () => container?.() ?? inherited?.()
  let el: HTMLElement | undefined
  let wrapper: HTMLElement | undefined
  let header: HTMLElement | undefined
  let placeholder: Comment | undefined

  // iOS makes a tap a click only where something up to the document handles
  // clicks, and core dismisses at the click of a tap outside, so while a
  // popup shows the document handles them, as React's root does.
  let untap: (() => void) | undefined

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

  // A move takes focus, so a node that had it, like an input, keeps it and
  // its caret: moving is the layer's business, not the user's.
  const move = (node: Node, insert: () => void) => {
    const active = node.ownerDocument?.activeElement
    const focused = !!active && node.contains(active)
    const field = active as HTMLInputElement | null
    const caret = focused
      ? [field?.selectionStart, field?.selectionEnd]
      : undefined
    insert()
    if (focused && active !== node.ownerDocument?.activeElement) {
      ;(active as HTMLElement).focus({ preventScroll: true })
      if (caret?.[0] != null && caret[1] != null) {
        field?.setSelectionRange(caret[0], caret[1])
      }
    }
  }

  // A sheet's input moves into a header at the top of its content while it's
  // open, and back where a placeholder kept its place, as Vue's Teleport and
  // web components do.
  const showHeader = () => {
    const field = input?.()
    if (!el) {
      return
    }
    header ??= renderer.createElement("div") as HTMLElement
    if (header.parentNode !== el) {
      renderer.insertBefore(el, header, el.firstChild)
    }
    if (field && field.parentNode !== header) {
      placeholder = renderer.createComment("") as Comment
      renderer.insertBefore(field.parentNode, placeholder, field)
      move(field, () => renderer.appendChild(header, field))
    }
    return header
  }

  const hideHeader = () => {
    const field = input?.()
    if (field && placeholder?.parentNode) {
      const at = placeholder
      move(field, () => renderer.insertBefore(at.parentNode, field, at))
    }
    take(placeholder)
    take(header)
    placeholder = undefined
    header = undefined
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
      untap ??= renderer.listen("document", "click", () => {})
      arrange()
      watchPresence(presence)
    },
    forget: () => {
      unwatchPresence(presence)
      hideHeader()
      untap?.()
      untap = undefined
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

  const headerElement = { show: showHeader, hide: hideHeader, at: anchor }

  return { placement, viewportElement, headerElement }
}

/**
 * Makes a structural directive one part of a popup, like its content or
 * backdrop: `injectPresentPart`, rendered into `container` or the one the
 * popup around it renders into. A part that can show as a sheet passes the
 * popup's `viewport` slot: while that's present, the part sits in a viewport
 * element the layer makes around it. A list with an input outside its popup,
 * like a combobox's, passes `header` too: while the sheet is open, the input
 * moves into a header the layer makes at the content's top. Call it in a field
 * initializer and its `init()` from `ngOnInit`.
 * @experimental
 */
function injectPopupPart<P extends Primitive, S extends SlotName<P>>(
  handle: PrimitiveHandle<P>,
  slot: S,
  props = () => ({}) as PropsOf<P, S>,
  {
    container,
    viewport,
    header,
  }: {
    container?: () => PopupContainer
    viewport?: SlotName<P>
    header?: { slot: SlotName<P>; input: () => HTMLElement | undefined }
  } = {}
) {
  const layer = createLayer(handle, container, viewport, header?.input)
  const part = injectPresentPart(handle, slot, props, layer.placement)
  const extras = [
    viewport &&
      bindPart(
        () => handle,
        viewport,
        () => ({}) as never,
        layer.viewportElement
      ),
    header &&
      bindPart(
        () => handle,
        header.slot,
        () => ({}) as never,
        layer.headerElement
      ),
  ].filter((extra) => !!extra)
  return {
    ...part,
    init: () => {
      part.init()
      extras.forEach((extra) => extra.init())
    },
  }
}

export { injectPopupPart, type PopupContainer }
