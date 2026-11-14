import { Component, DestroyRef, inject } from "@angular/core"
import {
  createToaster,
  UiToast,
  UiToastAction,
  UiToastDescription,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "ngx-ui-sdk"

@Component({
  selector: "app-example",
  imports: [
    UiToast,
    UiToastAction,
    UiToastDescription,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <button (click)="saveChanges()">Save Changes</button>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      <ol uiToastList>
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <div data-slot="stack">
              <div *uiToastTitle></div>
              <div *uiToastDescription></div>
            </div>
            <button *uiToastAction data-variant="solid"></button>
          </li>
        }
      </ol>
    </section>
  `,
})
class Example {
  protected readonly toast = createToaster()
  #attempts = 0

  constructor() {
    inject(DestroyRef).onDestroy(() => this.toast.dismiss())
  }

  protected save() {
    const succeeds = ++this.#attempts % 2 === 1
    return new Promise<void>((resolve, reject) =>
      setTimeout(
        () => (succeeds ? resolve() : reject(new Error("Network error"))),
        1500
      )
    )
  }

  protected saveChanges() {
    this.toast.promise(() => this.save(), {
      loading: "Saving changes…",
      success: "Changes saved",
      error: {
        title: "Couldn't save changes",
        description: "Check your connection and try again.",
        action: { label: "Retry", onAction: () => this.saveChanges() },
      },
    })
  }
}

export { Example }
