import { Component, signal } from "@angular/core"
import {
  describeCrop,
  imageCropperFixture,
} from "tests/fixtures/image-cropper"
import { imageCropperOptions } from "tests/fixtures/page"
import {
  createImageCropperController,
  UiImageCropper,
  UiImageCropperFlip,
  UiImageCropperGrid,
  UiImageCropperHandle,
  UiImageCropperImage,
  UiImageCropperRotate,
  UiImageCropperSelection,
  UiImageCropperViewport,
  UiImageCropperZoom,
  type ImageCropperCropChangeDetails,
  type ImageCropperCropCommitDetails,
} from "ui-sdk-angular"

@Component({
  selector: "app-fixture",
  imports: [
    UiImageCropper,
    UiImageCropperFlip,
    UiImageCropperGrid,
    UiImageCropperHandle,
    UiImageCropperImage,
    UiImageCropperRotate,
    UiImageCropperSelection,
    UiImageCropperViewport,
    UiImageCropperZoom,
  ],
  template: `
    <div class="fixture">
      <button type="button">Before</button>
      <div
        uiImageCropper
        [attr.aria-label]="f.label"
        [src]="f.src"
        [mode]="options.mode"
        [shape]="options.shape"
        [disabled]="options.disabled"
        [aspectRatio]="options.aspectRatio"
        [defaultCrop]="options.defaultCrop"
        [controller]="controller"
        (beforeCropChange)="onCropChange($event.crop, $event.details)"
        (cropCommit)="onCropCommit($event.crop, $event.details)"
      >
        <div uiImageCropperViewport>
          <img uiImageCropperImage [alt]="f.alt" />
          <div uiImageCropperSelection>
            <div uiImageCropperGrid></div>
            @for (position of f.handles; track position) {
              <div uiImageCropperHandle [position]="position"></div>
            }
          </div>
        </div>
        <input uiImageCropperZoom />
        <button uiImageCropperRotate>Rotate</button>
        <button uiImageCropperFlip>Flip</button>
      </div>
      <button type="button">After</button>
      <button
        type="button"
        (click)="controller.setCrop({ x: 0, y: 0, width: 100, height: 100 })"
      >
        Use corner
      </button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Committed">{{ committed() }}</output>
    </div>
  `,
})
class Fixture {
  protected readonly f = imageCropperFixture
  protected readonly controller = createImageCropperController()
  protected readonly options = imageCropperOptions() as {
    mode: "box" | "frame"
    shape: "rectangle" | "circle"
    disabled: boolean
    cancel: boolean
    aspectRatio?: number
    defaultCrop?: { x: number; y: number; width: number; height: number }
  }
  protected readonly action = signal("")
  protected readonly committed = signal("")

  protected onCropChange(
    crop: Parameters<typeof describeCrop>[0],
    details: ImageCropperCropChangeDetails
  ) {
    if (this.options.cancel && details.reason !== "image-load") {
      return details.cancel()
    }
    this.action.set(`${describeCrop(crop)}:${details.reason}`)
  }

  protected onCropCommit(
    crop: Parameters<typeof describeCrop>[0],
    details: ImageCropperCropCommitDetails
  ) {
    this.committed.set(`${describeCrop(crop)}:${details.reason}`)
  }
}

export { Fixture }
