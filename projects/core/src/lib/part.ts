import type { Attrs, Primitive, PropsOf, SlotName, StateOf } from "@ui-sdk/core"
import { applyAttrs, partState, releaseAttrs } from "@ui-sdk/core/renderer"
import { isPlatformBrowser } from "@angular/common"
import {
  afterNextRender,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injectable,
  PLATFORM_ID,
  untracked,
  signal,
} from "@angular/core"
import { createBinding, type JoinedPart, type PartElement } from "./binding"
import { unwatchPresence, watchPresence } from "./presence"
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
  join?: JoinedPart,
  claims?: HTMLElement
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
    at: element.at,
  }

  // A binding on the part's own element can read its state before Angular
  // sets the inputs, when a required one throws, so until `init()` the state
  // is the part's without props.
  const ready = signal(false)

  // Only a connected part has no instance, and it passes `unbound`.
  const liveVersion = signal(0)
  const state = computed(() => {
    const handle = target()
    if (!handle) {
      return unbound?.state() as StateOf<P, S>
    }
    handle.version()
    liveVersion()
    const current = ready() ? props() : ({} as PropsOf<P, S>)
    return partState(handle.instance.part(slot, current)) as StateOf<P, S>
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
    binding = createBinding(
      handle,
      slot,
      tracked,
      state,
      () => untracked(props),
      join,
      () => liveVersion.update((version) => version + 1)
    )
    binding.start(rendered)
  }

  // A part lets go of the page while its view is out of the document, and
  // binds again once it's back.
  const presence = {
    at: element.at,
    leave: () => binding?.suspend(),
    back: () => binding?.resume(),
  }

  const init = () => {
    if (started) {
      return
    }
    if (claims) {
      claim(claims, props)
    }
    started = true
    ready.set(true)
    rendered = browser && firstRender.done
    connect()
    if (browser) {
      watchPresence(presence)
    }
  }

  // It starts on its own in its first effect run, once Angular has set the
  // inputs; a directive that calls `init()` in `ngOnInit` starts it sooner.
  effect(() => untracked(init))

  effect(() => {
    target()
    if (!ready()) {
      return
    }
    props()
    untracked(() => {
      if (started) {
        connect()
        binding?.update()
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
    unwatchPresence(presence)
    binding?.destroy()
    if (unbound) {
      releaseAttrs(unbound.el, "unbound")
    }
  })

  return { init, state, element: shown.asReadonly() }
}

/**
 * Makes this directive's element one part of a primitive, for a part that's
 * always present. Call it in a field initializer; it starts once Angular has
 * set the inputs. `state` is the part's state. `join` makes the element a part of
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
    { show: () => el, hide: () => {}, at: el },
    undefined,
    join,
    el
  )
}

// An attribute named like one of the part's props, like `disabled` on a menu
// trigger, is that prop, so it goes as the part starts and core and the host
// bindings decide it. See the design's "Lifecycle".
function claim(el: HTMLElement, props: () => object) {
  for (const key in untracked(props)) {
    const name = key.toLowerCase()
    if (name !== "id" && el.hasAttribute(name)) {
      el.removeAttribute(name)
    }
  }
}

/**
 * A part that renders no element, only its state, like a combobox's value
 * read on an `ng-container`. Call it in a field initializer; it starts once
 * Angular has set the inputs.
 * @experimental
 */
function injectStatePart<P extends Primitive, S extends SlotName<P>>(
  handle: PrimitiveHandle<P>,
  slot: S,
  props = () => ({}) as PropsOf<P, S>
) {
  const at = inject(ElementRef).nativeElement as Node
  return bindPart(() => handle, slot, props, {
    show: () => undefined,
    hide: () => {},
    at,
  })
}

/**
 * Makes this directive's element one part of whichever instance `target`
 * gives, like a hidden input of the checkbox its input names. While it gives
 * none, the element shows `unbound`. Call it in a field initializer; it
 * starts once Angular has set the inputs.
 * @experimental
 */
function injectTargetPart<P extends Primitive, S extends SlotName<P>>(
  target: () => PrimitiveHandle<P> | undefined,
  slot: S,
  props = () => ({}) as PropsOf<P, S>,
  unbound?: Unbound<StateOf<P, S>>,
  join?: JoinedPart
) {
  const el = inject(ElementRef).nativeElement as HTMLElement
  return bindPart(
    target,
    slot,
    props,
    { show: () => el, hide: () => {}, at: el },
    unbound && { ...unbound, el },
    join,
    el
  )
}

/**
 * Makes this directive's element one part of the instance `controller` is
 * attached to, from anywhere on the page, or else of the root it sits in,
 * like a dialog's trigger in a table row. Until that instance is on the page,
 * the element shows `unbound`. Call it in a field initializer; it starts once
 * Angular has set the inputs. `target` is the instance it's a part of.
 * @experimental
 */
function injectConnectedPart<P extends Primitive, S extends SlotName<P>>(
  primitive: P,
  controller: () => object | undefined,
  slot: S,
  props: () => PropsOf<P, S>,
  unbound: Unbound<StateOf<P, S>>,
  join?: JoinedPart
) {
  const nearest = inject(tokenOf(primitive), { optional: true })?.handle
  const target = computed(() => {
    const current = controller()
    return (current && controlledBy<P>(current)()) ?? nearest
  })
  return { ...injectTargetPart(target, slot, props, unbound, join), target }
}

export {
  bindPart,
  injectConnectedPart,
  injectPart,
  injectStatePart,
  injectTargetPart,
  type JoinedPart,
  type Unbound,
}
