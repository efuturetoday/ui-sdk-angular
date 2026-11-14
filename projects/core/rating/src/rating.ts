import { isPlatformBrowser } from "@angular/common"
import {
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  Renderer2,
  signal,
  untracked,
  type OnInit,
} from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  rating,
  ratingItemValues,
  type RatingController,
  type RatingPrimitive,
  type RatingValueChangeReason,
} from "@ui-sdk/core/rating"
import {
  ɵcreateBinding as createBinding,
  injectFieldControl,
  optionalBoolean,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "@ngx-ui-sdk/core"

/**
 * Why the rating changes.
 * @experimental
 */
type RatingValueChangeDetails = ChangeDetails<RatingValueChangeReason>

/**
 * A star rating, on the element it's written on. Repeat a `uiRatingItem` for
 * each of its `items()`: `@for (index of rating.items(); track index)`.
 * @experimental
 */
@Directive({
  selector: "[uiRating]",
  exportAs: "uiRating",
  providers: [provideRoot(rating, () => UiRating)],
})
class UiRating implements OnInit {
  /** The score, or null for none. Bind it, or `[(value)]`, to control it. */
  readonly value = input<number | null>()
  /** The score at first, when uncontrolled, and after a form reset. */
  readonly defaultValue = input<number | null>()
  /** How many stars there are. */
  readonly max = input(5)
  /** How finely a star splits, like `0.5` for half stars. */
  readonly step = input(1)
  /** Whether pressing the current score clears it. */
  readonly deselectable = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Stops it from changing. Inside a field, the field's `disabled` does too. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Shows the score without letting it change. */
  readonly readOnly = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Whether a form needs a score. */
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** The name the score submits under in a native form. Inside a field, the field's name when left out. */
  readonly name = input<string>()
  /** The id of the form it belongs to, if it isn't inside it. */
  readonly form = input<string>()
  /** Whether arrow keys wrap from the last star to the first. */
  readonly loop = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** What a screen reader says for a score, like "3 of 5 stars". */
  readonly getValueLabel = input<(value: number, max: number) => string>()
  /** Sets the score from anywhere. Create one with `createRatingController()`. */
  readonly controller = input<RatingController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new score once a change isn't canceled, for `[(value)]`. */
  readonly valueChange = output<number | null>()
  /** Emits before the score changes. `details.cancel()` stops it. */
  readonly beforeValueChange = output<{
    value: number | null
    details: RatingValueChangeDetails
  }>()
  readonly #field = injectFieldControl()
  readonly handle: PrimitiveHandle<RatingPrimitive> = injectPrimitive(
    rating,
    () => ({
      value: this.value(),
      defaultValue: this.defaultValue(),
      max: this.max(),
      step: this.step(),
      deselectable: this.deselectable(),
      disabled: this.disabled() || this.#field?.disabled(),
      readOnly: this.readOnly(),
      required: this.required(),
      name: this.name() ?? this.#field?.name(),
      form: this.form(),
      loop: this.loop(),
      getValueLabel: this.getValueLabel(),
      controller: this.controller(),
      debug: this.debug(),
      onValueChange: (
        value: number | null,
        details: RatingValueChangeDetails
      ) => {
        this.beforeValueChange.emit({ value, details })
        if (!details.canceled) {
          this.valueChange.emit(value)
        }
      },
    })
  )
  readonly #part = injectPart(this.handle, "root", undefined, this.#field?.join)
  /** The rating's state. */
  readonly state = this.#part.state
  /** The stars' indexes, from 1 to `max`, to repeat a `uiRatingItem` for. */
  readonly items = computed(() =>
    Array.from({ length: this.max() }, (_, at) => at + 1)
  )

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * One star, for its `index` from 1: put its icon inside, styled by how full
 * `state()` says it is. The radios that pick its scores, a button and a
 * hidden input each, are infrastructure, so it makes them inside itself, over
 * the icon, as Vue does.
 * @experimental
 */
@Directive({ selector: "[uiRatingItem]", exportAs: "uiRatingItem" })
class UiRatingItem implements OnInit {
  /** Which star it is, from 1. */
  readonly index = input.required<number>()
  readonly #root = inject(UiRating)
  readonly #handle = injectHandle(rating)
  readonly #part = injectPart(this.#handle, "item", () => ({
    index: this.index(),
  }))
  /** The star's state, with how full it is. */
  readonly state = this.#part.state
  // Its radios are made once Angular has set its index.
  readonly #ready = signal(false)

  constructor() {
    const host = inject(ElementRef).nativeElement as HTMLElement
    const renderer = inject(Renderer2)
    const browser = isPlatformBrowser(inject(PLATFORM_ID))
    const made = new Map<string, () => void>()
    const state = signal({} as never)
    const bindMade = (slot: "radio" | "input", tag: string, value: string) => {
      const el = renderer.createElement(tag) as HTMLElement
      renderer.appendChild(host, el)
      const binding = createBinding(
        this.#handle,
        slot,
        { show: () => el, hide: () => {}, at: el },
        state,
        () => ({ value }) as never
      )
      binding.start(true)
      return () => {
        binding.destroy()
        renderer.removeChild(host, el)
      }
    }
    // Its scores follow its index and the rating's step.
    effect(() => {
      if (!browser || !this.#ready()) {
        return
      }
      const next = new Set(
        ratingItemValues(this.index(), this.#root.step()).map(String)
      )
      untracked(() => {
        for (const [value, stop] of made) {
          if (!next.has(value)) {
            stop()
            made.delete(value)
          }
        }
        for (const value of next) {
          if (!made.has(value)) {
            const stopRadio = bindMade("radio", "button", value)
            const stopInput = bindMade("input", "input", value)
            made.set(value, () => {
              stopRadio()
              stopInput()
            })
          }
        }
      })
    })
    inject(DestroyRef).onDestroy(() => made.forEach((stop) => stop()))
  }

  ngOnInit() {
    this.#part.init()
    this.#ready.set(true)
  }
}

export { createRatingController, ratingItemValues } from "@ui-sdk/core/rating"
export type {
  RatingApi,
  RatingChangeOptions,
  RatingController,
  RatingItemProps,
  RatingItemState,
  RatingOptions,
  RatingPrimitive,
  RatingState,
  RatingValueChangeReason,
} from "@ui-sdk/core/rating"

export { type RatingValueChangeDetails, UiRating, UiRatingItem }
