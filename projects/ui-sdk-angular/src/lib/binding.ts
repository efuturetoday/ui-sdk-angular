import type {
  Attrs,
  Part,
  Primitive,
  PropsOf,
  SlotName,
  StateOf,
} from "@ui-sdk/core"
import {
  applyAttrs,
  attrs as partAttrs,
  bind,
  present as isPresent,
  releaseAttrs,
  renderVersion,
  selectedKeys,
  subscribe,
  takeOwnId,
} from "@ui-sdk/core/renderer"
import type { Signal } from "@angular/core"
import { afterRendered, inRender, schedule } from "./commit"
import type { PrimitiveHandle } from "./primitive"

// Where a part's element comes from: a directive's own element, or the one a
// structural part creates while the part is present. `at` is its place in the
// template: the element, or the structural part's anchor.
type PartElement<State> = {
  show: (state: Signal<State>) => HTMLElement | undefined
  hide: () => void
  at: Node
}

/**
 * Another instance's part on the same element, like a field's control on a
 * checkbox: its attributes merge into the part's with `merge`, and both bind.
 * @experimental
 */
type JoinedPart = {
  part: () => Part
  merge: (own: Attrs, joined: Attrs) => Attrs
}

// One part of one instance on its element: attributes, behavior once the page
// has rendered, and changes in the next commit; suspended, it lets go of the
// page. `props` is read again as it attaches, once its content has rendered.
function createBinding<P extends Primitive, S extends SlotName<P>>(
  handle: PrimitiveHandle<P>,
  slot: S,
  element: PartElement<StateOf<P, S>>,
  state: Signal<StateOf<P, S>>,
  props: () => PropsOf<P, S>,
  join?: JoinedPart,
  live?: () => void
) {
  let current: PropsOf<P, S> | undefined
  let record: Part | undefined
  let selected: string | undefined
  let shown: boolean | undefined
  let version = 0
  let pageRendered = false
  let suspended = false
  let destroyed = false
  let el: HTMLElement | undefined
  let unwatch: (() => void) | undefined
  let unwatchJoined: (() => void) | undefined
  let unbind: (() => void) | undefined

  const channel = `render:${handle.instance.id}`
  const part = () => handle.instance.part(slot, current) as Part

  // A part hears only changes that can affect it, so a highlight change
  // reaches the two items it moves between, not every part.
  const watch = () => {
    unwatch?.()
    record = part()
    selected = selectedKeys(record)
    version = renderVersion(handle.instance)
    const watched = record
    unwatch = subscribe(watched, (liveOnly) => {
      if (isPresent(watched) !== shown) {
        version = renderVersion(handle.instance)
        return syncSoon()
      }
      // Live state, like which item is highlighted, changes without a render
      // and reaches only the parts it affects; their state follows it.
      if (liveOnly) {
        live?.()
        return
      }
      if (renderVersion(handle.instance) === version) {
        return
      }
      version = renderVersion(handle.instance)
      syncSoon()
    })
    unwatchJoined?.()
    unwatchJoined =
      join &&
      subscribe(join.part(), (liveOnly) => {
        if (!liveOnly) {
          syncSoon()
        }
      })
  }

  // Binding can change state, which syncs the part again. It counts as bound
  // from the start, so a nested sync never binds it twice.
  const attach = (record: Part, target: HTMLElement) => {
    let cleanup: (() => void) | undefined
    let released = false
    unbind = () => {
      released = true
      cleanup?.()
    }
    const cleanups = [bind(record, target)]
    if (join) {
      cleanups.push(bind(join.part(), target))
    }
    cleanup = () => cleanups.forEach((stop) => stop())
    if (released) {
      cleanup()
    }
  }

  const release = () => {
    const stop = unbind
    unbind = undefined
    stop?.()
  }

  const sync = () =>
    inRender(() => {
      const record = part()
      shown = isPresent(record)
      if (!shown) {
        release()
        element.hide()
        el = undefined
        return
      }
      if (suspended) {
        return
      }
      el = element.show(state)
      if (!el) {
        return
      }
      takeOwnId(record, el.id || undefined)
      const attrs = partAttrs(record)
      applyAttrs(
        el,
        join ? join.merge(attrs, partAttrs(join.part())) : attrs,
        channel
      )
      afterRendered(el, () => {
        if (pageRendered && !destroyed && !suspended && !unbind && el) {
          read()
          attach(part(), el)
        }
      })
    })

  // A part keyed anew, like an item given another value, binds again.
  const read = () => {
    const next = props()
    if (current !== undefined && part() !== handle.instance.part(slot, next)) {
      release()
    }
    current = next
    if (record && (part() !== record || selectedKeys(part()) !== selected)) {
      watch()
    }
  }

  const syncLive = () => {
    if (!destroyed) {
      sync()
    }
  }
  const syncSoon = () => schedule(syncLive, element.at)

  return {
    // Writes the part's attributes now, so the server's HTML has them.
    start(isRendered: boolean) {
      current = props()
      pageRendered = isRendered
      watch()
      sync()
    },
    update() {
      read()
      syncSoon()
    },
    render() {
      pageRendered = true
      sync()
    },
    suspend() {
      suspended = true
      release()
    },
    resume() {
      suspended = false
      syncSoon()
    },
    destroy() {
      destroyed = true
      unwatch?.()
      unwatchJoined?.()
      release()
      if (el) {
        releaseAttrs(el, channel)
      }
      element.hide()
    },
  }
}

export { createBinding, type JoinedPart, type PartElement }
