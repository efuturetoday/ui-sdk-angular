import { Component, DestroyRef, inject } from "@angular/core"
import {
  createToaster,
  UiToast,
  UiToastAction,
  UiToastClose,
  UiToastList,
  UiToastRegion,
  UiToastTitle,
} from "ngx-ui-sdk"
import { injectLog } from "../../shared/log"

@Component({
  selector: "app-example",
  imports: [
    UiToast,
    UiToastAction,
    UiToastClose,
    UiToastList,
    UiToastRegion,
    UiToastTitle,
  ],
  template: `
    <button (click)="archive()">Archive Message</button>
    <section uiToastRegion #region="uiToastRegion" [toaster]="toast">
      <ol uiToastList>
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <div *uiToastTitle></div>
            @if (item.toast.cancel; as cancel) {
              <button uiToastClose [action]="cancel.onCancel">
                {{ cancel.label }}
              </button>
            }
            <button *uiToastAction data-variant="solid"></button>
          </li>
        }
      </ol>
    </section>
  `,
})
class Example {
  protected readonly log = injectLog()
  protected readonly toast = createToaster()

  constructor() {
    inject(DestroyRef).onDestroy(() => this.toast.dismiss())
  }

  protected archive() {
    this.toast("Message archived", {
      action: { label: "Undo", onAction: () => this.log("Message restored") },
      cancel: { label: "Dismiss", onCancel: () => this.log("Kept archived") },
      onDismiss: ({ reason }) => this.log(`Closed (${reason})`),
    })
  }
}

export { Example }
