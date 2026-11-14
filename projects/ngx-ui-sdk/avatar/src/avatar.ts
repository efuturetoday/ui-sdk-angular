import { computed, Directive, input, output, type OnInit } from "@angular/core"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  avatar,
  type AvatarLoadingStatus,
  type AvatarLoadingStatusChangeReason,
  type AvatarPrimitive,
  type AvatarState,
} from "@ui-sdk/core/avatar"
import {
  injectPart,
  injectPresentPart,
  type PresentPartContext,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
} from "ngx-ui-sdk"

/**
 * A box for a person's image and its fallback. Put its image and fallback inside.
 * @experimental
 */
@Directive({
  selector: "[uiAvatar]",
  exportAs: "uiAvatar",
  providers: [provideRoot(avatar, () => UiAvatar)],
})
class UiAvatar implements OnInit {
  /** Emits when the image's loading status changes. `details.reason` says why. */
  readonly loadingStatusChange = output<{
    status: AvatarLoadingStatus
    details: ChangeDetails<AvatarLoadingStatusChangeReason>
  }>()
  readonly handle: PrimitiveHandle<AvatarPrimitive> = injectPrimitive(
    avatar,
    () => ({
      onLoadingStatusChange: (status, details) =>
        this.loadingStatusChange.emit({ status, details }),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The avatar's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * A real `<img>`, hidden until it loads. Every image attribute passes through,
 * like `crossorigin`, `referrerpolicy`, `srcset` and `sizes`.
 * @experimental
 */
@Directive({
  selector: "img[uiAvatarImage]",
  exportAs: "uiAvatarImage",
})
class UiAvatarImage implements OnInit {
  readonly #part = injectPart(injectHandle(avatar), "image")
  /** The image's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Shown while there's no loaded image, after its `delay`, on the element it's
 * written on: `<span *uiAvatarFallback>`.
 * @experimental
 */
@Directive({ selector: "[uiAvatarFallback]" })
class UiAvatarFallback implements OnInit {
  /** How long to wait, in milliseconds, before showing the fallback: `*uiAvatarFallback="let state; delay: 600"`. */
  readonly delay = input<number>(undefined, {
    alias: "uiAvatarFallbackDelay",
  })
  readonly #part = injectPresentPart(
    injectHandle(avatar),
    "fallback",
    computed(() => ({ delay: this.delay() }))
  )

  static ngTemplateContextGuard(
    _directive: UiAvatarFallback,
    _context: unknown
  ): _context is PresentPartContext<AvatarState> {
    return true
  }

  ngOnInit() {
    this.#part.init()
  }
}

export type {
  AvatarFallbackProps,
  AvatarLoadingStatus,
  AvatarLoadingStatusChangeReason,
  AvatarOptions,
  AvatarPrimitive,
  AvatarState,
} from "@ui-sdk/core/avatar"

export { UiAvatar, UiAvatarFallback, UiAvatarImage }
