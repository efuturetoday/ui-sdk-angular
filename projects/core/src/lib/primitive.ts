import type { OptionsOf, Primitive, TypesOf } from "@ui-sdk/core"
import {
  createListSnapshots,
  keep,
  renderVersion,
  unwatched,
} from "@ui-sdk/core/renderer"
import {
  afterNextRender,
  computed,
  DestroyRef,
  effect,
  forwardRef,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  signal,
  untracked,
  type Provider,
  type Signal,
  type Type,
  type WritableSignal,
} from "@angular/core"

// Ids come from creation order, so the server and the hydrating client agree.
@Injectable({ providedIn: "root" })
class UiIds {
  #next = 0
  next() {
    return `ui-sdk-${this.#next++}`
  }
}

/**
 * What `injectPrimitive` returns, and what the parts inside its root inject.
 * @experimental
 */
type PrimitiveHandle<P extends Primitive> = {
  /** The primitive it's an instance of. */
  primitive: P
  /** The core instance, with its `get()`, `part()` and `api`, kept from `init()` on. */
  readonly instance: ReturnType<P>
  /** The methods its definition declares, like Collapsible's `toggle`. */
  readonly api: TypesOf<P>["api"]
  /** The instance's state, which changes with what affects rendering. */
  state: Signal<TypesOf<P>["state"]>
  /** Changes whenever state that affects rendering changes, for parts that read state of their own. */
  version: Signal<number>
  /** Makes the instance with the inputs Angular has set. It runs on its own; call it from `ngOnInit` to make it sooner. */
  init: () => ReturnType<P>
  /** Adds one of core's optional features, like a combobox's chips, to every instance it makes. Parts ask for it with `uses`. */
  use: (feature: Parameters<ReturnType<P>["use"]>[0]) => void
}

/**
 * A directive that owns an instance of a primitive, which its parts inject.
 * @experimental
 */
type PrimitiveRoot<P extends Primitive> = { handle: PrimitiveHandle<P> }

const tokens = new WeakMap<Primitive, InjectionToken<PrimitiveRoot<any>>>()

function tokenOf<P extends Primitive>(primitive: P) {
  let token = tokens.get(primitive)
  if (!token) {
    tokens.set(primitive, (token = new InjectionToken(primitive.name)))
  }
  return token as InjectionToken<PrimitiveRoot<P>>
}

// The instance each controller is attached to, so a part outside its root,
// like a trigger in a table row, can find it.
const controlled = new WeakMap<
  object,
  WritableSignal<PrimitiveHandle<any> | undefined>
>()

function controlledBy<P extends Primitive>(controller: object) {
  let entry = controlled.get(controller)
  if (!entry) {
    controlled.set(controller, (entry = signal(undefined)))
  }
  return entry as WritableSignal<PrimitiveHandle<P> | undefined>
}

/**
 * Provides a root directive to the parts inside it. Put it in the root's `providers`.
 * @experimental
 */
function provideRoot<P extends Primitive>(
  primitive: P,
  root: () => Type<PrimitiveRoot<P>>
) {
  return {
    provide: tokenOf(primitive),
    useExisting: forwardRef(root),
  } satisfies Provider
}

/**
 * The nearest instance of a primitive, for a part directive. Throws outside one.
 * @experimental
 */
function injectHandle<P extends Primitive>(primitive: P) {
  const root = inject(tokenOf(primitive), { optional: true })
  if (!root) {
    throw new Error(
      `${primitive.name} parts must be used inside their root directive.`
    )
  }
  return root.handle
}

const memo = <Value>(compute: () => Value) => {
  const value = computed(compute)
  return () => value()
}

/**
 * Creates an instance of a primitive for this directive, keeps its options
 * current, and destroys it with the directive. Call it in a field initializer
 * with a getter that reads the signal inputs; it makes the instance once
 * Angular has set them.
 * @experimental
 */
function injectPrimitive<P extends Primitive>(
  primitive: P,
  options: () => OptionsOf<P>
) {
  const id = inject(UiIds).next()
  const snapshot = createListSnapshots(primitive, memo)
  const version = signal(0)
  const ready = signal(false)
  // Every instance made, of which the one kept at `init()` stays.
  const made = new Set<ReturnType<P>>()
  let kept: ReturnType<P> | undefined
  // The optional features its parts asked for, in every instance it makes.
  const features = new Set<Parameters<ReturnType<P>["use"]>[0]>()

  // Options like `defaultOpen` count only when it's made, so until `init()`
  // it derives from the options so far, made anew as they change, then it's
  // kept. Making it has no effect outside it, so any read before is safe.
  const instance = computed(() => {
    if (ready()) {
      return kept!
    }
    const start = snapshot({ ...options(), id })
    return untracked(() => {
      const next = unwatched(() => primitive(start)) as ReturnType<P>
      features.forEach((feature) => next.use(feature))
      made.add(next)
      return next
    })
  })

  const init = () => {
    if (!kept) {
      kept = untracked(instance)
      for (const other of made) {
        if (other !== kept) {
          other.destroy()
        }
      }
      made.clear()
      ready.set(true)
    }
    return kept
  }

  // It starts on its own in its first effect run, once Angular has set the
  // inputs; a root that calls `init()` in `ngOnInit` starts it sooner.
  effect(() => untracked(init))

  // Its changes reach Angular through `version`, written only here.
  effect((onCleanup) => {
    const current = instance()
    untracked(() => version.set(renderVersion(current)))
    onCleanup(current.subscribe(() => version.set(renderVersion(current))))
  })

  // A server never keeps an instance, so nothing outlives a request. Nor does
  // it register with its controller, so a trigger outside its root renders
  // the same plain button on the server and before hydration.
  const injector = inject(Injector)
  afterNextRender(() => {
    keep(init())
    effect(
      (onCleanup) => {
        const { controller } = options() as { controller?: object }
        if (!controller) {
          return
        }
        const entry = controlledBy(controller)
        entry.set(handle)
        onCleanup(() => {
          if (untracked(entry) === handle) {
            entry.set(undefined)
          }
        })
      },
      { injector }
    )
  })
  inject(DestroyRef).onDestroy(() => {
    kept?.destroy()
    made.forEach((other) => other.destroy())
  })
  effect(() => {
    const next = snapshot({ ...options(), id })
    if (ready()) {
      untracked(() => kept!.setOptions(next))
    }
  })
  const handle: PrimitiveHandle<P> = {
    primitive,
    init,
    use: (feature) => {
      features.add(feature)
      kept?.use(feature)
      made.forEach((each) => each.use(feature))
    },
    get instance() {
      return instance()
    },
    get api() {
      return instance().api as TypesOf<P>["api"]
    },
    state: computed(() => {
      version()
      return instance().get() as TypesOf<P>["state"]
    }),
    version: version.asReadonly(),
  }
  return handle
}

export {
  controlledBy,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  type PrimitiveRoot,
  provideRoot,
  tokenOf,
  UiIds,
}
