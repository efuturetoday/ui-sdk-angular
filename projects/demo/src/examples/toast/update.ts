import { Component, DestroyRef, inject } from "@angular/core"
import { LucideCircleCheck, LucideLoaderCircle } from "@lucide/angular"
import {
  createToaster,
  UiToast,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "ui-sdk-angular"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    LucideCircleCheck,
    LucideLoaderCircle,
    UiToast,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <div data-slot="row">
      <button (click)="upload()">Upload Report</button>
      <button (click)="toast.dismiss('upload')">Cancel Upload</button>
      <button (click)="toast.dismiss()">Dismiss All</button>
    </div>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      <ol uiToastList>
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <svg lucideCircleCheck data-show="success" aria-hidden="true"></svg>
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
  protected readonly log = injectLog()
  protected readonly toast = createToaster()
  #timer: ReturnType<typeof setInterval> | undefined

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearInterval(this.#timer)
      this.toast.dismiss()
    })
  }

  protected upload() {
    clearInterval(this.#timer)
    const id = this.toast.loading("Uploading report.pdf… 0%", { id: "upload" })
    let progress = 0
    this.#timer = setInterval(() => {
      progress += 20
      const done = progress >= 100
      const open = this.toast.update(
        id,
        done
          ? { title: "Report uploaded", type: "success" }
          : { title: `Uploading report.pdf… ${progress}%` }
      )
      if (!open) {
        this.log("Upload canceled")
      }
      if (done || !open) {
        clearInterval(this.#timer)
      }
    }, 700)
  }
}

export { Example }
