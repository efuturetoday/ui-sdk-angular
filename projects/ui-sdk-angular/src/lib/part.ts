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
  partState,
  portalTarget,
  present as isPresent,
  releaseAttrs,
  renderVersion,
  selectedKeys,
  subscribe,
  takeOwnId,
} from "@ui-sdk/core/renderer"
import { isPlatformBrowser } from "@angular/common"
import {
  afterNextRender,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  PLATFORM_ID,
  TemplateRef,
  untracked,
  ViewContainerRef,
  signal,
  type EmbeddedViewRef,
  type Signal,
} from "@angular/core"
import { controlledBy, tokenOf, type PrimitiveHandle } from "./primitive"

// Whether the app has rendered once in a browser. Parts made since, like
// those a structural part renders as it appears, bind as they init, children
// first, as React and Vue bind them; the first render's parts wait for it.
@Injectable({ providedIn: "root" })
class FirstRender {
  done = false

  constructor() {
    afterNextRender(() => (this.done = true))
  }
}

// Where a part's element comes from: a directive's own element, or the one a
// structural part creates while the part is present.
type PartElement<State> = {
  show: (state: Signal<State>) => HTMLElement | undefined
  hide: () => void
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

// One part of one instance on its element: writes its attributes, attaches
// its behavior once `render()` says the page has rendered, and follows the
// changes that can affect it. Made and dropped as a part finds its instance.
function createBinding<P extends Primitive, S extends SlotName<P>>(
  handle: PrimitiveHandle<P>,
  slot: S,
  element: PartElement<StateOf<P, S>>,
  state: Signal<StateOf<P, S>>,
  join?: JoinedPart
) {
  let current: PropsOf<P, S> | undefined
  let record: Part | undefined
  let selected: string | undefined
  let shown: boolean | undefined
  let version = 0
  let rendered = false
  let destroyed = false
  let queued = false
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
      if (liveOnly || renderVersion(handle.instance) === version) {
        return
      }
      version = renderVersion(handle.instance)
      sync()
    })
    unwatchJoined?.()
    unwatchJoined =
      join &&
      subscribe(join.part(), (liveOnly) => {
        if (!liveOnly) {
          sync()
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

  const sync = () => {
    const record = part()
    shown = isPresent(record)
    if (!shown) {
      release()
      element.hide()
      el = undefined
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
    if (rendered && !unbind) {
      attach(record, el)
    }
  }

  // A part that appears or leaves renders a microtask later, as Vue renders,
  // so core finishes the change, like its open steps, before the part binds.
  const syncSoon = () => {
    if (queued) {
      return
    }
    queued = true
    queueMicrotask(() => {
      queued = false
      if (!destroyed) {
        sync()
      }
    })
  }

  return {
    start(props: PropsOf<P, S>, isRendered: boolean) {
      current = props
      rendered = isRendered
      watch()
      sync()
    },
    setProps(next: PropsOf<P, S>) {
      if (next === current) {
        return
      }
      const rekeyed = part() !== handle.instance.part(slot, next)
      current = next
      if (rekeyed) {
        release()
      }
      if (part() !== record || selectedKeys(part()) !== selected) {
        watch()
      }
      sync()
    },
    render() {
      rendered = true
      sync()
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

/**
 * What a connected part shows while it has no instance yet, like a trigger
 * whose dialog hasn't mounted: attributes for its element, and its state.
 * @experimental
 */
type Unbound<State> = {
  attrs: () => Attrs
  state: () => State
}

// A part bound to whichever instance `target` gives, again whenever that
// changes, and to none while it gives none.
function bindPart<P extends Primitive, S extends SlotName<P>>(
  target: () => PrimitiveHandle<P> | undefined,
  slot: S,
  props: () => PropsOf<P, S>,
  element: PartElement<StateOf<P, S>>,
  unbound?: Unbound<StateOf<P, S>> & { el: HTMLElement },
  join?: JoinedPart
) {
  const browser = isPlatformBrowser(inject(PLATFORM_ID))
  const firstRender = inject(FirstRender)
  let started = false
  let rendered = false
  let boundTo: PrimitiveHandle<P> | undefined
  let binding: ReturnType<typeof createBinding<P, S>> | undefined
  const shown = signal<HTMLElement | undefined>(undefined)
  const tracked: PartElement<StateOf<P, S>> = {
    show: (state) => {
      const el = element.show(state)
      shown.set(el)
      return el
    },
    hide: () => {
      element.hide()
      shown.set(undefined)
    },
  }

  // Only a connected part has no instance, and it passes `unbound`.
  const state = computed(() => {
    const handle = target()
    if (!handle) {
      return unbound?.state() as StateOf<P, S>
    }
    handle.version()
    return partState(handle.instance.part(slot, props())) as StateOf<P, S>
  })

  const connect = () => {
    const handle = untracked(target)
    if (handle === boundTo) {
      return
    }
    binding?.destroy()
    binding = undefined
    boundTo = handle
    if (!handle) {
      if (unbound) {
        applyAttrs(unbound.el, untracked(unbound.attrs), "unbound")
      }
      return
    }
    if (unbound) {
      releaseAttrs(unbound.el, "unbound")
    }
    binding = createBinding(handle, slot, tracked, state, join)
    binding.start(untracked(props), rendered)
  }

  const init = () => {
    if (started) {
      return
    }
    started = true
    rendered = browser && firstRender.done
    connect()
  }

  effect(() => {
    target()
    const next = props()
    untracked(() => {
      if (started) {
        connect()
        binding?.setProps(next)
      }
    })
  })

  if (browser) {
    afterNextRender(() => {
      init()
      rendered = true
      binding?.render()
    })
  }

  inject(DestroyRef).onDestroy(() => {
    binding?.destroy()
    if (unbound) {
      releaseAttrs(unbound.el, "unbound")
    }
  })

  return { init, state, element: shown.asReadonly() }
}

/**
 * Makes this directive's element one part of a primitive, for a part that's
 * always present. Call it in a field initializer and its `init()` from
 * `ngOnInit`. `state` is the part's state. `join` makes the element a part of
 * another instance too, like a field's control.
 * @experimental
 */
function injectPart<P extends Primitive, S extends SlotName<P>>(
  handle: PrimitiveHandle<P>,
  slot: S,
  props = () => ({}) as PropsOf<P, S>,
  join?: JoinedPart
) {
  const el = inject(ElementRef).nativeElement as HTMLElement
  return bindPart(
    () => handle,
    slot,
    props,
    { show: () => el, hide: () => {} },
    undefined,
    join
  )
}

/**
 * Makes this directive's element one part of whichever instance `target`
 * gives, like a hidden input of the checkbox its input names. While it gives
 * none, the element shows `unbound`. Call it in a field initializer and its
 * `init()` from `ngOnInit`.
 * @experimental
 */
function injectTargetPart<P extends Primitive, S extends SlotName<P>>(
  target: () => PrimitiveHandle<P> | undefined,
  slot: S,
  props = () => ({}) as PropsOf<P, S>,
  unbound?: Unbound<StateOf<P, S>>
) {
  const el = inject(ElementRef).nativeElement as HTMLElement
  return bindPart(
    target,
    slot,
    props,
    { show: () => el, hide: () => {} },
    unbound && { ...unbound, el }
  )
}

/**
 * Makes this directive's element one part of the instance `controller` is
 * attached to, from anywhere on the page, or else of the root it sits in,
 * like a dialog's trigger in a table row. Until that instance is on the page,
 * the element shows `unbound`. Call it in a field initializer and its `init()`
 * from `ngOnInit`; `target` is the instance it's a part of.
 * @experimental
 */
function injectConnectedPart<P extends Primitive, S extends SlotName<P>>(
  primitive: P,
  controller: () => object | undefined,
  slot: S,
  props: () => PropsOf<P, S>,
  unbound: Unbound<StateOf<P, S>>
) {
  const nearest = inject(tokenOf(primitive), { optional: true })?.handle
  const target = computed(() => {
    const current = controller()
    return (current && controlledBy<P>(current)()) ?? nearest
  })
  return { ...injectTargetPart(target, slot, props, unbound), target }
}

type PopupContainer = Element | DocumentFragment | null | undefined

// The container the nearest popup above renders into. Popups inside it render
// there too, like a menu inside a portaled popover, unless they name their own.
const InheritedContainer = new InjectionToken<() => PopupContainer>(
  "popup-container"
)

/**
 * The context a structural part's template gets: `let state` is the part's state.
 * @experimental
 */
type PresentPartContext<State> = { $implicit: Signal<State> }

/**
 * Makes a structural directive one part of a primitive whose presence core
 * decides, like a dialog's content: it creates its template while the part is
 * present, and the part is the template's first element. A popup's root part
 * passes its `container`, and renders into it, or into the one the popup
 * around it renders into. Call it in a field initializer and its `init()`
 * from `ngOnInit`.
 * @experimental
 */
function injectPresentPart<P extends Primitive, S extends SlotName<P>>(
  handle: PrimitiveHandle<P>,
  slot: S,
  props = () => ({}) as PropsOf<P, S>,
  container?: () => PopupContainer
) {
  const template =
    inject<TemplateRef<PresentPartContext<StateOf<P, S>>>>(TemplateRef)
  const viewContainer = inject(ViewContainerRef)
  const inherited = inject(InheritedContainer, { optional: true })
  const resolved = () => container?.() ?? inherited?.()
  const injector = Injector.create({
    providers: [{ provide: InheritedContainer, useValue: resolved }],
    parent: viewContainer.injector,
  })
  let view: EmbeddedViewRef<PresentPartContext<StateOf<P, S>>> | undefined
  return bindPart(() => handle, slot, props, {
    show: (state) => {
      if (!view) {
        view = viewContainer.createEmbeddedView(
          template,
          { $implicit: state },
          { injector }
        )
        // A browser takes a popover out of the top layer when it moves, so
        // the part moves into its container before anything shows it.
        const el = view.rootNodes.find((node: Node) => node.nodeType === 1)
        const target = container ? portalTarget(untracked(resolved)) : null
        if (el && target) {
          target.appendChild(el)
        }
        // Core binds the part and moves focus into it as it appears, so its
        // view renders now, with the parts inside it, as React and Vue do.
        view.detectChanges()
      }
      return view.rootNodes.find((node: Node) => node.nodeType === 1)
    },
    hide: () => {
      view?.destroy()
      view = undefined
    },
  })
}

export {
  injectConnectedPart,
  injectPart,
  injectPresentPart,
  injectTargetPart,
  type JoinedPart,
  type PopupContainer,
  type PresentPartContext,
  type Unbound,
}
