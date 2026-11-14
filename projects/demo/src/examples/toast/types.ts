import { Component, DestroyRef, inject } from "@angular/core"
import {
  LucideCircleCheck,
  LucideInfo,
  LucideLoaderCircle,
  LucideOctagonX,
  LucideTriangleAlert,
} from "@lucide/angular"
import {
  createToaster,
  UiToast,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "ngx-ui-sdk/toast"

@Component({
  selector: "app-example",
  imports: [
    LucideCircleCheck,
    LucideInfo,
    LucideLoaderCircle,
    LucideOctagonX,
    LucideTriangleAlert,
    UiToast,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <div data-slot="row">
      <button (click)="toast('Event created')">Default</button>
      <button (click)="toast.success('Changes saved')">Success</button>
      <button (click)="toast.info('A new version is available')">Info</button>
      <button (click)="toast.warning('Storage is almost full')">Warning</button>
      <button (click)="saveFailed()">Error</button>
      <button (click)="uploadPhotos()">Loading</button>
    </div>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      <ol uiToastList>
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <svg lucideCircleCheck data-show="success" aria-hidden="true"></svg>
            <svg lucideInfo data-show="info" aria-hidden="true"></svg>
            <svg
              lucideTriangleAlert
              data-show="warning"
              aria-hidden="true"
            ></svg>
            <svg lucideOctagonX data-show="error" aria-hidden="true"></svg>
            <svg
              lucideLoaderCircle
              data-show="loading"
              aria-hidden="true"
            ></svg>
            <div *uiToastTitle></div>
          </li>
        }
      </ol>
    </section>
  `,
})
class Example {
  protected readonly toast = createToaster()

  constructor() {
    inject(DestroyRef).onDestroy(() => this.toast.dismiss())
  }

  protected saveFailed() {
    this.toast.error("Couldn't save changes")
  }

  protected upload() {
    return new Promise((resolve) => setTimeout(resolve, 2000))
  }

  protected uploadPhotos() {
    this.toast.promise(() => this.upload(), {
      loading: "Uploading photos…",
      success: "Photos uploaded",
      error: "Upload failed",
    })
  }
}

export { Example }
