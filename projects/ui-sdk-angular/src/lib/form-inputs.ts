import type { Primitive, SlotName } from "@ui-sdk/core"
import { isPlatformBrowser } from "@angular/common"
import {
  DestroyRef,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  Renderer2,
  signal,
  untracked,
} from "@angular/core"
import { createBinding } from "./binding"
import { bindPart } from "./part"
import type { PrimitiveHandle } from "./primitive"

// A list's form inputs, like a select's, are infrastructure no adapter
// exposes as parts, so the adapter makes them right after the list's root:
// one `form-input`, and with `multiple` a `value-input` per selected value.
function injectFormInputs<P extends Primitive>(
  handle: PrimitiveHandle<P>,
  values: () => string[]
) {
  const renderer = inject(Renderer2)
  const root = inject(ElementRef).nativeElement as Node
  // The server's markup would have nodes hydration doesn't expect.
  const browser = isPlatformBrowser(inject(PLATFORM_ID))
  const made: Node[] = []
  const after = () =>
    [...made].reverse().find((node) => node.parentNode === root.parentNode) ??
    root

  const make = () => {
    const input = renderer.createElement("input") as HTMLInputElement
    renderer.insertBefore(root.parentNode, input, after().nextSibling)
    made.push(input)
    return input
  }
  const remove = (input: Node) => {
    made.splice(made.indexOf(input), 1)
    renderer.removeChild(input.parentNode, input)
  }

  let formInput: HTMLInputElement | undefined
  const part = bindPart(
    () => handle,
    "form-input" as SlotName<P>,
    () => ({}) as never,
    {
      show: () =>
        browser && root.parentNode ? (formInput ??= make()) : undefined,
      hide: () => {},
      at: root,
    }
  )

  const inputs = new Map<
    string,
    { input: HTMLInputElement; stop: () => void }
  >()
  const state = signal({} as never)
  if (browser) {
    effect(() => {
      handle.version()
      const next = new Set(values())
      untracked(() => {
        for (const [key, { input, stop }] of inputs) {
          if (!next.has(key)) {
            stop()
            remove(input)
            inputs.delete(key)
          }
        }
        for (const key of next) {
          if (inputs.has(key) || !root.parentNode) {
            continue
          }
          const input = make()
          const binding = createBinding(
            handle,
            "value-input" as SlotName<P>,
            { show: () => input, hide: () => {}, at: input },
            state,
            () => ({ id: key, value: key }) as never
          )
          binding.start(true)
          inputs.set(key, { input, stop: () => binding.destroy() })
        }
      })
    })
  }

  inject(DestroyRef).onDestroy(() => {
    inputs.forEach(({ stop }) => stop())
    made.slice().forEach(remove)
  })

  return part
}

export { injectFormInputs }
