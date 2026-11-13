import { isPlatformBrowser } from "@angular/common"
import {
  afterNextRender,
  computed,
  DestroyRef,
  inject,
  linkedSignal,
  PLATFORM_ID,
  signal,
  type Resource,
  type Signal,
} from "@angular/core"
import {
  createAsyncOptions,
  type AsyncOptionsContext,
  type AsyncOptionsOptions,
  type AsyncOptionsState,
  type AsyncOptionsStatus,
} from "@ui-sdk/core/async-options"

/**
 * A resource's items and status for a list, like a select's `[items]` and
 * `[status]`. Its items stay while it loads anew, since a loading resource
 * has no value, so the list never empties as the user types.
 * @experimental
 */
function asyncOptions<Item>(resource: Resource<Item[] | undefined>) {
  const items: Signal<Item[]> = linkedSignal<Item[] | undefined, Item[]>({
    source: () => (resource.hasValue() ? resource.value() : undefined),
    computation: (next, previous) => next ?? previous?.value ?? [],
  })
  const status = computed<AsyncOptionsStatus>(() => {
    const current = resource.status()
    return current === "loading" || current === "reloading"
      ? "loading"
      : current === "error"
        ? "error"
        : "idle"
  })
  return { items, status }
}

/**
 * Options loaded for what the user types, latest first, with pages: core's
 * `createAsyncOptions` as a signal. Pass `setQuery` the list's query and call
 * `loadMore` as it nears its end. Without pages, a `resource` with
 * `asyncOptions` is the simpler way.
 * @experimental
 */
function injectAsyncOptions<Item>(
  load: (
    query: string,
    context: AsyncOptionsContext
  ) => Promise<Item[] | { items: Item[]; hasMore?: boolean }>,
  options?: AsyncOptionsOptions
) {
  // The server never loads, so an `immediate` load starts in the browser once
  // the page has rendered, and shows as loading until then.
  const helper = createAsyncOptions<Item>(load, {
    ...options,
    immediate: false,
  })
  const initial = helper.getState()
  const state = signal<AsyncOptionsState<Item>>(
    options?.immediate ? { ...initial, status: "loading" } : initial
  )
  const stop = helper.subscribe(() => state.set(helper.getState()))
  inject(DestroyRef).onDestroy(() => {
    stop()
    helper.cancel()
  })
  if (options?.immediate && isPlatformBrowser(inject(PLATFORM_ID))) {
    afterNextRender(() => {
      if (helper.getState() === initial) {
        helper.reload()
      }
    })
  }
  return {
    /** The loaded items, the query they're for, and their status. */
    state: state.asReadonly(),
    setQuery: helper.setQuery,
    loadMore: helper.loadMore,
    reload: helper.reload,
    cancel: helper.cancel,
  }
}

export type {
  AsyncOptions,
  AsyncOptionsContext,
  AsyncOptionsOptions,
  AsyncOptionsState,
  AsyncOptionsStatus,
} from "@ui-sdk/core/async-options"
export { createAsyncOptions } from "@ui-sdk/core/async-options"

export { asyncOptions, injectAsyncOptions }
