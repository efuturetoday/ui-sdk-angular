import { Directive, inject, input, output, type OnInit } from "@angular/core"
import {
  imageCropper,
  type ImageCrop,
  type ImageCropperController,
  type ImageCropperCropChangeDetails,
  type ImageCropperCropCommitDetails,
  type ImageCropperFlipDirection,
  type ImageCropperHandlePosition,
  type ImageCropperMode,
  type ImageCropperPrimitive,
  type ImageCropperShape,
} from "@ui-sdk/core/image-cropper"
import {
  optionalBoolean,
  injectPart,
  injectHandle,
  injectPrimitive,
  type PrimitiveHandle,
  provideRoot,
  ɵUiIds as UiIds,
} from "ngx-ui-sdk"

/**
 * A group around an image and its controls, on the element it's written on,
 * busy until the image loads. `[(crop)]` controls it.
 * @experimental
 */
@Directive({
  selector: "[uiImageCropper]",
  exportAs: "uiImageCropper",
  providers: [provideRoot(imageCropper, () => UiImageCropper)],
})
class UiImageCropper implements OnInit {
  /** The image to crop. */
  readonly src = input<string>()
  /** The crop, in pixels of the image. Bind it, or `[(crop)]`, to control it. */
  readonly crop = input<ImageCrop>()
  /** The crop at first, when uncontrolled. */
  readonly defaultCrop = input<ImageCrop>()
  /** Whether the selection moves over the image, `"box"`, or the image moves under it, `"frame"`. */
  readonly mode = input<ImageCropperMode>()
  /** Keeps the selection at this width over height. */
  readonly aspectRatio = input<number>()
  /** The selection's shape. */
  readonly shape = input<ImageCropperShape>()
  /** The smallest the selection gets, in pixels of the image. */
  readonly minWidth = input<number>()
  /** The smallest the selection gets, in pixels of the image. */
  readonly minHeight = input<number>()
  /** The most the image zooms in. */
  readonly maxZoom = input<number>()
  /** Stops every way to change the crop. */
  readonly disabled = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Sets the crop from anywhere. Create one with `createImageCropperController()`. */
  readonly controller = input<ImageCropperController>()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input<boolean | undefined, unknown>(undefined, {
    transform: optionalBoolean,
  })
  /** Emits the new crop once a change isn't canceled, for `[(crop)]`. */
  readonly cropChange = output<Required<ImageCrop>>()
  /** Emits before the crop changes. `details.cancel()` keeps it. */
  readonly beforeCropChange = output<{
    crop: Required<ImageCrop>
    details: ImageCropperCropChangeDetails
  }>()
  /** Emits once a drag, key press or other interaction settles on a crop. */
  readonly cropCommit = output<{
    crop: Required<ImageCrop>
    details: ImageCropperCropCommitDetails
  }>()
  readonly handle: PrimitiveHandle<ImageCropperPrimitive> = injectPrimitive(
    imageCropper,
    () => ({
      src: this.src(),
      crop: this.crop(),
      defaultCrop: this.defaultCrop(),
      mode: this.mode(),
      aspectRatio: this.aspectRatio(),
      shape: this.shape(),
      minWidth: this.minWidth(),
      minHeight: this.minHeight(),
      maxZoom: this.maxZoom(),
      disabled: this.disabled(),
      controller: this.controller(),
      debug: this.debug(),
      onCropChange: (
        crop: Required<ImageCrop>,
        details: ImageCropperCropChangeDetails
      ) => {
        this.beforeCropChange.emit({ crop, details })
        if (!details.canceled) {
          this.cropChange.emit(crop)
        }
      },
      onCropCommit: (
        crop: Required<ImageCrop>,
        details: ImageCropperCropCommitDetails
      ) => this.cropCommit.emit({ crop, details }),
    })
  )
  readonly #part = injectPart(this.handle, "root")
  /** The cropper's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.handle.init()
    this.#part.init()
  }
}

/**
 * The area the image shows in. Give it a size; its padding keeps the image off its edges. In a frame, a pointer pans the image and the wheel zooms it.
 * @experimental
 */
@Directive({
  selector: "[uiImageCropperViewport]",
  exportAs: "uiImageCropperViewport",
})
class UiImageCropperViewport implements OnInit {
  readonly #part = injectPart(injectHandle(imageCropper), "viewport")
  /** The part's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The image, from the root's `src`, turned and flipped, on an `<img>`. Give it an `alt`.
 * @experimental
 */
@Directive({
  selector: "img[uiImageCropperImage]",
  exportAs: "uiImageCropperImage",
})
class UiImageCropperImage implements OnInit {
  readonly #part = injectPart(injectHandle(imageCropper), "image")
  /** The part's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * The crop. A pointer drags it in a box; arrows move it, plus and minus zoom, and R turns the image.
 * @experimental
 */
@Directive({
  selector: "[uiImageCropperSelection]",
  exportAs: "uiImageCropperSelection",
})
class UiImageCropperSelection implements OnInit {
  readonly #part = injectPart(injectHandle(imageCropper), "selection")
  /** The part's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * Lines across the selection in thirds, for CSS to draw, with `data-dragging` during a drag.
 * @experimental
 */
@Directive({
  selector: "[uiImageCropperGrid]",
  exportAs: "uiImageCropperGrid",
})
class UiImageCropperGrid implements OnInit {
  readonly #part = injectPart(injectHandle(imageCropper), "grid")
  /** The part's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A range input for the zoom, from 1 to `maxZoom`.
 * @experimental
 */
@Directive({
  selector: "input[uiImageCropperZoom]",
  exportAs: "uiImageCropperZoom",
})
class UiImageCropperZoom implements OnInit {
  readonly #part = injectPart(injectHandle(imageCropper), "zoom")
  /** The part's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A button that turns the image a quarter clockwise.
 * @experimental
 */
@Directive({
  selector: "[uiImageCropperRotate]",
  exportAs: "uiImageCropperRotate",
})
class UiImageCropperRotate implements OnInit {
  readonly #part = injectPart(injectHandle(imageCropper), "rotate")
  /** The part's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * An edge or corner of the selection, by its `position`, that resizes it in a box.
 * @experimental
 */
@Directive({
  selector: "[uiImageCropperHandle]",
  exportAs: "uiImageCropperHandle",
})
class UiImageCropperHandle implements OnInit {
  /** Which edge or corner it is. */
  readonly position = input.required<ImageCropperHandlePosition>()
  readonly #id = inject(UiIds).next()
  readonly #part = injectPart(injectHandle(imageCropper), "handle", () => ({
    id: this.#id,
    position: this.position(),
  }))
  /** The handle's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

/**
 * A button that mirrors the image, left to right or, with
 * `direction="vertical"`, top to bottom.
 * @experimental
 */
@Directive({ selector: "[uiImageCropperFlip]", exportAs: "uiImageCropperFlip" })
class UiImageCropperFlip implements OnInit {
  /** Which way it mirrors the image. */
  readonly direction = input<ImageCropperFlipDirection>()
  readonly #part = injectPart(injectHandle(imageCropper), "flip", () => ({
    direction: this.direction(),
  }))
  /** The flip's state. */
  readonly state = this.#part.state

  ngOnInit() {
    this.#part.init()
  }
}

export { createImageCropperController } from "@ui-sdk/core/image-cropper"
export type {
  ImageCrop,
  ImageCropperApi,
  ImageCropperChangeOptions,
  ImageCropperController,
  ImageCropperCropChangeDetails,
  ImageCropperCropChangeReason,
  ImageCropperCropCommitDetails,
  ImageCropperFlipDirection,
  ImageCropperFlipProps,
  ImageCropperHandlePosition,
  ImageCropperHandleProps,
  ImageCropperHandleState,
  ImageCropperMode,
  ImageCropperOptions,
  ImageCropperPrimitive,
  ImageCropperShape,
  ImageCropperState,
  ImageRotation,
} from "@ui-sdk/core/image-cropper"

export {
  UiImageCropper,
  UiImageCropperFlip,
  UiImageCropperGrid,
  UiImageCropperHandle,
  UiImageCropperImage,
  UiImageCropperRotate,
  UiImageCropperSelection,
  UiImageCropperViewport,
  UiImageCropperZoom,
}
